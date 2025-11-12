import { ReactNode } from "react";
import { ApiResponse, User } from "./common";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  residentPlace?: string;
}

export interface JWTPayload {
  sub?: number | string;
  id?: string;
  email: string;
  username?: string;
  fullName?: ReactNode | string | null;
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
