const Drug = require('../../models/Drug');

async function findSpecialtyPharmacies({ drug_name, state }) {
  try {
    const regex = new RegExp(drug_name, 'i');
    const drug = await Drug.findOne({
      $or: [{ brandName: regex }, { genericName: regex }]
    });

    if (!drug || !drug.specialtyPharmacies || drug.specialtyPharmacies.length === 0) {
      return {
        found: false,
        message: `No pharmacy data found for "${drug_name}". Contact the manufacturer directly or check the drug's official website.`
      };
    }

    let pharmacies = drug.specialtyPharmacies;

    if (state) {
      const filtered = pharmacies.filter(
        p => !p.states || p.states.length === 0 || p.states.includes(state.toUpperCase())
      );
      if (filtered.length > 0) pharmacies = filtered;
    }

    return {
      found: true,
      drugName: drug.brandName,
      state: state || 'All states',
      pharmacies,
      note: 'Always confirm pharmacy participation and drug availability before writing the prescription.'
    };
  } catch (err) {
    return { found: false, error: err.message };
  }
}

module.exports = { findSpecialtyPharmacies };
