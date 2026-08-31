import { prisma } from "@/lib/db";
import { serializeItem } from "@/lib/menu-serialize";

export const runtime = "nodejs";

export async function GET() {
  const items = await prisma.menuItem.findMany({
    where: { available: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });
  return Response.json(items.map(serializeItem));
}
