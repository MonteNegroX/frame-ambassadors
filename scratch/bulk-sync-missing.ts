import { PrivyClient } from "@privy-io/server-auth";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Загружаем переменные окружения
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET || "";
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!PRIVY_APP_ID || !PRIVY_APP_SECRET || !DATABASE_URL) {
  console.error("❌ Отсутствуют необходимые переменные окружения (.env)");
  process.exit(1);
}

const privy = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);
const pool = new pg.Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function bulkSync() {
  try {
    const missingUsersPath = path.join(process.cwd(), "scratch/missing-users.json");
    
    if (!fs.existsSync(missingUsersPath)) {
      console.error("❌ Файл scratch/missing-users.json не найден. Сначала запусти find-missing-users.ts");
      return;
    }

    const missingUsers = JSON.parse(fs.readFileSync(missingUsersPath, "utf-8"));
    console.log(`🚀 Начинаю массовую загрузку ${missingUsers.length} пользователей...`);

    let successCount = 0;
    let failCount = 0;

    for (const user of missingUsers) {
      try {
        console.log(`⏳ Синхронизация @${user.twitterHandle}...`);
        
        // Получаем полные данные из Privy для кошелька
        const privyUser = await privy.getUser(user.privyId);
        const walletAccount = privyUser.linkedAccounts.find(
          (acc) => acc.type === "wallet"
        ) as any;
        const walletAddress = walletAccount?.address || null;

        await prisma.user.create({
          data: {
            twitterId: user.twitterId,
            twitterHandle: user.twitterHandle,
            walletAddress: walletAddress,
            referralCode: user.twitterHandle || Math.random().toString(36).substring(2, 10).toUpperCase(),
            points: 100,
            xpPoints: 100,
            multiplier: 1.05,
            role: "KOL",
          },
        });
        
        console.log(`✅ @${user.twitterHandle} добавлен.`);
        successCount++;
      } catch (err: any) {
        if (err.code === 'P2002') {
          console.log(`⚠️ @${user.twitterHandle} уже есть в базе (дубликат).`);
        } else {
          console.error(`❌ Ошибка при добавлении @${user.twitterHandle}:`, err.message);
          failCount++;
        }
      }
    }

    console.log(`\n========================================`);
    console.log(`🎉 Завершено! Успешно добавлено: ${successCount}`);
    console.log(`⚠️ Ошибок/Дубликатов: ${failCount}`);
    console.log(`========================================\n`);

  } catch (error) {
    console.error("❌ Критическая ошибка:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

bulkSync();
