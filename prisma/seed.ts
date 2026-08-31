// Seeds the DB from the existing static content in src/data/, plus a bootstrap
// super admin from env vars, so the DB starts in sync with what the frontend
// has been shipping as static data. Re-run anytime with `npm run db:seed` —
// menu/business upserts are idempotent; the super admin is only created once.
import { PrismaClient } from "@prisma/client";
import { business } from "../src/data/business";
import { menu, menuHighlights } from "../src/data/menu";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function seedMenu() {
  for (const [categoryIndex, category] of menu.entries()) {
    await prisma.menuCategory.upsert({
      where: { id: category.id },
      update: { nameIt: category.nameIt, nameEn: category.nameEn, sortOrder: categoryIndex },
      create: { id: category.id, nameIt: category.nameIt, nameEn: category.nameEn, sortOrder: categoryIndex },
    });

    for (const [itemIndex, item] of category.items.entries()) {
      const existing = await prisma.menuItem.findFirst({
        where: { categoryId: category.id, name: item.name },
      });
      const featured = menuHighlights.some((h) => h.categoryId === category.id && h.itemName === item.name);
      const data = {
        categoryId: category.id,
        name: item.name,
        descriptionIt: item.descriptionIt ?? null,
        descriptionEn: item.descriptionEn ?? null,
        price: item.price,
        glutenFree: item.glutenFree ?? false,
        featured,
        sortOrder: itemIndex,
      };
      if (existing) {
        await prisma.menuItem.update({ where: { id: existing.id }, data });
      } else {
        await prisma.menuItem.create({ data });
      }
    }
  }
  console.log(`Seeded ${menu.length} menu categories.`);
}

async function seedHours() {
  for (const h of business.hours) {
    await prisma.businessHours.upsert({
      where: { day: h.day },
      update: { pickup: h.pickup, delivery: h.delivery },
      create: { day: h.day, pickup: h.pickup, delivery: h.delivery },
    });
  }
  console.log(`Seeded business hours for ${business.hours.length} days.`);
}

async function seedSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("SUPER_ADMIN_EMAIL/SUPER_ADMIN_PASSWORD not set — skipping super admin bootstrap.");
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    console.log(`Super admin ${email} already exists — skipping.`);
    return;
  }

  await prisma.user.create({
    data: {
      firstName: "Super",
      lastName: "Admin",
      email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
      role: "SUPER_ADMIN",
    },
  });
  console.log(`Created super admin ${email}.`);
}

async function main() {
  await seedMenu();
  await seedHours();
  await seedSuperAdmin();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
