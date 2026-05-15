import api from '../lib/api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, confirmPassword) => 
    api.post('/auth/register', { name, email, password, confirmPassword }),
  googleLogin: (accessToken) => api.post('/auth/google', { accessToken }),
  getMe: () => api.get('/auth/me'),
};
