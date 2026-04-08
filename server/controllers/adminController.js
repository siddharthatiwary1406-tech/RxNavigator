const Anthropic = require('@anthropic-ai/sdk');
const Drug = require('../models/Drug');
const Query = require('../models/Query');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { search: tavilySearch } = require('../services/tavilyService');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Drug CRUD ────────────────────────────────────────────────────────────────

exports.listDrugs = async (req, res, next) => {
  try {
    const { q, area, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (area) filter.therapeuticArea = { $regex: area, $options: 'i' };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [drugs, total] = await Promise.all([
      Drug.find(filter).sort({ brandName: 1 }).skip(skip).limit(Number(limit)),
      Drug.countDocuments(filter)
    ]);

    res.json({ success: true, data: drugs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.createDrug = async (req, res, next) => {
  try {
    const drug = await Drug.create({ ...req.body, addedVia: req.body.addedVia || 'manual', lastVerified: new Date() });
    res.status(201).json({ success: true, data: drug });
  } catch (err) {
    next(err);
  }
};

exports.updateDrug = async (req, res, next) => {
  try {
    const drug = await Drug.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastVerified: new Date() },
      { new: true, runValidators: true }
    );
    if (!drug) return res.status(404).json({ success: false, error: 'Drug not found' });
    res.json({ success: true, data: drug });
  } catch (err) {
    next(err);
  }
};

exports.deleteDrug = async (req, res, next) => {
  try {
    const drug = await Drug.findByIdAndDelete(req.params.id);
    if (!drug) return res.status(404).json({ success: false, error: 'Drug not found' });
    res.json({ success: true, message: 'Drug deleted' });
  } catch (err) {
    next(err);
  }
};

// ─── Web Seed ─────────────────────────────────────────────────────────────────

exports.webSeedDrug = async (req, res, next) => {
  try {
    const { drugName } = req.body;
    if (!drugName) return res.status(400).json({ success: false, error: 'drugName is required' });

    // Search web for drug info
    const searchResult = await tavilySearch(
      `${drugName} prescribing steps REMS specialty pharmacy prior authorization FDA site:fda.gov OR site:drugs.com OR site:rxlist.com`
    );

    if (!searchResult.success || searchResult.results.length === 0) {
      return res.status(422).json({ success: false, error: 'No web results found for this drug. Try a different name.' });
    }

    const webContext = searchResult.results
      .map(r => `Source: ${r.url}\n${r.content}`)
      .join('\n\n');

    // Use Claude to structure web content into Drug schema
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: `You are a pharmaceutical data extractor. Extract drug information from web content and return ONLY a valid JSON object matching this exact schema. No prose, no markdown, no code fences — just the raw JSON object starting with {.

Schema:
{
  "brandName": "string (required)",
  "genericName": "string (required)",
  "manufacturer": "string",
  "therapeuticArea": "string",
  "indication": ["string"],
  "hasREMS": boolean,
  "remsProgram": {
    "name": "string or null",
    "requirements": ["string"],
    "enrollmentUrl": "string or null",
    "certificationRequired": boolean
  },
  "specialtyPharmacies": [{"name":"string","phone":"string","website":"string","states":["string"]}],
  "prescribingSteps": ["string"],
  "requiredForms": [{"name":"string","url":"string"}],
  "paRequirements": {
    "general": ["string"],
    "payers": [{"name":"string","steps":["string"],"criteria":["string"],"phone":"string","portalUrl":"string"}]
  },
  "dataSource": ["string"]
}

If a field has no data, use null for strings, false for booleans, and [] for arrays.`,
      messages: [{
        role: 'user',
        content: `Extract information for the drug "${drugName}" from this web content:\n\n${webContext}`
      }]
    });

    const text = response.content.find(b => b.type === 'text')?.text || '';
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) {
      return res.status(422).json({ success: false, error: 'Could not parse drug data from web content' });
    }

    const drugData = JSON.parse(text.slice(start, end + 1));
    drugData.lastVerified = new Date();
    drugData.addedVia = 'seed';
    drugData.dataSource = [
      ...(drugData.dataSource || []),
      ...searchResult.results.map(r => r.url)
    ].filter(Boolean);

    // Upsert — update if exists, create if not
    const drug = await Drug.findOneAndUpdate(
      { brandName: { $regex: new RegExp(drugData.brandName, 'i') } },
      { $set: drugData },
      { new: true, upsert: true, runValidators: false }
    );

    res.status(201).json({ success: true, data: drug });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(422).json({ success: false, error: 'Failed to parse drug data from AI response' });
    }
    next(err);
  }
};

