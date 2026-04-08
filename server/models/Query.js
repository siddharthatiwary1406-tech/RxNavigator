const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  queryText: { type: String, required: true },
  drugMentioned: String,
  payerMentioned: String,
  agentResponse: {
    prescribingSteps: [String],
    pharmacies: [mongoose.Schema.Types.Mixed],
    remsInfo: mongoose.Schema.Types.Mixed,
    paRequirements: mongoose.Schema.Types.Mixed,
    forms: [mongoose.Schema.Types.Mixed],
    confidenceScore: { type: Number, min: 0, max: 1 },
    sources: [String],
    lastVerifiedDate: Date,
    importantWarnings: [String]
  },
  toolsUsed: [String],
  resultSource: { type: String, enum: ['database', 'web', 'not_found'], default: 'web' },
  responseTimeMs: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Query', QuerySchema);
