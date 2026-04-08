import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Auto-attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const drugsApi = {
  search: (q) => api.get(`/drugs/search?q=${encodeURIComponent(q)}`),
  getById: (id) => api.get(`/drugs/${id}`),
  getCategories: () => api.get('/drugs/categories')
};

export const pharmaciesApi = {
  get: (drug, state) => api.get(`/pharmacies?drug=${encodeURIComponent(drug)}${state ? `&state=${state}` : ''}`)
};

export const historyApi = {
  getAll: () => api.get('/agent/history'),
  getById: (id) => api.get(`/history/${id}`)
};

export const feedbackApi = {
  submit: (data) => api.post('/agent/feedback', data)
};

export const pharmaApi = {
  submit: (data) => api.post('/pharma/drugs', data),
  getSubmissions: () => api.get('/pharma/drugs'),
  update: (id, data) => api.put(`/pharma/drugs/${id}`, data),
};

export default api;
