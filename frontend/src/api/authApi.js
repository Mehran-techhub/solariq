import api from './client';

export const authApi = {
  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user;
      if (token) {
        localStorage.setItem('solariq_token', token);
        localStorage.setItem('solariq_user', JSON.stringify(user));
      }
      return { success: data.success, token, user, message: data.message };
    } catch (e) {
      const msg = e.response?.data?.message || 'Incorrect email or password. Please try again.';
      return { success: false, message: msg };
    }
  },
  register: async (payload) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user;
      if (token) {
        localStorage.setItem('solariq_token', token);
        localStorage.setItem('solariq_user', JSON.stringify(user));
      }
      return { success: data.success, token, user, message: data.message };
    } catch (e) {
      const msg = e.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: msg };
    }
  },
  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return { success: data.success, message: data.message };
  },
  googleLogin: async (payload) => {
    const { data } = await api.post('/auth/google', payload);
    const token = data.token || data.data?.token;
    const user = data.user || data.data?.user;
    if (token) {
      localStorage.setItem('solariq_token', token);
      localStorage.setItem('solariq_user', JSON.stringify(user));
    }
    return { success: data.success, token, user, message: data.message };
  },
  logout: () => {
    localStorage.removeItem('solariq_token');
    localStorage.removeItem('solariq_user');
  },
  getStoredUser: () => {
    try {
      return JSON.parse(localStorage.getItem('solariq_user') || 'null');
    } catch {
      return null;
    }
  },
};
