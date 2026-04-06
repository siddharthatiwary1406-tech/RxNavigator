const { runAgent } = require('../agents/orchestrator');
const Query = require('../models/Query');
const Feedback = require('../models/Feedback');

exports.queryAgent = async (req, res, next) => {
  const { query } = req.body;
  if (!query || !query.trim())
    return res.status(400).json({ success: false, error: 'Query is required' });

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Keep connection alive
  const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 20000);

  req.on('close', () => clearInterval(heartbeat));

  try {
    const result = await runAgent(query, req.user._id, res);

    if (result) {
      // Save query to DB asynchronously
      Query.create({
        userId: req.user._id,
        queryText: query,
        drugMentioned: extractDrugName(query),
        agentResponse: result.structured,
        toolsUsed: result.toolsUsed,
        responseTimeMs: result.responseTimeMs
      }).catch(console.error);
    }
  } catch (err) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
  } finally {
    clearInterval(heartbeat);
    res.end();
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const queries = await Query.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('queryText drugMentioned agentResponse.confidenceScore createdAt responseTimeMs toolsUsed');
    res.json({ success: true, data: queries });
  } catch (err) {
    next(err);
  }
};

exports.submitFeedback = async (req, res, next) => {
  try {
    const { queryId, rating, comment, flaggedOutdated } = req.body;
    const feedback = await Feedback.create({
      userId: req.user._id,
      queryId,
      rating,
      comment,
      flaggedOutdated: flaggedOutdated || false
    });
    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    next(err);
  }
};

function extractDrugName(query) {
  // Simple heuristic — looks for capitalized words that might be drug names
  const match = query.match(/\b([A-Z][a-z]+(?:umab|mab|inib|tide|stat|pril|sartan|olol)?)\b/);
  return match ? match[1] : null;
}
