export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  iat: number;
  exp: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: JWTPayload;
  };
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: JWTPayload;
  };
}

export interface AuthError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
