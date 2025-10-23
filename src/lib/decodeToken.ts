import { JWTPayload } from '@/types/auth';
import { getAuthToken, isTokenExpired } from './cookies';

export function decodeAuthToken(key = 'authToken'): JWTPayload | null {
  if (typeof window === 'undefined') return null;

  try {
    const token = localStorage.getItem(key);
    if (!token) return null;

    if (isTokenExpired(token)) {
      localStorage.removeItem(key);
      return null;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload as JWTPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.removeItem(key);
    return null;
  }
}

export function getCurrentUser(): JWTPayload | null {
  return decodeAuthToken();
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  return !isTokenExpired(token);
}
