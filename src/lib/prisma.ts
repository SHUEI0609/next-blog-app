import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// DATABASE_URLの取得（undefined対策）
const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = dbUrl.replace("file:", "").replace("file:", ""); // 重複除去も含め念のため

const adapter = new PrismaBetterSqlite3({
  url: dbPath,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
