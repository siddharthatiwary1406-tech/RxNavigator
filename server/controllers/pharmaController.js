const Drug = require('../models/Drug');

exports.submitDrug = async (req, res, next) => {
  try {
    const drug = await Drug.create({
      ...req.body,
      status: 'pending',
      addedVia: 'pharma',
      submittedBy: req.user._id,
      lastVerified: new Date()
    });
    res.status(201).json({ success: true, data: drug });
  } catch (err) {
    next(err);
  }
};

exports.getMySubmissions = async (req, res, next) => {
  try {
    const drugs = await Drug.find({ submittedBy: req.user._id }).sort({ lastVerified: -1 });
    res.json({ success: true, data: drugs });
  } catch (err) {
    next(err);
  }
};

exports.respondToReview = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, error: 'Message is required' });

    const drug = await Drug.findOne({ _id: req.params.id, submittedBy: req.user._id });
    if (!drug) return res.status(404).json({ success: false, error: 'Submission not found' });
    if (drug.status !== 'info_requested') {
      return res.status(400).json({ success: false, error: 'No info request is pending for this submission' });
    }

    drug.reviewMessages.push({ from: 'pharma', message: message.trim(), createdAt: new Date() });
    drug.status = 'pending'; // back to pending for admin re-review
    await drug.save();

    res.json({ success: true, data: drug });
  } catch (err) {
    next(err);
  }
};

exports.updateSubmission = async (req, res, next) => {
  try {
    const drug = await Drug.findOne({ _id: req.params.id, submittedBy: req.user._id });
    if (!drug) return res.status(404).json({ success: false, error: 'Submission not found' });
    if (drug.status === 'approved') {
      return res.status(400).json({ success: false, error: 'Cannot edit an approved drug. Contact admin.' });
    }
    const updated = await Drug.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: 'pending', lastVerified: new Date() },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
