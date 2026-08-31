import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { MenuAdmin } from "@/components/admin/MenuAdmin";

export default async function AdminMenuPage() {
  const manager = await requireRole("MANAGER", "SUPER_ADMIN");
  if (!manager) {
    return (
      <p className="border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
        Only managers and super admins can edit the menu.
      </p>
    );
  }

  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  const serialized = categories.map((c) => ({
    ...c,
    items: c.items.map((item) => ({ ...item, price: Number(item.price) })),
  }));

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-navy">Menu</h1>
      <p className="mt-1 text-sm text-ink/60">
        Changes here update the database only — the live site still reads from src/data/menu.ts (see CLAUDE.md).
      </p>
      <div className="mt-6">
        <MenuAdmin categories={serialized} />
      </div>
    </div>
  );
}
