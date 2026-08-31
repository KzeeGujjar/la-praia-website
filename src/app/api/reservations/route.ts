import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";
import { generateConfirmationCode } from "@/lib/confirmation-code";
import { parseReservationInput, assertWithinOpeningHours, ReservationValidationError } from "@/lib/reservations";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  try {
    const input = parseReservationInput(body as Record<string, unknown>, { partial: false });
    await assertWithinOpeningHours(input.requestedFor!);

    const sessionUser = await getSessionUser();
    const reservation = await prisma.reservation.create({
      data: {
        userId: sessionUser?.id ?? null,
        customerName: input.customerName!,
        customerPhone: input.customerPhone!,
        customerEmail: input.customerEmail ?? null,
        partySize: input.partySize!,
        requestedFor: input.requestedFor!,
        notes: input.notes ?? null,
        allergies: input.allergies ?? null,
        language: input.language ?? "IT",
        confirmationCode: generateConfirmationCode(),
      },
    });

    return Response.json(
      {
        id: reservation.id,
        status: reservation.status,
        requestedFor: reservation.requestedFor,
        confirmationCode: reservation.confirmationCode,
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof ReservationValidationError) {
      return new Response(err.message, { status: err.status });
    }
    throw err;
  }
}
