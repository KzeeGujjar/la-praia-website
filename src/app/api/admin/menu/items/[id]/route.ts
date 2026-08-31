import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { parseItemInput, MenuValidationError } from "@/lib/menu-admin";
import { serializeItem } from "@/lib/menu-serialize";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireRole("MANAGER", "SUPER_ADMIN");
  if (!staff) return new Response("Forbidden", { status: 403 });

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  try {
    const input = parseItemInput(body, { partial: true });
    if (input.categoryId) {
      const category = await prisma.menuCategory.findUnique({ where: { id: input.categoryId } });
      if (!category) return new Response("categoryId does not reference an existing category", { status: 400 });
    }
    const item = await prisma.menuItem.update({ where: { id }, data: input });
    return Response.json(serializeItem(item));
  } catch (err) {
    if (err instanceof MenuValidationError) return new Response(err.message, { status: err.status });
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return new Response("Not found", { status: 404 });
    }
    throw err;
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireRole("MANAGER", "SUPER_ADMIN");
  if (!staff) return new Response("Forbidden", { status: 403 });

  const { id } = await params;
  try {
    // OrderItem.menuItemId is SetNull on delete (see schema.prisma), so this
    // never fails on an item that's already appeared in a past order.
    await prisma.menuItem.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return new Response("Not found", { status: 404 });
    }
    throw err;
  }
}
