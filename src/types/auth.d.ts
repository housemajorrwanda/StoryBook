import { ApiResponse, User } from './common';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role?: string;
  iat: number;
  exp: number;
}

export interface AuthUser {
  access_token: string;
  user: User;
}

export interface LoginResponse extends ApiResponse<AuthUser> {}

export interface SignupResponse extends ApiResponse<AuthUser> {}

export interface AuthError extends ApiResponse {
  success: false;
}
