const { runAgent } = require('../agents/orchestrator');
const Query = require('../models/Query');
const Drug = require('../models/Drug');
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
      const drugMentioned = extractDrugName(query);

      // Save query to DB asynchronously
      Query.create({
        userId: req.user._id,
        queryText: query,
        drugMentioned,
        agentResponse: result.structured,
        toolsUsed: result.toolsUsed,
        responseTimeMs: result.responseTimeMs
      }).catch(console.error);

      // Auto-enrich drug DB with fresh data from this search
      if (drugMentioned && result.structured) {
        enrichDrugRecord(drugMentioned, result.structured).catch(console.error);
      }
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
  const match = query.match(/\b([A-Z][a-z]+(?:umab|mab|inib|tide|stat|pril|sartan|olol)?)\b/);
  return match ? match[1] : null;
}

async function enrichDrugRecord(drugName, structured) {
  const update = { lastVerified: new Date() };

  if (structured.prescribingSteps?.length) update.prescribingSteps = structured.prescribingSteps;
  if (structured.specialtyPharmacies?.length) update.specialtyPharmacies = structured.specialtyPharmacies;
  if (structured.remsRequired !== undefined) update.hasREMS = structured.remsRequired;
  if (structured.remsDetails?.programName) update.remsProgram = structured.remsDetails;
  if (structured.requiredForms?.length) update.requiredForms = structured.requiredForms;

  const sources = structured.sources?.filter(Boolean) || [];

  await Drug.findOneAndUpdate(
    { brandName: { $regex: new RegExp(drugName, 'i') } },
    {
      $set: update,
      ...(sources.length ? { $addToSet: { dataSource: { $each: sources } } } : {})
    }
  );
}
