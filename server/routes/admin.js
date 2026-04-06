const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const {
  listDrugs, createDrug, updateDrug, deleteDrug, webSeedDrug, getAnalytics
} = require('../controllers/adminController');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/analytics', getAnalytics);

// Seed must be before /:id to avoid param collision
router.post('/drugs/seed', webSeedDrug);

router.route('/drugs')
  .get(listDrugs)
  .post(createDrug);

router.route('/drugs/:id')
  .put(updateDrug)
  .delete(deleteDrug);

module.exports = router;
