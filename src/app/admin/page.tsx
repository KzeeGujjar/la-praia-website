import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60_000);

  const [pendingCount, todayCount, categoryCount, itemCount] = await Promise.all([
    prisma.reservation.count({ where: { status: "PENDING" } }),
    prisma.reservation.count({ where: { requestedFor: { gte: todayStart, lt: todayEnd }, status: { notIn: ["CANCELLED", "NO_SHOW"] } } }),
    prisma.menuCategory.count(),
    prisma.menuItem.count(),
  ]);

  const cards = [
    { label: "Pending reservations", value: pendingCount, href: "/admin/reservations?status=PENDING" },
    { label: "Reservations today", value: todayCount, href: "/admin/reservations" },
    { label: "Menu categories", value: categoryCount, href: "/admin/menu" },
    { label: "Menu items", value: itemCount, href: "/admin/menu" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-navy">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border border-navy/15 bg-white px-5 py-6 transition-colors hover:border-terracotta"
          >
            <p className="text-3xl font-semibold text-navy">{card.value}</p>
            <p className="mt-1 text-sm text-ink/60">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
