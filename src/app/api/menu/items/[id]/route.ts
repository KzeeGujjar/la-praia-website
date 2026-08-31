import { prisma } from "@/lib/db";
import { serializeItem } from "@/lib/menu-serialize";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item || !item.available) return new Response("Not found", { status: 404 });
  return Response.json(serializeItem(item));
}
