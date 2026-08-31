import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { parseCategoryInput, MenuValidationError } from "@/lib/menu-admin";
import { serializeCategory } from "@/lib/menu-serialize";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const staff = await requireRole("MANAGER", "SUPER_ADMIN");
  if (!staff) return new Response("Forbidden", { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  try {
    const input = parseCategoryInput(body, { partial: false });
    const existing = await prisma.menuCategory.findUnique({ where: { id: input.id! } });
    if (existing) return new Response("A category with this id already exists", { status: 409 });

    const category = await prisma.menuCategory.create({
      data: { id: input.id!, nameIt: input.nameIt!, nameEn: input.nameEn!, sortOrder: input.sortOrder ?? 0 },
    });
    return Response.json(serializeCategory(category), { status: 201 });
  } catch (err) {
    if (err instanceof MenuValidationError) return new Response(err.message, { status: err.status });
    throw err;
  }
}
