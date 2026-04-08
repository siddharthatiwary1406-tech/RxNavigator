const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const pharmaOnly = require('../middleware/pharmaOnly');
const { submitDrug, getMySubmissions, updateSubmission, respondToReview } = require('../controllers/pharmaController');

router.use(protect, pharmaOnly);
router.post('/drugs', submitDrug);
router.get('/drugs', getMySubmissions);
router.put('/drugs/:id', updateSubmission);
router.post('/drugs/:id/respond', respondToReview);

module.exports = router;
