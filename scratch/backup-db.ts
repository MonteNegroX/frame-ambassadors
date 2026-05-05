import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Загружаем переменные окружения
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL не найден в .env");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function backupUsers() {
  try {
    console.log("📡 Подключаюсь к базе данных...");
    const users = await prisma.user.findMany();
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `db-backup-users-${timestamp}.json`;
    const backupPath = path.join(process.cwd(), "scratch", filename);

    fs.writeFileSync(backupPath, JSON.stringify(users, null, 2));
    
    console.log(`\n========================================`);
    console.log(`🎉 Бэкап успешно создан!`);
    console.log(`👤 Сохранено пользователей: ${users.length}`);
    console.log(`📁 Файл: waitlist/scratch/${filename}`);
    console.log(`========================================\n`);

  } catch (error) {
    console.error("❌ Ошибка при создании бэкапа:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

backupUsers();
