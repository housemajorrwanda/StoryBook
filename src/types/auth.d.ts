import { ApiResponse, User } from './common';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  fullName: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthUser {
  token: string;
  user: JWTPayload;
}

export interface LoginResponse extends ApiResponse<AuthUser> {}

export interface SignupResponse extends ApiResponse<AuthUser> {}

export interface AuthError extends ApiResponse {
  success: false;
}
