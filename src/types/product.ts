export interface Product {
  id: number;
  code: string;
  plu?: string;
  name: string;
  description?: string;
  productGroupId?: number;
  productGroupName?: string;
  measurementUnit?: string;
  price: number;
  cost?: number;
  isEnabled: boolean;
  isService: boolean;
  isPriceChangeAllowed: boolean;
  isTaxInclusive: boolean;
  usesDefaultQuantity: boolean;
  color?: string;
  ageRestriction?: number;
  rank?: number;
  createdAt?: string;
  updatedAt?: string;
  quantity?: number; // Optional for stock management
}

export interface CreateProductRequest {
  code: string;
  plu?: string;
  name: string;
  description?: string;
  productGroupId?: number;
  measurementUnit?: string;
  price: number;
  cost?: number;
  isEnabled: boolean;
  isService: boolean;
  isPriceChangeAllowed: boolean;
  isTaxInclusive: boolean;
  usesDefaultQuantity: boolean;
  color?: string;
  ageRestriction?: number;
  rank?: number;
  quantity?: number; // Optional for stock management
  barcode?: string; // Optional for barcode scanning
}

export interface UpdateProductRequest {
  code?: string;
  plu?: string;
  name?: string;
  description?: string;
  productGroupId?: number;
  measurementUnit?: string;
  price?: number;
  cost?: number;
  isEnabled?: boolean;
  isService?: boolean;
  isPriceChangeAllowed?: boolean;
  isTaxInclusive?: boolean;
  usesDefaultQuantity?: boolean;
  color?: string;
  ageRestriction?: number;
  rank?: number;
  quantity?: number; // Optional for stock management
  barcode?: string; // Optional for barcode scanning
}

export interface ProductSearchParams {
  searchTerm?: string;
  code?: string;
  plu?: string;
  name?: string;
  productGroupId?: number;
  measurementUnit?: string;
  minPrice?: number;
  maxPrice?: number;
  minCost?: number;
  maxCost?: number;
  color?: string;
  ageRestriction?: number;
  minRank?: number;
  maxRank?: number;
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

export const MEASUREMENT_UNITS = {
  PIECE: 'piece',
  KILOGRAM: 'kg',
  GRAM: 'g',
  LITER: 'l',
  MILLILITER: 'ml',
  METER: 'm',
  CENTIMETER: 'cm',
  HOUR: 'hour',
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export const MEASUREMENT_UNIT_LABELS = {
  piece: 'Piece',
  kg: 'Kilogram',
  g: 'Gram',
  l: 'Liter',
  ml: 'Milliliter',
  m: 'Meter',
  cm: 'Centimeter',
  hour: 'Hour',
  day: 'Day',
  month: 'Month',
  year: 'Year',
} as const;

export const PRODUCT_COLORS = {
  RED: '#ef4444',
  BLUE: '#3b82f6',
  GREEN: '#10b981',
  YELLOW: '#f59e0b',
  PURPLE: '#8b5cf6',
  PINK: '#ec4899',
  GRAY: '#6b7280',
  BLACK: '#000000',
  WHITE: '#ffffff',
} as const;

export const PRODUCT_COLOR_LABELS = {
  '#ef4444': 'Red',
  '#3b82f6': 'Blue',
  '#10b981': 'Green',
  '#f59e0b': 'Yellow',
  '#8b5cf6': 'Purple',
  '#ec4899': 'Pink',
  '#6b7280': 'Gray',
  '#000000': 'Black',
  '#ffffff': 'White',
} as const; 