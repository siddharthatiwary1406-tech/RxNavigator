const axios = require('axios');

const FDA_BASE = process.env.FDA_API_BASE || 'https://api.fda.gov';

async function getDrugLabel(drugName) {
  try {
    const res = await axios.get(`${FDA_BASE}/drug/label.json`, {
      params: { search: `openfda.brand_name:"${drugName}"`, limit: 1 },
      timeout: 8000
    });
    const result = res.data.results?.[0];
    if (!result) return null;
    return {
      brandName: result.openfda?.brand_name?.[0],
      genericName: result.openfda?.generic_name?.[0],
      manufacturer: result.openfda?.manufacturer_name?.[0],
      warnings: result.warnings?.[0]?.substring(0, 500),
      indicationsAndUsage: result.indications_and_usage?.[0]?.substring(0, 500),
      source: `${FDA_BASE}/drug/label.json`
    };
  } catch {
    return null;
  }
}

async function checkRemsStatus(drugName) {
  try {
    const res = await axios.get(`${FDA_BASE}/drug/enforcement.json`, {
      params: { search: `product_description:"${drugName}"`, limit: 1 },
      timeout: 8000
    });
    return { found: (res.data.results?.length || 0) > 0 };
  } catch {
    return { found: false };
  }
}

module.exports = { getDrugLabel, checkRemsStatus };
