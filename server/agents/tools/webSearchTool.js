const tavilyService = require('../../services/tavilyService');

async function webSearch({ query }) {
  return await tavilyService.search(query);
}

module.exports = { webSearch };
