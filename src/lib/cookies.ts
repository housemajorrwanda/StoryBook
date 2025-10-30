export function setAuthToken(token: string, expiresInHours: number = 24): void {
  if (typeof window === "undefined") return;

  // Store in localStorage
  localStorage.setItem("authToken", token);

  // Store in cookies with expiration
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + expiresInHours);

  const isProduction = process.env.NODE_ENV === "production";

  document.cookie = `authToken=${token}; expires=${expirationDate.toUTCString()}; path=/; ${
    isProduction ? "secure; samesite=strict" : ""
  }`;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;

  // Remove from localStorage
  localStorage.removeItem("authToken");

  // Remove from cookies
  document.cookie =
    "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}
