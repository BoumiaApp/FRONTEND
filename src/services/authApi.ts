import api from "./api";


export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/api/auth/login', { username, password }),
  getCurrentUser: () => api.get('/api/auth/me'),
  validateToken: () => api.post('/api/auth/validate'),
  register: (userData: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
  }) => api.post('/api/public/register', userData),
};