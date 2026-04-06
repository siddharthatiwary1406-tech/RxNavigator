const Anthropic = require('@anthropic-ai/sdk');
const getSystemPrompt = require('./prompts/systemPrompt');
const { searchDrugDatabase } = require('./tools/drugInfoTool');
const { getRemsRequirements } = require('./tools/remsTool');
const { findSpecialtyPharmacies } = require('./tools/pharmacyTool');
const { getPaRequirements } = require('./tools/paTool');
const { webSearch } = require('./tools/webSearchTool');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TOOLS = [
  {
    name: 'search_drug_database',
    description: 'Search internal drug database for prescribing steps, REMS info, specialty pharmacies, and required forms for a specific drug. Always call this first.',
    input_schema: {
      type: 'object',
      properties: {
        drug_name: { type: 'string', description: 'Brand or generic name of the drug' }
      },
      required: ['drug_name']
    }
  },
  {
    name: 'get_rems_requirements',
    description: 'Get REMS program requirements, enrollment steps, and certification requirements for a drug',
    input_schema: {
      type: 'object',
      properties: {
        drug_name: { type: 'string' }
      },
      required: ['drug_name']
    }
  },
  {
    name: 'find_specialty_pharmacies',
    description: 'Find specialty pharmacies that carry a specific drug, optionally filtered by state',
    input_schema: {
      type: 'object',
      properties: {
        drug_name: { type: 'string' },
        state: { type: 'string', description: 'US state abbreviation e.g. TX, CA (optional)' }
      },
      required: ['drug_name']
    }
  },
  {
    name: 'get_pa_requirements',
    description: 'Get prior authorization requirements for a drug by payer/insurance',
    input_schema: {
      type: 'object',
      properties: {
        drug_name: { type: 'string' },
        payer_name: { type: 'string', description: 'Insurance company name e.g. Cigna, UnitedHealth, Aetna (optional)' }
      },
      required: ['drug_name']
    }
  },
  {
    name: 'web_search',
    description: 'Search the web for real-time information about drug availability, payer criteria, pharmacy network changes, or any specialty drug information not found in internal database',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' }
      },
      required: ['query']
    }
  }
];

async function executeTool(toolName, toolInput) {
  switch (toolName) {
    case 'search_drug_database':
      return await searchDrugDatabase(toolInput);
    case 'get_rems_requirements':
      return await getRemsRequirements(toolInput);
    case 'find_specialty_pharmacies':
      return await findSpecialtyPharmacies(toolInput);
    case 'get_pa_requirements':
      return await getPaRequirements(toolInput);
    case 'web_search':
      return await webSearch(toolInput);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

function sendSSE(res, event) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

async function runAgent(query, userId, res) {
  const startTime = Date.now();
  const toolsUsed = [];
  const messages = [{ role: 'user', content: query }];

  // SSE headers must be set before calling this function
  sendSSE(res, { type: 'status', message: 'Agent starting...' });

  let iterations = 0;
  const MAX_ITERATIONS = 10;

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    let response;
    try {
      response = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 4096,
        system: getSystemPrompt(),
        tools: TOOLS,
        messages
      });
    } catch (err) {
      sendSSE(res, { type: 'error', message: `Claude API error: ${err.message}` });
      throw err;
    }

    // Append assistant response to history
    messages.push({ role: 'assistant', content: response.content });

    // If no more tool calls needed, extract final answer
    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text');
      if (!textBlock) {
        sendSSE(res, { type: 'error', message: 'No text response from agent' });
        break;
      }

      let structured;
      try {
        // Strip markdown code fences, then extract the JSON object
        // (Claude sometimes prepends prose before the JSON)
        const stripped = textBlock.text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const start = stripped.indexOf('{');
        const end = stripped.lastIndexOf('}');
        if (start === -1 || end === -1) throw new Error('No JSON object found');
        const rawJson = stripped.slice(start, end + 1);
        structured = JSON.parse(rawJson);
      } catch {
        // If JSON parse fails, return raw text as a partial response
        structured = {
          prescribingSteps: [],
          remsRequired: false,
          remsDetails: null,
          specialtyPharmacies: [],
          paRequirements: { required: false },
          requiredForms: [],
          confidenceScore: 0.4,
          sources: [],
          lastVerified: new Date().toISOString(),
          importantWarnings: [
            'Response could not be fully parsed. Please consult the manufacturer directly.',
            textBlock.text.substring(0, 500)
          ]
        };
      }

      const responseTimeMs = Date.now() - startTime;
      sendSSE(res, {
        type: 'complete',
        data: structured,
        toolsUsed,
        responseTimeMs
      });

      return { structured, toolsUsed, responseTimeMs };
    }

    // Handle tool_use blocks
    if (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
      const toolResults = [];

      for (const toolBlock of toolUseBlocks) {
        const { id, name, input } = toolBlock;
        toolsUsed.push(name);

        sendSSE(res, {
          type: 'tool_call',
          tool: name,
          status: 'running',
          message: getToolMessage(name, input)
        });

        let result;
        try {
          result = await executeTool(name, input);
        } catch (err) {
          result = { error: `Tool execution failed: ${err.message}` };
        }

        sendSSE(res, {
          type: 'tool_call',
          tool: name,
          status: 'done'
        });

        toolResults.push({
          type: 'tool_result',
          tool_use_id: id,
          content: JSON.stringify(result)
        });
      }

      messages.push({ role: 'user', content: toolResults });
    }
  }

  // Max iterations reached
  sendSSE(res, {
    type: 'error',
    message: 'Agent reached maximum iterations without completing'
  });
  return null;
}

function getToolMessage(toolName, input) {
  switch (toolName) {
    case 'search_drug_database':
      return `Searching drug database for ${input.drug_name}...`;
    case 'get_rems_requirements':
      return `Checking REMS requirements for ${input.drug_name}...`;
    case 'find_specialty_pharmacies':
      return `Finding specialty pharmacies for ${input.drug_name}${input.state ? ` in ${input.state}` : ''}...`;
    case 'get_pa_requirements':
      return `Checking prior authorization requirements${input.payer_name ? ` for ${input.payer_name}` : ''}...`;
    case 'web_search':
      return `Searching the web: ${input.query}`;
    default:
      return `Running ${toolName}...`;
  }
}

module.exports = { runAgent };
