const Drug = require('../../models/Drug');

async function getPaRequirements({ drug_name, payer_name }) {
  try {
    const regex = new RegExp(drug_name, 'i');
    const drug = await Drug.findOne({
      $or: [{ brandName: regex }, { genericName: regex }]
    });

    if (!drug) {
      return {
        found: false,
        message: `No PA data for "${drug_name}". Contact the payer directly or use their provider portal.`
      };
    }

    const pa = drug.paRequirements;
    if (!pa) {
      return { found: true, drugName: drug.brandName, paRequired: false, message: 'No PA requirements found in internal database.' };
    }

    let payerSpecific = null;
    if (payer_name && pa.payers) {
      const payerRegex = new RegExp(payer_name, 'i');
      payerSpecific = pa.payers.find(p => payerRegex.test(p.name));
    }

    return {
      found: true,
      drugName: drug.brandName,
      paRequired: true,
      generalRequirements: pa.general || [],
      payerSpecific: payerSpecific || null,
      allPayers: pa.payers || [],
      note: 'PA criteria change frequently. Verify current criteria with the payer before submission.',
      lastVerified: drug.lastVerified
    };
  } catch (err) {
    return { found: false, error: err.message };
  }
}

module.exports = { getPaRequirements };
