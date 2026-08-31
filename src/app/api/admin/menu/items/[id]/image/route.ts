import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { uploadMenuItemImage, ImageUploadError } from "@/lib/storage";
import { serializeItem } from "@/lib/menu-serialize";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireRole("MANAGER", "SUPER_ADMIN");
  if (!staff) return new Response("Forbidden", { status: 403 });

  const { id } = await params;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return new Response("Expected multipart/form-data with a 'file' field", { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return new Response("Missing 'file'", { status: 400 });
  }

  try {
    const imageUrl = await uploadMenuItemImage(id, file);
    const item = await prisma.menuItem.update({ where: { id }, data: { imageUrl } });
    return Response.json(serializeItem(item));
  } catch (err) {
    if (err instanceof ImageUploadError) return new Response(err.message, { status: err.status });
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return new Response("Not found", { status: 404 });
    }
    throw err;
  }
}
