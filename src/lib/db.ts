import { PrismaClient } from "@prisma/client";

// Next.js dev-mode hot-reloading re-evaluates this module on every edit; without
// caching the client on `globalThis` each reload would open a new DB connection
// pool until Postgres runs out of connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