// ─── Analytics ────────────────────────────────────────────────────────────────

exports.getAnalytics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [queriesPerDay, topDrugs, toolUsage, aggregates, totalUsers, totalDrugs, adminCount] =
      await Promise.all([
        // Queries per day — last 30 days
        Query.aggregate([
          { $match: { createdAt: { $gte: thirtyDaysAgo } } },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]),

        // Top 10 most searched drugs
        Query.aggregate([
          { $match: { drugMentioned: { $ne: null } } },
          { $group: { _id: '$drugMentioned', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),

        // Tool usage counts
        Query.aggregate([
          { $unwind: '$toolsUsed' },
          { $group: { _id: '$toolsUsed', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),

        // Avg confidence + avg response time
        Query.aggregate([
          {
            $group: {
              _id: null,
              avgConfidence: { $avg: '$agentResponse.confidenceScore' },
              avgResponseTime: { $avg: '$responseTimeMs' },
              totalQueries: { $sum: 1 }
            }
          }
        ]),

        User.countDocuments(),
        Drug.countDocuments(),
        User.countDocuments({ role: 'admin' })
      ]);

    const agg = aggregates[0] || { avgConfidence: 0, avgResponseTime: 0, totalQueries: 0 };

    res.json({
      success: true,
      data: {
        summary: {
          totalQueries: agg.totalQueries,
          totalUsers,
          totalDrugs,
          adminCount,
          avgConfidence: Math.round((agg.avgConfidence || 0) * 100) / 100,
          avgResponseTimeMs: Math.round(agg.avgResponseTime || 0)
        },
        queriesPerDay,
        topDrugs,
        toolUsage
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Search Logs ─────────────────────────────────────────────────────────────

exports.getSearchLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, source } = req.query;
    const filter = {};
    if (source) filter.resultSource = source;

    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
      Query.find(filter)
        .populate('userId', 'firstName lastName email specialty')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('userId drugMentioned resultSource agentResponse.confidenceScore toolsUsed createdAt'),
      Query.countDocuments(filter)
    ]);

    res.json({ success: true, data: logs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

// ─── Approve / Reject ─────────────────────────────────────────────────────────

exports.approveDrug = async (req, res, next) => {
  try {
    const drug = await Drug.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!drug) return res.status(404).json({ success: false, error: 'Drug not found' });

    // Notify doctors who previously searched for this drug and got not_found
    const drugRegex = new RegExp(drug.brandName, 'i');
    const notFoundUserIds = await Query.find({
      drugMentioned: drugRegex,
      resultSource: 'not_found'
    }).distinct('userId');

    if (notFoundUserIds.length > 0) {
      const notifications = notFoundUserIds.map(userId => ({
        userId,
        drugName: drug.brandName,
        message: `${drug.brandName} (${drug.genericName}) is now available in the SpecialtyRx database with full prescribing information.`
      }));
      await Notification.insertMany(notifications);
    }

    res.json({ success: true, data: drug });
  } catch (err) {
    next(err);
  }
};

exports.rejectDrug = async (req, res, next) => {
  try {
    const drug = await Drug.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!drug) return res.status(404).json({ success: false, error: 'Drug not found' });
    res.json({ success: true, data: drug });
  } catch (err) {
    next(err);
  }
};
