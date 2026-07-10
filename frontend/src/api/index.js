import api from './client';

export const dashboardApi = {
  getOverview: async () => (await api.get('/dashboard/overview')).data,
  getStats: async () => (await api.get('/dashboard/stats')).data,
};

export const analyticsApi = {
  daily: async () => (await api.get('/analytics/daily')).data,
  weekly: async () => (await api.get('/analytics/weekly')).data,
  monthly: async () => (await api.get('/analytics/monthly')).data,
};

export const predictionApi = {
  create: async (payload) => (await api.post('/predictions', payload)).data,
  list: async () => (await api.get('/predictions')).data,
  getById: async (id) => (await api.get(`/predictions/${id}`)).data,
  delete: async (id) => (await api.delete(`/predictions/${id}`)).data,
  report: async (id) => (await api.get(`/predictions/report/${id}`)).data,
  status: async () => (await api.get('/predictions/model/status')).data,
  metrics: async () => (await api.get('/predictions/model/metrics')).data,
};

export const simulationApi = {
  list: async () => (await api.get('/simulation')).data,
  run: async (appliances) => (await api.post('/simulation/run', { appliances })).data,
};

export const reportsApi = {
  list: async () => (await api.get('/reports')).data,
  generate: async (payload) => (await api.post('/reports/generate', payload)).data,
  download: async (id) => {
    const token = localStorage.getItem('solariq_token');
    const base = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : '/api');
    const res = await fetch(`${base}/reports/download/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Download failed');
    return res.blob();
  },
};

export const settingsApi = {
  get: async () => (await api.get('/settings')).data,
  update: async (payload) => (await api.put('/settings', payload)).data,
};

export const weatherApi = {
  latest: async () => (await api.get('/weather')).data,
  fetch: async (lat, lon) => (await api.post('/weather/fetch', { lat, lon })).data,
  geocode: async (city) => (await api.get('/weather/geocode', { params: { city } })).data,
  syncStatus: async () => (await api.get('/weather/sync-status')).data,
};

export const efficiencyApi = {
  list: async () => (await api.get('/efficiency')).data,
};

export const recommendationsApi = {
  list: async () => (await api.get('/recommendations')).data,
};

export const maintenanceApi = {
  list: async () => (await api.get('/maintenance')).data,
  update: async (id, status) => (await api.put(`/maintenance/${id}`, { status })).data,
};

export const solarApi = {
  list: async () => (await api.get('/solar')).data,
  create: async (payload) => (await api.post('/solar', payload)).data,
  update: async (id, payload) => (await api.put(`/solar/${id}`, payload)).data,
  delete: async (id) => (await api.delete(`/solar/${id}`)).data,
};

export const activityApi = {
  list: async () => (await api.get('/activity')).data,
};

export const profileApi = {
  update: async (payload) => (await api.put('/users/profile', payload)).data,

  uploadPhoto: async (file) => {
    const form = new FormData();
    form.append('photo', file);
    const token = localStorage.getItem('solariq_token');
    const base = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : '');
    const res = await fetch(`${base}/api/users/profile/photo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    return res.json();
  },
  removePhoto: async () => (await api.delete('/users/profile/photo')).data,
};

export const healthApi = {
  check: async () => (await api.get('/health')).data,
};

export const notificationApi = {
  list: async () => (await api.get('/notifications')).data,
  markRead: async (id) => (await api.put(`/notifications/${id}/read`)).data,
  markAllRead: async () => (await api.put('/notifications/read-all')).data,
};

export const adminApi = {
  getStats: async () => (await api.get('/admin/stats')).data,
  getActivity: async () => (await api.get('/admin/activity')).data,
  getUsers: async () => (await api.get('/admin/users')).data,
  getHealth: async () => (await api.get('/admin/health')).data,
  getSettings: async () => (await api.get('/admin/settings')).data,
  updateSetting: async (key, value) => (await api.put('/admin/settings', { key, value })).data,
  getSolarRecords: async () => (await api.get('/admin/solar-records')).data,
  getPredictions: async () => (await api.get('/admin/predictions')).data,
  getReports: async () => (await api.get('/admin/reports')).data,
  getWeather: async () => (await api.get('/admin/weather')).data,
};