// Shared shape for menu data once it's left Prisma's Decimal/DB types behind —
// used by the public API serializer (src/lib/menu-serialize.ts) and by every
// frontend component that renders DB-backed menu content.

export type PublicMenuItem = {
  id: string;
  categoryId: string;
  name: string;
  descriptionIt?: string;
  descriptionEn?: string;
  price: number;
  glutenFree: boolean;
  imageUrl?: string;
  available: boolean;
  featured: boolean;
};

export type PublicMenuCategory = {
  id: string;
  nameIt: string;
  nameEn: string;
  sortOrder: number;
  items?: PublicMenuItem[];
};
