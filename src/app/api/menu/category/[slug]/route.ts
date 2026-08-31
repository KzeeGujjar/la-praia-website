import { prisma } from "@/lib/db";
import { serializeCategory } from "@/lib/menu-serialize";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.menuCategory.findUnique({
    where: { id: slug },
    include: { items: { where: { available: true }, orderBy: { sortOrder: "asc" } } },
  });
  if (!category) return new Response("Not found", { status: 404 });
  return Response.json(serializeCategory(category));
}
