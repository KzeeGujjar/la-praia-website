import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { hashRefreshToken } from "@/lib/auth/tokens";
import { clearSessionCookies, REFRESH_COOKIE } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  if (refreshToken) {
    const hash = hashRefreshToken(refreshToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  await clearSessionCookies();
  return Response.json({ ok: true });
}
