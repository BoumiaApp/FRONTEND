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
  enableUser: (id: number) => api.put(`/api/users/${id}/enable`),
  disableUser: (id: number) => api.put(`/api/users/${id}/disable`),
};

export const customerAPI = {
  // CRUD Operations
  getAllCustomers: () => api.get('/api/customers'),
  getCustomerById: (id: number) => api.get(`/api/customers/${id}`),
  createCustomer: (customerData: any) => api.post('/api/customers', customerData),
  updateCustomer: (id: number, customerData: any) => api.put(`/api/customers/${id}`, customerData),
  deleteCustomer: (id: number) => api.delete(`/api/customers/${id}`),
  
  // Search by Specific Fields
  getCustomerByCode: (code: string) => api.get(`/api/customers/code/${encodeURIComponent(code)}`),
  getCustomerByTaxNumber: (taxNumber: string) => api.get(`/api/customers/tax-number/${encodeURIComponent(taxNumber)}`),
  getCustomerByEmail: (email: string) => api.get(`/api/customers/email/${encodeURIComponent(email)}`),
  getCustomerByCity: (city: string) => api.get(`/api/customers/city/${encodeURIComponent(city)}`),
  getCustomerByPostalCode: (postalCode: string) => api.get(`/api/customers/postal-code/${encodeURIComponent(postalCode)}`),
  
  // Search Operations
  searchCustomersByName: (name: string) => api.get(`/api/customers/search/name?name=${encodeURIComponent(name)}`),
  searchCustomersGeneral: (searchTerm: string) => api.get(`/api/customers/search/general?searchTerm=${encodeURIComponent(searchTerm)}`),
  searchCustomersContact: (searchTerm: string) => api.get(`/api/customers/search/contact?searchTerm=${encodeURIComponent(searchTerm)}`),
  
  // Filter Operations
  getEnabledCustomers: () => api.get('/api/customers/enabled'),
  getDisabledCustomers: () => api.get('/api/customers/disabled'),
  getCustomersOnly: () => api.get('/api/customers/customers-only'),
  getSuppliersOnly: () => api.get('/api/customers/suppliers-only'),
  getTaxExemptCustomers: () => api.get('/api/customers/tax-exempt'),
  getCustomersByDueDatePeriod: (period: string) => api.get(`/api/customers/due-date-period/${encodeURIComponent(period)}`),
  getCustomersByCountrySubentity: (entity: string) => api.get(`/api/customers/country-subentity/${encodeURIComponent(entity)}`),
  getCustomersByCitySubdivision: (name: string) => api.get(`/api/customers/city-subdivision/${encodeURIComponent(name)}`),
  
  // Status Operations
  enableCustomer: (id: number) => api.patch(`/api/customers/${id}/enable`),
  disableCustomer: (id: number) => api.patch(`/api/customers/${id}/disable`),
};

export const productGroupAPI = {
  // CRUD Operations
  getAllProductGroups: () => api.get('/api/product-groups'),
  getProductGroupById: (id: number) => api.get(`/api/product-groups/${id}`),
  createProductGroup: (productGroupData: any) => api.post('/api/product-groups', productGroupData),
  updateProductGroup: (id: number, productGroupData: any) => api.put(`/api/product-groups/${id}`, productGroupData),
  deleteProductGroup: (id: number) => api.delete(`/api/product-groups/${id}`),
  
  // Search & Filter Operations
  getProductGroupByName: (name: string) => api.get(`/api/product-groups/name/${encodeURIComponent(name)}`),
  searchProductGroupsByName: (searchTerm: string) => api.get(`/api/product-groups/search/name?name=${encodeURIComponent(searchTerm)}`),
  getRootProductGroups: () => api.get('/api/product-groups/root'),
  getSubGroups: (parentGroupId: number) => api.get(`/api/product-groups/${parentGroupId}/sub-groups`),
  getProductGroupsByColor: (color: string) => api.get(`/api/product-groups/color/${encodeURIComponent(color)}`),
  getProductGroupsByRankRange: (minRank: number, maxRank: number) => api.get(`/api/product-groups/rank-range?minRank=${minRank}&maxRank=${maxRank}`),
  getProductGroupsOrderedByName: () => api.get('/api/product-groups/ordered/name'),
};

export const productAPI = {
  // CRUD Operations
  getAllProducts: () => api.get('/api/products'),
  getProductById: (id: number) => api.get(`/api/products/${id}`),
  createProduct: (productData: any) => api.post('/api/products', productData),
  updateProduct: (id: number, productData: any) => api.put(`/api/products/${id}`, productData),
  deleteProduct: (id: number) => api.delete(`/api/products/${id}`),
  
  // Search by Specific Fields
  getProductByCode: (code: string) => api.get(`/api/products/code/${encodeURIComponent(code)}`),
  getProductByPLU: (plu: string) => api.get(`/api/products/plu/${encodeURIComponent(plu)}`),
  getProductByName: (name: string) => api.get(`/api/products/name/${encodeURIComponent(name)}`),
  
  // Search Operations
  searchProductsGeneral: (searchTerm: string) => api.get(`/api/products/search/general?searchTerm=${encodeURIComponent(searchTerm)}`),
  
  // Filter Operations
  getProductsByGroup: (productGroupId: number) => api.get(`/api/products/group/${productGroupId}`),
  getProductsByMeasurementUnit: (unit: string) => api.get(`/api/products/measurement-unit/${encodeURIComponent(unit)}`),
  getProductsByPriceRange: (minPrice: number, maxPrice: number) => api.get(`/api/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`),
  getProductsByCostRange: (minCost: number, maxCost: number) => api.get(`/api/products/cost-range?minCost=${minCost}&maxCost=${maxCost}`),
  getEnabledProducts: () => api.get('/api/products/enabled'),
  getDisabledProducts: () => api.get('/api/products/disabled'),
  getServiceProducts: () => api.get('/api/products/services'),
  getNonServiceProducts: () => api.get('/api/products/non-services'),
  getPriceChangeAllowedProducts: () => api.get('/api/products/price-change-allowed'),
  getTaxInclusiveProducts: () => api.get('/api/products/tax-inclusive'),
  getDefaultQuantityProducts: () => api.get('/api/products/default-quantity'),
  getProductsByColor: (color: string) => api.get(`/api/products/color/${encodeURIComponent(color)}`),
  getProductsByAgeRestriction: (age: number) => api.get(`/api/products/age-restriction/${age}`),
  getProductsByRankRange: (minRank: number, maxRank: number) => api.get(`/api/products/rank-range?minRank=${minRank}&maxRank=${maxRank}`),
  
  // Sorting Operations
  getProductsOrderedByPrice: () => api.get('/api/products/ordered/price'),
  getProductsOrderedByRank: () => api.get('/api/products/ordered/rank'),
  getProductsOrderedByDateCreated: () => api.get('/api/products/ordered/date-created'),
  
  // Status Operations
  enableProduct: (id: number) => api.patch(`/api/products/${id}/enable`),
  disableProduct: (id: number) => api.patch(`/api/products/${id}/disable`),
};

export const publicAPI = {
  healthCheck: () => api.get('/api/public/health'),
};

export default api; 