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
    console.log("📊 Fetching referral statistics...");

    const usersWithReferrals = await prisma.user.findMany({
      where: {
        referrals: {
          some: {}
        }
      },
      select: {
        twitterHandle: true,
        twitterId: true,
        referralCode: true,
        _count: {
          select: {
            referrals: true
          }
        }
      },
      orderBy: {
        referrals: {
          _count: 'desc'
        }
      }
    });

    console.log("\n========================================");
    console.log("🏆 REFERRAL LEADERBOARD");
    console.log("========================================\n");
    
    console.log("Rank | Handle | Referrals | Code");
    console.log("----------------------------------------");

    usersWithReferrals.forEach((user, index) => {
      const handle = user.twitterHandle || "Unknown";
      const count = user._count.referrals;
      const code = user.referralCode || "N/A";
      console.log(`${(index + 1).toString().padEnd(4)} | @${handle.padEnd(15)} | ${count.toString().padEnd(9)} | ${code}`);
    });

    console.log("\n========================================");
    console.log(`✅ Total users with referrals: ${usersWithReferrals.length}`);
    console.log("========================================\n");

  } catch (error) {
    console.error("❌ Error fetching stats:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
