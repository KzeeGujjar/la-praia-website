import { prisma } from "@/lib/db";
import { serializeItem } from "@/lib/menu-serialize";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return Response.json([]);

  const items = await prisma.menuItem.findMany({
    where: {
      available: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { descriptionIt: { contains: q, mode: "insensitive" } },
        { descriptionEn: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { name: "asc" },
    take: 50,
  });

  return Response.json(items.map(serializeItem));
}
