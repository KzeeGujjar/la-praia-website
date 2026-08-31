import type { MenuCategory, MenuItem } from "@prisma/client";

export function serializeItem(item: MenuItem) {
  return {
    id: item.id,
    categoryId: item.categoryId,
    name: item.name,
    descriptionIt: item.descriptionIt ?? undefined,
    descriptionEn: item.descriptionEn ?? undefined,
    price: Number(item.price),
    glutenFree: item.glutenFree,
    imageUrl: item.imageUrl ?? undefined,
    available: item.available,
    featured: item.featured,
  };
}

export function serializeCategory(category: MenuCategory & { items?: MenuItem[] }) {
  return {
    id: category.id,
    nameIt: category.nameIt,
    nameEn: category.nameEn,
    sortOrder: category.sortOrder,
    ...(category.items ? { items: category.items.map(serializeItem) } : {}),
  };
}
