import { prisma } from "@/lib/db";
import { serializeCategory } from "@/lib/menu-serialize";

export const runtime = "nodejs";

export async function GET() {
  const categories = await prisma.menuCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return Response.json(categories.map(serializeCategory));
}
