const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  queryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Query', required: true },
  rating: { type: String, enum: ['up', 'down'], required: true },
  comment: String,
  flaggedOutdated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
