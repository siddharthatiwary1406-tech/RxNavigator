const express = require('express');
const router = express.Router();
const { searchDrugs, getDrug, getCategories } = require('../controllers/drugController');

router.get('/search', searchDrugs);
router.get('/categories', getCategories);
router.get('/:id', getDrug);

module.exports = router;
