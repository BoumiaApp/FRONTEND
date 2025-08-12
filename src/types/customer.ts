export interface Customer {
  id: number;
  code: string;
  name: string;
  taxNumber?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  countrySubentity?: string;
  citySubdivision?: string;
  isEnabled: boolean;
  isTaxExempt: boolean;
  isSupplier: boolean;
  dueDatePeriod?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerRequest {
  code?: string; // Made optional - will auto-generate if not provided
  name: string;
  taxNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  countrySubentity?: string;
  citySubdivision?: string;
  isEnabled: boolean;
  isTaxExempt: boolean;
  isSupplier: boolean;
  dueDatePeriod?: number;
}

export interface UpdateCustomerRequest {
  code?: string;
  name?: string;
  taxNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  countrySubentity?: string;
  citySubdivision?: string;
  isEnabled?: boolean;
  isTaxExempt?: boolean;
  isSupplier?: boolean;
  dueDatePeriod?: number;
}

export interface CustomerSearchParams {
  name?: string;
  searchTerm?: string;
  period?: string;
  entity?: string;
  subdivision?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string>;
}

export const CUSTOMER_TYPES = {
  CUSTOMER: 'customer',
  SUPPLIER: 'supplier',
} as const;

export const CUSTOMER_TYPE_LABELS = {
  customer: 'Customer',
  supplier: 'Supplier',
} as const; 