import { PrivyClient } from "@privy-io/server-auth";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

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

async function findMissingUsers() {
  try {
    console.log("🔍 Получаю всех пользователей из базы данных (Supabase)...");
    const dbUsers = await prisma.user.findMany({
      select: { twitterId: true },
    });
    
    // Создаем Set для быстрого поиска
    const dbTwitterIds = new Set(dbUsers.map(u => u.twitterId).filter(Boolean));
    console.log(`✅ Найдено пользователей в БД: ${dbTwitterIds.size}`);

    console.log("🔍 Получаю всех пользователей из Privy...");
    const privyUsers = await privy.getUsers();
    console.log(`✅ Найдено пользователей в Privy: ${privyUsers.length}`);

    const missingUsers = [];

    for (const privyUser of privyUsers) {
      const twitterAccount = privyUser.linkedAccounts.find(
        (acc) => acc.type === "twitter_oauth"
      ) as any;

      if (!twitterAccount) {
        // У пользователя нет твиттера, пропускаем
        continue;
      }

      const twitterId = twitterAccount.subject;
      
      if (!dbTwitterIds.has(twitterId)) {
        missingUsers.push({
          privyId: privyUser.id,
          twitterHandle: twitterAccount.username,
          twitterId: twitterId
        });
      }
    }

    console.log("\n========================================");
    if (missingUsers.length === 0) {
      console.log("🎉 Все пользователи Privy синхронизированы с Supabase!");
    } else {
      console.log(`⚠️ Найдено потерянных пользователей: ${missingUsers.length}`);
      
      const fs = require('fs');
      const outputPath = './scratch/missing-users.json';
      fs.writeFileSync(outputPath, JSON.stringify(missingUsers, null, 2));
      
      console.log(`✅ Список успешно сохранен в файл: ${outputPath}`);
      
      console.log("Превью первых 5:");
      missingUsers.slice(0, 5).forEach((u, i) => {
        console.log(`${i + 1}. Twitter: @${u.twitterHandle} | Privy ID: ${u.privyId}`);
      });
    }
    console.log("========================================\n");

  } catch (error) {
    console.error("❌ Ошибка:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

findMissingUsers();
