export interface ProductGroup {
  id: number;
  name: string;
  description?: string;
  color?: string;
  rank?: number;
  parentGroupId?: number;
  parentGroup?: ProductGroup;
  subGroups?: ProductGroup[];
  productCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductGroupRequest {
  name: string;
  description?: string;
  color?: string;
  rank?: number;
  parentGroupId?: number;
}

export interface UpdateProductGroupRequest {
  name?: string;
  description?: string;
  color?: string;
  rank?: number;
  parentGroupId?: number;
}

export interface ProductGroupSearchParams {
  name?: string;
  searchTerm?: string;
  color?: string;
  minRank?: number;
  maxRank?: number;
  parentGroupId?: number;
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

export const PRODUCT_GROUP_COLORS = {
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

export const PRODUCT_GROUP_COLOR_LABELS = {
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