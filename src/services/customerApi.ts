import api from "./api";

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