const Drug = require('../../models/Drug');

async function searchDrugDatabase({ drug_name }) {
  try {
    const regex = new RegExp(drug_name, 'i');
    const drug = await Drug.findOne({
      $or: [{ brandName: regex }, { genericName: regex }]
    });

    if (!drug) {
      return {
        found: false,
        message: `No internal data found for "${drug_name}". Please use web_search for current information.`
      };
    }

    return {
      found: true,
      brandName: drug.brandName,
      genericName: drug.genericName,
      manufacturer: drug.manufacturer,
      therapeuticArea: drug.therapeuticArea,
      indication: drug.indication,
      hasREMS: drug.hasREMS,
      remsProgram: drug.hasREMS ? drug.remsProgram : null,
      prescribingSteps: drug.prescribingSteps,
      requiredForms: drug.requiredForms,
      paRequirements: drug.paRequirements,
      lastVerified: drug.lastVerified,
      dataSource: drug.dataSource
    };
  } catch (err) {
    return { found: false, error: err.message };
  }
}

module.exports = { searchDrugDatabase };
