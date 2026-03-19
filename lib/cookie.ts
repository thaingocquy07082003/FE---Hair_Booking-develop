// ─── Set ───────────────────────────────────────────────────────────────────
export function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

// ─── Get ────────────────────────────────────────────────────────────────────
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

// ─── Delete one ─────────────────────────────────────────────────────────────
export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// ─── Clear all auth cookies ──────────────────────────────────────────────────
export function clearAuthCookies() {
  const authCookies = [
    "accessToken",
    "refreshToken",
    "userEmail",
    "userFullName",
    "userRole",
    "userId",
    "userPhone",
    "userAvatarUrl",
    "userVerified",
  ];
  authCookies.forEach(deleteCookie);
}