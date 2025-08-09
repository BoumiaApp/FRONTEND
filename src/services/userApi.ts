import api from "./api";

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
  enableUser: (id: number) => api.put(`/api/users/${id}/enable`),
  disableUser: (id: number) => api.put(`/api/users/${id}/disable`),
};