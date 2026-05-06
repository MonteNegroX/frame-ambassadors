import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("🔍 Fetching Sorsa Score statistics...");

    const topSorsaUsers = await prisma.user.findMany({
      where: {
        sorsaScore: {
          not: null,
          gt: 0 // Берем только тех, у кого скор больше 0
        }
      },
      select: {
        twitterHandle: true,
        sorsaScore: true,
        ethosScore: true,
        referralCode: true,
        _count: {
          select: {
            referrals: true
          }
        }
      },
      orderBy: {
        sorsaScore: 'desc'
      },
      take: 50 // Берем топ-50
    });

    console.log("\n========================================");
    console.log("🔥 TOP 50 BY SORSA SCORE");
    console.log("========================================\n");
    
    console.log("Rank | Handle | Sorsa | Ethos | Refs");
    console.log("----------------------------------------");

    topSorsaUsers.forEach((user, index) => {
      const handle = user.twitterHandle || "Unknown";
      const sorsa = user.sorsaScore || 0;
      const ethos = user.ethosScore || 0;
      const refs = user._count.referrals;
      
      console.log(`${(index + 1).toString().padEnd(4)} | @${handle.padEnd(15)} | ${sorsa.toString().padEnd(5)} | ${ethos.toString().padEnd(5)} | ${refs}`);
    });

    console.log("\n========================================");
    console.log(`✅ Total users with Sorsa Score > 0: ${topSorsaUsers.length}`);
    console.log("========================================\n");

  } catch (error) {
    console.error("❌ Error fetching stats:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
