const Drug = require('../models/Drug');

exports.getPharmacies = async (req, res, next) => {
  try {
    const { drug, state } = req.query;
    if (!drug) return res.status(400).json({ success: false, error: 'drug parameter required' });

    const regex = new RegExp(drug, 'i');
    const drugDoc = await Drug.findOne({
      $or: [{ brandName: regex }, { genericName: regex }]
    }).select('brandName specialtyPharmacies');

    if (!drugDoc) return res.json({ success: true, data: [] });

    let pharmacies = drugDoc.specialtyPharmacies || [];
    if (state) {
      const filtered = pharmacies.filter(
        p => !p.states || p.states.length === 0 || p.states.includes(state.toUpperCase())
      );
      if (filtered.length > 0) pharmacies = filtered;
    }

    res.json({ success: true, data: pharmacies, drugName: drugDoc.brandName });
  } catch (err) {
    next(err);
  }
};
