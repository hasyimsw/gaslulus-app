import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  try {
    let storage = localStorage.getItem('gaslulus_storage');
    if (!storage) {
      storage = sessionStorage.getItem('gaslulus_storage');
    }
    if (storage) {
      const { state } = JSON.parse(storage);
      if (state && state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
  } catch (err) {
    console.error('Error reading auth token from storage', err);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('gaslulus_storage');
      sessionStorage.removeItem('gaslulus_storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
