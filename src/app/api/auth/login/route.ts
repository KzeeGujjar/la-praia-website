import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken, generateRefreshToken, REFRESH_TOKEN_TTL_MS } from "@/lib/auth/tokens";
import { setSessionCookies } from "@/lib/auth/session";

export const runtime = "nodejs";

type LoginBody = { email?: unknown; password?: unknown };

export async function POST(req: Request) {
  let body: LoginBody;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { email, password } = body;
  if (typeof email !== "string" || typeof password !== "string") {
    return new Response("Invalid request", { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  // Same generic error whether the email is unknown or the password is wrong,
  // so a login attempt can't be used to enumerate registered addresses.
  const invalid = () => new Response("Invalid email or password", { status: 401 });
  if (!user) return invalid();

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return invalid();

  const accessToken = await signAccessToken({ sub: user.id, role: user.role });
  const { token: refreshToken, hash } = generateRefreshToken();
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: hash, expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS) },
  });
  await setSessionCookies(accessToken, refreshToken);

  return Response.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });
}
