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
        shouldWebSearch: true,
        message: `No internal data found for "${drug_name}". Please use web_search for current information.`
      };
    }

    if (drug.status !== 'approved') {
      return {
        found: true,
        shouldWebSearch: true,
        status: drug.status,
        message: `"${drug_name}" is in the database but not yet approved (status: ${drug.status}). Please use web_search to get current information.`
      };
    }

    return {
      found: true,
      shouldWebSearch: false,
      status: 'approved',
      brandName: drug.brandName,
      genericName: drug.genericName,
      manufacturer: drug.manufacturer,
      therapeuticArea: drug.therapeuticArea,
      indication: drug.indication,
      hasREMS: drug.hasREMS,
      remsProgram: drug.hasREMS ? drug.remsProgram : null,
      specialtyPharmacies: drug.specialtyPharmacies,
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
