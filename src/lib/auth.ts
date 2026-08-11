export const AUTH_COOKIE = "eduayna_session";

export function getAuthCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
  };
}

export function createSessionToken() {
  const secret = process.env.AUTH_SECRET || "eduayna-dev-secret";
  return Buffer.from(`authenticated:${secret}`).toString("base64url");
}

export function isValidSessionToken(token: string | undefined) {
  if (!token) return false;
  return token === createSessionToken();
}

export async function isAuthenticated() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(AUTH_COOKIE)?.value);
}
