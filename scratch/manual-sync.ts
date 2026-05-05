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

async function syncUser(privyUserId: string) {
  try {
    console.log(`\n🔍 Ищем пользователя ${privyUserId} в Privy...`);
    const privyUser = await privy.getUser(privyUserId);

    const twitterAccount = privyUser.linkedAccounts.find(
      (acc) => acc.type === "twitter_oauth"
    ) as any;

    if (!twitterAccount) {
      console.error("❌ У этого пользователя нет привязанного Twitter-аккаунта.");
      return;
    }

    const twitterId = twitterAccount.subject;
    const twitterHandle = twitterAccount.username;
    
    const walletAccount = privyUser.linkedAccounts.find(
      (acc) => acc.type === "wallet"
    ) as any;
    const walletAddress = walletAccount?.address || null;

    console.log(`✅ Найден Twitter: @${twitterHandle} (ID: ${twitterId})`);

    const existingUser = await prisma.user.findUnique({
      where: { twitterId },
    });

    if (existingUser) {
      console.log(`⚠️ Пользователь @${twitterHandle} УЖЕ ЕСТЬ в Supabase! Пропускаю...`);
      return;
    }

    console.log(`⏳ Добавляю @${twitterHandle} в Supabase...`);
    
    const referralCode = twitterHandle || Math.random().toString(36).substring(2, 10).toUpperCase();

    const newUser = await prisma.user.create({
      data: {
        twitterId,
        twitterHandle,
        walletAddress,
        referralCode,
        points: 100, // базовые очки
        xpPoints: 100,
        multiplier: 1.05,
        ethosScore: 0,
        sorsaScore: 0,
        role: "KOL",
      },
    });

    console.log(`🎉 УСПЕШНО! Пользователь добавлен в БД с ID: ${newUser.id}`);

  } catch (error) {
    console.error("❌ Ошибка:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Использование: npx tsx manual-sync.ts <privy_user_id>");
  console.log("Пример: npx tsx manual-sync.ts did:privy:cly123456789...");
  process.exit(1);
}

syncUser(args[0]);
