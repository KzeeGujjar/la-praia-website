import { prisma } from "@/lib/db";
import { getSessionUser, requireRole } from "@/lib/auth/session";
import { getRomePartsAt, parseWindow } from "@/lib/rome-time";

export const runtime = "nodejs";

const PHONE_RE = /^[0-9+()\-\s]{6,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_LEAD_MINUTES = 30;
const MAX_ADVANCE_DAYS = 60;
const MAX_PARTY_SIZE = 20;

type ReservationBody = {
  customerName?: unknown;
  customerPhone?: unknown;
  customerEmail?: unknown;
  partySize?: unknown;
  requestedFor?: unknown;
  notes?: unknown;
  language?: unknown;
};

export async function POST(req: Request) {
  let body: ReservationBody;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { customerName, customerPhone, customerEmail, partySize, requestedFor, notes, language } = body;

  if (
    typeof customerName !== "string" ||
    !customerName.trim() ||
    customerName.length > 100 ||
    typeof customerPhone !== "string" ||
    !PHONE_RE.test(customerPhone) ||
    (customerEmail !== undefined && customerEmail !== null && (typeof customerEmail !== "string" || !EMAIL_RE.test(customerEmail))) ||
    typeof partySize !== "number" ||
    !Number.isInteger(partySize) ||
    partySize < 1 ||
    partySize > MAX_PARTY_SIZE ||
    typeof requestedFor !== "string" ||
    (notes !== undefined && notes !== null && (typeof notes !== "string" || notes.length > 500)) ||
    (language !== undefined && language !== "it" && language !== "en")
  ) {
    return new Response("Invalid request", { status: 400 });
  }

  const requestedDate = new Date(requestedFor);
  if (Number.isNaN(requestedDate.getTime())) {
    return new Response("Invalid date", { status: 400 });
  }

  const now = new Date();
  if (requestedDate.getTime() < now.getTime() + MIN_LEAD_MINUTES * 60_000) {
    return new Response(`Reservation must be at least ${MIN_LEAD_MINUTES} minutes from now`, { status: 400 });
  }
  if (requestedDate.getTime() > now.getTime() + MAX_ADVANCE_DAYS * 24 * 60 * 60_000) {
    return new Response(`Reservation can't be more than ${MAX_ADVANCE_DAYS} days out`, { status: 400 });
  }

  const { weekday, minutesOfDay } = getRomePartsAt(requestedDate);
  const dayHours = await prisma.businessHours.findUnique({ where: { day: weekday } });
  const withinHours =
    !!dayHours?.pickup &&
    (() => {
      const [start, end] = parseWindow(dayHours.pickup!);
      return minutesOfDay >= start && minutesOfDay <= end;
    })();
  if (!withinHours) {
    return new Response("Requested time falls outside opening hours", { status: 422 });
  }

  const sessionUser = await getSessionUser();

  const reservation = await prisma.reservation.create({
    data: {
      userId: sessionUser?.id ?? null,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail?.trim() || null,
      partySize,
      requestedFor: requestedDate,
      notes: notes?.trim() || null,
      language: (language ?? "it").toUpperCase() as "IT" | "EN",
    },
  });

  return Response.json(
    {
      id: reservation.id,
      status: reservation.status,
      requestedFor: reservation.requestedFor,
    },
    { status: 201 },
  );
}

export async function GET(req: Request) {
  const staff = await requireRole("STAFF", "MANAGER", "SUPER_ADMIN");
  if (!staff) return new Response("Forbidden", { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

  const reservations = await prisma.reservation.findMany({
    where: status && validStatuses.includes(status) ? { status: status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" } : undefined,
    orderBy: { requestedFor: "asc" },
  });

  return Response.json(reservations);
}
