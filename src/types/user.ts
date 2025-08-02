export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  accessLevel: number;
  isEnabled: boolean;
  email: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  accessLevel: number;
  isEnabled: boolean;
  email: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  accessLevel?: number;
  isEnabled?: boolean;
  email?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  user: User;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
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

export const ACCESS_LEVELS = {
  CASHIER: 0,
  CASHIER_LEVEL_5: 5,
  ADMIN: 10,
} as const;

export const ACCESS_LEVEL_LABELS = {
  0: 'Cashier',
  5: 'Cashier',
  10: 'Admin',
} as const; 