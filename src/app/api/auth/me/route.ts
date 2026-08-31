import { getSessionUser } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return new Response("Not authenticated", { status: 401 });
  return Response.json(user);
}
