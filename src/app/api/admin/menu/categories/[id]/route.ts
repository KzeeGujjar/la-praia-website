import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { parseCategoryInput, MenuValidationError } from "@/lib/menu-admin";
import { serializeCategory } from "@/lib/menu-serialize";

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
    const input = parseCategoryInput(body, { partial: true });
    const category = await prisma.menuCategory.update({ where: { id }, data: input });
    return Response.json(serializeCategory(category));
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
    // Deleting a category cascades to its MenuItems (see schema.prisma).
    await prisma.menuCategory.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return new Response("Not found", { status: 404 });
    }
    throw err;
  }
}
