import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";
import { parseReservationInput, assertWithinOpeningHours, ReservationValidationError } from "@/lib/reservations";

export const runtime = "nodejs";

const STAFF_ROLES = ["STAFF", "MANAGER", "SUPER_ADMIN"];

/**
 * A guest reservation has no login to prove ownership with, so lookups/edits
 * from the customer side are gated by the confirmationCode they were handed
 * back at creation instead. Staff bypass this entirely.
 */
async function authorize(reservationId: string, providedCode: string | null) {
  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) return { reservation: null, allowed: false };

  const sessionUser = await getSessionUser();
  if (sessionUser && STAFF_ROLES.includes(sessionUser.role)) {
    return { reservation, allowed: true };
  }
  if (providedCode && providedCode === reservation.confirmationCode) {
    return { reservation, allowed: true };
  }
  return { reservation, allowed: false };
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const code = new URL(req.url).searchParams.get("code");
  const { reservation, allowed } = await authorize(id, code);

  if (!reservation) return new Response("Not found", { status: 404 });
  if (!allowed) return new Response("Forbidden", { status: 403 });

  return Response.json(reservation);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const code = typeof body.confirmationCode === "string" ? body.confirmationCode : null;
  const { reservation, allowed } = await authorize(id, code);
  if (!reservation) return new Response("Not found", { status: 404 });
  if (!allowed) return new Response("Forbidden", { status: 403 });

  // Once staff have acted on a booking, further changes should go through
  // staff (via /api/admin/reservations/:id/status) rather than being silently
  // overwritten by the customer.
  if (reservation.status !== "PENDING") {
    return new Response(`Reservation is already ${reservation.status.toLowerCase()} and can no longer be edited by the customer`, {
      status: 409,
    });
  }

  try {
    const input = parseReservationInput(body, { partial: true });
    if (input.requestedFor) {
      await assertWithinOpeningHours(input.requestedFor);
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: input,
    });
    return Response.json(updated);
  } catch (err) {
    if (err instanceof ReservationValidationError) {
      return new Response(err.message, { status: err.status });
    }
    throw err;
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const code = new URL(req.url).searchParams.get("code");
  const { reservation, allowed } = await authorize(id, code);

  if (!reservation) return new Response("Not found", { status: 404 });
  if (!allowed) return new Response("Forbidden", { status: 403 });

  // Cancel rather than hard-delete: reservations are a business record worth
  // keeping (no-show tracking, history), and confirmationCode lookups should
  // keep working after a cancellation.
  const updated = await prisma.reservation.update({ where: { id }, data: { status: "CANCELLED" } });
  return Response.json(updated);
}
