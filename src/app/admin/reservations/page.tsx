import { prisma } from "@/lib/db";
import { ReservationsTable } from "@/components/admin/ReservationsTable";

const STATUSES = ["PENDING", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"] as const;

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = STATUSES.includes(status as (typeof STATUSES)[number]) ? status : undefined;

  const reservations = await prisma.reservation.findMany({
    where: activeStatus ? { status: activeStatus as (typeof STATUSES)[number] } : undefined,
    orderBy: { requestedFor: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-navy">Reservations</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterLink label="All" status={undefined} active={!activeStatus} />
        {STATUSES.map((s) => (
          <FilterLink key={s} label={s.replace("_", " ")} status={s} active={activeStatus === s} />
        ))}
      </div>

      <div className="mt-6">
        <ReservationsTable reservations={reservations} />
      </div>
    </div>
  );
}

function FilterLink({ label, status, active }: { label: string; status?: string; active: boolean }) {
  return (
    <a
      href={status ? `/admin/reservations?status=${status}` : "/admin/reservations"}
      className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
        active ? "bg-navy text-sand" : "border border-navy/20 text-navy hover:bg-navy/5"
      }`}
    >
      {label}
    </a>
  );
}
