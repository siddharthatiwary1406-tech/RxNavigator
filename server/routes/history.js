const express = require('express');
const router = express.Router();
const Query = require('../models/Query');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res, next) => {
  try {
    const queries = await Query.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: queries });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const query = await Query.findOne({ _id: req.params.id, userId: req.user._id });
    if (!query) return res.status(404).json({ success: false, error: 'Query not found' });
    res.json({ success: true, data: query });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
