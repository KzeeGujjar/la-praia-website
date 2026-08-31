import type { ReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";

export const runtime = "nodejs";

const VALID_STATUSES: ReservationStatus[] = ["PENDING", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireRole("STAFF", "MANAGER", "SUPER_ADMIN");
  if (!staff) return new Response("Forbidden", { status: 403 });

  const { id } = await params;
  let body: { status?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (typeof body.status !== "string" || !(VALID_STATUSES as string[]).includes(body.status)) {
    return new Response(`status must be one of ${VALID_STATUSES.join(", ")}`, { status: 400 });
  }

  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) return new Response("Not found", { status: 404 });

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status: body.status as ReservationStatus },
  });

  return Response.json(updated);
}
