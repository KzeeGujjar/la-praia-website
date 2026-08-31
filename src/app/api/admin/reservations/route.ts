import type { Prisma, ReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";

export const runtime = "nodejs";

const VALID_STATUSES: ReservationStatus[] = ["PENDING", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export async function GET(req: Request) {
  const staff = await requireRole("STAFF", "MANAGER", "SUPER_ADMIN");
  if (!staff) return new Response("Forbidden", { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date"); // YYYY-MM-DD, filters to that calendar day

  const where: Prisma.ReservationWhereInput = {};
  if (status) {
    if (!VALID_STATUSES.includes(status as ReservationStatus)) return new Response("Invalid status", { status: 400 });
    where.status = status as ReservationStatus;
  }
  if (date) {
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(dayStart.getTime())) return new Response("Invalid date", { status: 400 });
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60_000);
    where.requestedFor = { gte: dayStart, lt: dayEnd };
  }

  const reservations = await prisma.reservation.findMany({
    where,
    orderBy: { requestedFor: "asc" },
  });

  return Response.json(reservations);
}
