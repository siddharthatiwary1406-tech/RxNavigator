const express = require('express');
const router = express.Router();
const { queryAgent, getHistory, submitFeedback } = require('../controllers/agentController');
const { protect } = require('../middleware/auth');
const { agentLimiter } = require('../middleware/rateLimit');

router.post('/query', protect, agentLimiter, queryAgent);
router.get('/history', protect, getHistory);
router.post('/feedback', protect, submitFeedback);

module.exports = router;
