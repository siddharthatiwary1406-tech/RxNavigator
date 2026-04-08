const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const {
  listDrugs, createDrug, updateDrug, deleteDrug, webSeedDrug, getAnalytics,
  approveDrug, rejectDrug, getSearchLogs
} = require('../controllers/adminController');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/analytics', getAnalytics);
router.get('/search-logs', getSearchLogs);

// Seed must be before /:id to avoid param collision
router.post('/drugs/seed', webSeedDrug);

router.route('/drugs')
  .get(listDrugs)
  .post(createDrug);

// Approve/reject must be before /:id PUT to avoid collision
router.put('/drugs/:id/approve', approveDrug);
router.put('/drugs/:id/reject', rejectDrug);

router.route('/drugs/:id')
  .put(updateDrug)
  .delete(deleteDrug);

module.exports = router;
