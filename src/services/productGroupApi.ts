import api from "./api";


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