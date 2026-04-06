const axios = require('axios');

async function search(query) {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey || apiKey === 'your_tavily_api_key_here') {
    return {
      success: false,
      message: 'Tavily API key not configured. Web search unavailable.',
      results: []
    };
  }

  try {
    const response = await axios.post(
      'https://api.tavily.com/search',
      {
        api_key: apiKey,
        query,
        search_depth: 'basic',
        include_answer: true,
        include_domains: [
          'fda.gov', 'accessdata.fda.gov', 'drugs.com', 'rxlist.com',
          'specialtypharmacy.com', 'ncbi.nlm.nih.gov', 'ashp.org'
        ],
        max_results: 5
      },
      { timeout: 10000 }
    );

    return {
      success: true,
      answer: response.data.answer || null,
      results: (response.data.results || []).map(r => ({
        title: r.title,
        url: r.url,
        content: r.content?.substring(0, 500),
        score: r.score
      }))
    };
  } catch (err) {
    return {
      success: false,
      message: `Web search failed: ${err.message}`,
      results: []
    };
  }
}

module.exports = { search };
