import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { parseItemInput, MenuValidationError } from "@/lib/menu-admin";
import { serializeItem } from "@/lib/menu-serialize";

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
    const input = parseItemInput(body, { partial: false });
    const category = await prisma.menuCategory.findUnique({ where: { id: input.categoryId! } });
    if (!category) return new Response("categoryId does not reference an existing category", { status: 400 });

    const item = await prisma.menuItem.create({
      data: {
        categoryId: input.categoryId!,
        name: input.name!,
        price: input.price!,
        descriptionIt: input.descriptionIt ?? null,
        descriptionEn: input.descriptionEn ?? null,
        imageUrl: input.imageUrl ?? null,
        glutenFree: input.glutenFree ?? false,
        available: input.available ?? true,
        featured: input.featured ?? false,
        sortOrder: input.sortOrder ?? 0,
      },
    });
    return Response.json(serializeItem(item), { status: 201 });
  } catch (err) {
    if (err instanceof MenuValidationError) return new Response(err.message, { status: err.status });
    throw err;
  }
}
