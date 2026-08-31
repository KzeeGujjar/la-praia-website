import { prisma } from "@/lib/db";
import { serializeCategory, serializeItem } from "@/lib/menu-serialize";
import { HomeContent } from "@/components/HomeContent";
import { menu as staticMenu, menuHighlights } from "@/data/menu";
import type { PublicMenuCategory, PublicMenuItem } from "@/types/menu";

// Menu content is admin-editable (see /admin/menu) and should reflect changes
// without a redeploy; force-dynamic also means `next build` never needs a
// live DATABASE_URL just to prerender this page (unlike the default static
// generation, which queries the DB at build time).
export const dynamic = "force-dynamic";

type FeaturedItem = PublicMenuItem & { category: { nameIt: string; nameEn: string } | null };

/**
 * If the DB is unreachable (unset DATABASE_URL, outage, etc.) the homepage
 * should still render — falls back to the last-committed src/data/menu.ts
 * snapshot instead of taking down the whole site over a menu-display feature.
 */
function staticFallback(): { categories: PublicMenuCategory[]; featuredItems: FeaturedItem[] } {
  const categories: PublicMenuCategory[] = staticMenu.map((category, categoryIndex) => ({
    id: category.id,
    nameIt: category.nameIt,
    nameEn: category.nameEn,
    sortOrder: categoryIndex,
    items: category.items.map((item, itemIndex) => ({
      id: `${category.id}-${itemIndex}`,
      categoryId: category.id,
      name: item.name,
      descriptionIt: item.descriptionIt,
      descriptionEn: item.descriptionEn,
      price: item.price,
      glutenFree: item.glutenFree ?? false,
      available: true,
      featured: menuHighlights.some((h) => h.categoryId === category.id && h.itemName === item.name),
    })),
  }));

  const featuredItems: FeaturedItem[] = categories.flatMap((category) =>
    (category.items ?? [])
      .filter((item) => item.featured)
      .map((item) => ({ ...item, category: { nameIt: category.nameIt, nameEn: category.nameEn } })),
  );

  return { categories, featuredItems };
}

async function loadMenu(): Promise<{ categories: PublicMenuCategory[]; featuredItems: FeaturedItem[] }> {
  try {
    const [categories, featured] = await Promise.all([
      prisma.menuCategory.findMany({
        orderBy: { sortOrder: "asc" },
        include: { items: { where: { available: true }, orderBy: { sortOrder: "asc" } } },
      }),
      prisma.menuItem.findMany({
        where: { featured: true, available: true },
        include: { category: { select: { nameIt: true, nameEn: true } } },
        orderBy: { sortOrder: "asc" },
      }),
    ]);
    return {
      categories: categories.map(serializeCategory),
      featuredItems: featured.map((item) => ({ ...serializeItem(item), category: item.category })),
    };
  } catch (err) {
    console.error("Menu DB fetch failed, falling back to src/data/menu.ts:", err);
    return staticFallback();
  }
}

export default async function Home() {
  const { categories, featuredItems } = await loadMenu();
  return <HomeContent categories={categories} featuredItems={featuredItems} />;
}
