import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export async function GET() {
  const hours = await prisma.businessHours.findMany();
  const sorted = [...hours].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));

  return Response.json(
    sorted.map((h) => ({ day: h.day, pickup: h.pickup, delivery: h.delivery })),
  );
}
