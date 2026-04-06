const Drug = require('../models/Drug');

exports.searchDrugs = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const regex = new RegExp(q, 'i');
    const drugs = await Drug.find({
      $or: [{ brandName: regex }, { genericName: regex }, { therapeuticArea: regex }]
    })
      .limit(10)
      .select('brandName genericName therapeuticArea manufacturer hasREMS');

    res.json({ success: true, data: drugs });
  } catch (err) {
    next(err);
  }
};

exports.getDrug = async (req, res, next) => {
  try {
    const drug = await Drug.findById(req.params.id);
    if (!drug) return res.status(404).json({ success: false, error: 'Drug not found' });
    res.json({ success: true, data: drug });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Drug.distinct('therapeuticArea');
    res.json({ success: true, data: categories.filter(Boolean) });
  } catch (err) {
    next(err);
  }
};
