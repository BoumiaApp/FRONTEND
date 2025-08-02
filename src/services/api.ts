import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

// Auth API
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

// User Management API
export const userAPI = {
  getAllUsers: () => api.get('/api/users'),
  getUserById: (id: number) => api.get(`/api/users/${id}`),
  getUserByUsername: (username: string) => api.get(`/api/users/username/${username}`),
  createUser: (userData: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    accessLevel: number;
    isEnabled: boolean;
    email: string;
  }) => api.post('/api/users', userData),
  updateUser: (id: number, userData: {
    firstName?: string;
    lastName?: string;
    username?: string;
    accessLevel?: number;
    isEnabled?: boolean;
    email?: string;
  }) => api.put(`/api/users/${id}`, userData),
  deleteUser: (id: number) => api.delete(`/api/users/${id}`),
  searchUsers: (searchTerm: string) => api.get(`/api/users/search?searchTerm=${encodeURIComponent(searchTerm)}`),
  getUsersByAccessLevel: (accessLevel: number) => api.get(`/api/users/access-level/${accessLevel}`),
  getEnabledUsers: () => api.get('/api/users/enabled'),
  getDisabledUsers: () => api.get('/api/users/disabled'),
  searchUsersByFirstName: (firstName: string) => api.get(`/api/users/search/firstname?firstName=${encodeURIComponent(firstName)}`),
  searchUsersByLastName: (lastName: string) => api.get(`/api/users/search/lastname?lastName=${encodeURIComponent(lastName)}`),
  enableUser: (id: number) => api.patch(`/api/users/${id}/enable`),
  disableUser: (id: number) => api.patch(`/api/users/${id}/disable`),
};

// Public API
export const publicAPI = {
  healthCheck: () => api.get('/api/public/health'),
};

export default api; 