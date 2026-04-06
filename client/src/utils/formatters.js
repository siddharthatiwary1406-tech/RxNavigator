export const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatConfidence = (score) => {
  if (score === null || score === undefined) return { label: 'Unknown', color: 'gray' };
  if (score >= 0.8) return { label: 'High', color: 'green' };
  if (score >= 0.6) return { label: 'Moderate', color: 'yellow' };
  if (score >= 0.4) return { label: 'Low', color: 'orange' };
  return { label: 'Very Low', color: 'red' };
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

export const getToolLabel = (toolName) => {
  const labels = {
    search_drug_database: 'Searching drug database',
    get_rems_requirements: 'Checking REMS requirements',
    find_specialty_pharmacies: 'Finding specialty pharmacies',
    get_pa_requirements: 'Checking prior authorization',
    web_search: 'Searching the web'
  };
  return labels[toolName] || toolName;
};
