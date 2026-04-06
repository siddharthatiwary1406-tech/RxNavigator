const Drug = require('../../models/Drug');

async function getRemsRequirements({ drug_name }) {
  try {
    const regex = new RegExp(drug_name, 'i');
    const drug = await Drug.findOne({
      $or: [{ brandName: regex }, { genericName: regex }]
    });

    if (!drug) {
      return {
        found: false,
        message: `No REMS data found for "${drug_name}" in internal database. Search FDA REMS database at https://www.accessdata.fda.gov/scripts/cder/rems/`
      };
    }

    if (!drug.hasREMS) {
      return {
        found: true,
        hasREMS: false,
        drugName: drug.brandName,
        message: `${drug.brandName} (${drug.genericName}) does NOT have an active REMS program as of last verification.`,
        lastVerified: drug.lastVerified
      };
    }

    return {
      found: true,
      hasREMS: true,
      drugName: drug.brandName,
      genericName: drug.genericName,
      remsProgram: drug.remsProgram,
      lastVerified: drug.lastVerified,
      fdaRemsUrl: 'https://www.accessdata.fda.gov/scripts/cder/rems/',
      warning: 'REMS requirements may change. Always verify with the manufacturer before prescribing.'
    };
  } catch (err) {
    return { found: false, error: err.message };
  }
}

module.exports = { getRemsRequirements };
