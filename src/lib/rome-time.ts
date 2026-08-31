// Shared helper for anything that needs to compare a moment in time against
// La Praia's opening hours, which are always expressed in the restaurant's
// own local time (Europe/Rome) regardless of where a visitor or server is.

export const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayKey = (typeof DAY_ORDER)[number];

export function getRomePartsAt(date: Date): { weekday: DayKey; hour: number; minute: number; minutesOfDay: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const weekday = (parts.find((p) => p.type === "weekday")?.value ?? "").toLowerCase() as DayKey;
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return { weekday, hour, minute, minutesOfDay: hour * 60 + minute };
}

/** Parses an en-dash separated "HH:MM–HH:MM" window into minutes-of-day. */
export function parseWindow(window: string): [number, number] {
  const [start, end] = window.split("–").map((t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  });
  return [start, end];
}
