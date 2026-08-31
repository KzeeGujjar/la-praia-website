import { prisma } from "@/lib/db";
import { getRomePartsAt, parseWindow } from "@/lib/rome-time";

const PHONE_RE = /^[0-9+()\-\s]{6,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_LEAD_MINUTES = 30;
const MAX_ADVANCE_DAYS = 60;
const MAX_PARTY_SIZE = 20;

export class ReservationValidationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export type ReservationInput = {
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  partySize: number;
  requestedFor: Date;
  notes: string | null;
  allergies: string | null;
  language: "IT" | "EN";
};

type RawBody = {
  customerName?: unknown;
  customerPhone?: unknown;
  customerEmail?: unknown;
  partySize?: unknown;
  requestedFor?: unknown;
  notes?: unknown;
  allergies?: unknown;
  language?: unknown;
};

/** Shared by create (all fields required) and update (only present fields are validated). */
export function parseReservationInput(body: RawBody, { partial }: { partial: boolean }): Partial<ReservationInput> {
  const result: Partial<ReservationInput> = {};

  if (body.customerName !== undefined || !partial) {
    if (typeof body.customerName !== "string" || !body.customerName.trim() || body.customerName.length > 100) {
      throw new ReservationValidationError("Invalid customerName");
    }
    result.customerName = body.customerName.trim();
  }

  if (body.customerPhone !== undefined || !partial) {
    if (typeof body.customerPhone !== "string" || !PHONE_RE.test(body.customerPhone)) {
      throw new ReservationValidationError("Invalid customerPhone");
    }
    result.customerPhone = body.customerPhone.trim();
  }

  if (body.customerEmail !== undefined) {
    if (body.customerEmail !== null && (typeof body.customerEmail !== "string" || !EMAIL_RE.test(body.customerEmail))) {
      throw new ReservationValidationError("Invalid customerEmail");
    }
    result.customerEmail = body.customerEmail ? body.customerEmail.trim() : null;
  }

  if (body.partySize !== undefined || !partial) {
    if (typeof body.partySize !== "number" || !Number.isInteger(body.partySize) || body.partySize < 1 || body.partySize > MAX_PARTY_SIZE) {
      throw new ReservationValidationError(`partySize must be an integer between 1 and ${MAX_PARTY_SIZE}`);
    }
    result.partySize = body.partySize;
  }

  if (body.requestedFor !== undefined || !partial) {
    if (typeof body.requestedFor !== "string") {
      throw new ReservationValidationError("Invalid requestedFor");
    }
    const date = new Date(body.requestedFor);
    if (Number.isNaN(date.getTime())) {
      throw new ReservationValidationError("Invalid requestedFor");
    }
    const now = new Date();
    if (date.getTime() < now.getTime() + MIN_LEAD_MINUTES * 60_000) {
      throw new ReservationValidationError(`Reservation must be at least ${MIN_LEAD_MINUTES} minutes from now`);
    }
    if (date.getTime() > now.getTime() + MAX_ADVANCE_DAYS * 24 * 60 * 60_000) {
      throw new ReservationValidationError(`Reservation can't be more than ${MAX_ADVANCE_DAYS} days out`);
    }
    result.requestedFor = date;
  }

  if (body.notes !== undefined) {
    if (body.notes !== null && (typeof body.notes !== "string" || body.notes.length > 500)) {
      throw new ReservationValidationError("Invalid notes");
    }
    result.notes = body.notes ? body.notes.trim() : null;
  }

  if (body.allergies !== undefined) {
    if (body.allergies !== null && (typeof body.allergies !== "string" || body.allergies.length > 500)) {
      throw new ReservationValidationError("Invalid allergies");
    }
    result.allergies = body.allergies ? body.allergies.trim() : null;
  }

  if (body.language !== undefined) {
    if (body.language !== "it" && body.language !== "en") {
      throw new ReservationValidationError("Invalid language");
    }
    result.language = body.language.toUpperCase() as "IT" | "EN";
  }

  return result;
}

/** Throws a 422 ReservationValidationError if `date` falls outside the restaurant's opening hours. */
export async function assertWithinOpeningHours(date: Date): Promise<void> {
  const { weekday, minutesOfDay } = getRomePartsAt(date);
  const dayHours = await prisma.businessHours.findUnique({ where: { day: weekday } });
  const withinHours =
    !!dayHours?.pickup &&
    (() => {
      const [start, end] = parseWindow(dayHours.pickup!);
      return minutesOfDay >= start && minutesOfDay <= end;
    })();
  if (!withinHours) {
    throw new ReservationValidationError("Requested time falls outside opening hours", 422);
  }
}
