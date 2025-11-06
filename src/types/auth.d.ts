import { ApiResponse, User } from "./common";

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
  fullName: ReactNode;
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

export type LoginResponse = AuthUser;

export type SignupResponse = AuthUser;

export interface AuthError extends ApiResponse {
  success: false;
}
