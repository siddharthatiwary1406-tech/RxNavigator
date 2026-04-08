import api from './api';

export const adminDrugsApi = {
  list: (params) => api.get('/admin/drugs', { params }),
  create: (data) => api.post('/admin/drugs', data),
  update: (id, data) => api.put(`/admin/drugs/${id}`, data),
  remove: (id) => api.delete(`/admin/drugs/${id}`),
  seed: (drugName) => api.post('/admin/drugs/seed', { drugName }),
  approve: (id) => api.put(`/admin/drugs/${id}/approve`),
  reject: (id) => api.put(`/admin/drugs/${id}/reject`)
};

export const adminAnalyticsApi = {
  get: () => api.get('/admin/analytics')
};

export const adminSearchLogsApi = {
  get: (params) => api.get('/admin/search-logs', { params })
};
