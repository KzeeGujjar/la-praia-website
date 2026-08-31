import { cookies } from "next/headers";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/tokens";
import { REFRESH_TOKEN_TTL_MS } from "@/lib/auth/tokens";

export const ACCESS_COOKIE = "la_praia_access";
export const REFRESH_COOKIE = "la_praia_refresh";

const isProd = process.env.NODE_ENV === "production";

export async function setSessionCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });
  store.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_TTL_MS / 1000,
  });
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
};

// Reads only the access-token cookie — a valid session with an expired access
// token still requires a call to /api/auth/refresh; this function never
// silently upgrades a refresh token, so it stays safe to call from any route.
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  });
  return user;
}

export async function requireRole(...roles: Role[]): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user || !roles.includes(user.role)) return null;
  return user;
}
