import api from "./api";


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
  getProductByBarcode: (barcode: string) => api.get(`/api/barcode/by-barcode/${encodeURIComponent(barcode)}`),
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
