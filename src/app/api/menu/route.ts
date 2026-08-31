import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: { where: { available: true }, orderBy: { sortOrder: "asc" } } },
  });

  const menu = categories.map((category) => ({
    id: category.id,
    nameIt: category.nameIt,
    nameEn: category.nameEn,
    items: category.items.map((item) => ({
      name: item.name,
      descriptionIt: item.descriptionIt ?? undefined,
      descriptionEn: item.descriptionEn ?? undefined,
      price: Number(item.price),
      glutenFree: item.glutenFree,
      imageUrl: item.imageUrl ?? undefined,
    })),
  }));

  return Response.json(menu);
}
