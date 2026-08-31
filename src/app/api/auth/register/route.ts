import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { signAccessToken, generateRefreshToken, REFRESH_TOKEN_TTL_MS } from "@/lib/auth/tokens";
import { setSessionCookies } from "@/lib/auth/session";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RegisterBody = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  password?: unknown;
};

export async function POST(req: Request) {
  let body: RegisterBody;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { firstName, lastName, email, phone, password } = body;
  if (
    typeof firstName !== "string" ||
    !firstName.trim() ||
    typeof lastName !== "string" ||
    !lastName.trim() ||
    typeof email !== "string" ||
    !EMAIL_RE.test(email) ||
    typeof password !== "string" ||
    password.length < 8 ||
    (phone !== undefined && typeof phone !== "string")
  ) {
    return new Response("Invalid request", { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return new Response("An account with this email already exists", { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || null,
      passwordHash,
      role: "CUSTOMER",
    },
  });

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
