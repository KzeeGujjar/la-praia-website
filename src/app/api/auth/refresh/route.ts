import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { signAccessToken, generateRefreshToken, hashRefreshToken, REFRESH_TOKEN_TTL_MS } from "@/lib/auth/tokens";
import { setSessionCookies, clearSessionCookies, REFRESH_COOKIE } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return new Response("Not authenticated", { status: 401 });

  const hash = hashRefreshToken(refreshToken);
  const record = await prisma.refreshToken.findUnique({ where: { tokenHash: hash }, include: { user: true } });

  if (!record || record.revokedAt || record.expiresAt < new Date()) {
    await clearSessionCookies();
    return new Response("Session expired", { status: 401 });
  }

  // Rotate on every refresh: revoke the used token and issue a fresh one, so a
  // stolen-but-unused refresh cookie stops working the next time the real
  // owner refreshes.
  const { token: newRefreshToken, hash: newHash } = generateRefreshToken();
  await prisma.$transaction([
    prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } }),
    prisma.refreshToken.create({
      data: { userId: record.userId, tokenHash: newHash, expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS) },
    }),
  ]);

  const accessToken = await signAccessToken({ sub: record.user.id, role: record.user.role });
  await setSessionCookies(accessToken, newRefreshToken);

  return Response.json({ ok: true });
}
