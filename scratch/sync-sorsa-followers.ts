import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in environment.");
  process.exit(1);
}

const sorsaApiKey = process.env.SORSA_API_KEY;
if (!sorsaApiKey) {
  console.error("❌ SORSA_API_KEY is not set in environment.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fetchSorsaBatch(handles: string[]) {
  console.log(`📡 Requesting Sorsa v3 API (/info-batch) for ${handles.length} handles...`);
  try {
    const params = new URLSearchParams();
    handles.forEach((h) => params.append("usernames", h));

    const url = `https://api.sorsa.io/v3/info-batch?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "ApiKey": sorsaApiKey,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ Sorsa API error [${response.status}]:`, errText);
      return [];
    }

    const data = await response.json();
    return data.users || [];
  } catch (err) {
    console.error("❌ Sorsa API fetch error:", err);
    return [];
  }
}

async function main() {
  try {
    console.log("🔍 Fetching Top 100 users by frameScore from Supabase...");

    const topUsers = await prisma.user.findMany({
      where: {
        twitterHandle: { not: null },
      },
      orderBy: [
        { frameScore: { sort: "desc", nulls: "last" } },
        { points: "desc" },
      ],
      take: 100,
      select: {
        id: true,
        twitterHandle: true,
        frameScore: true,
        followers: true,
      },
    });

    console.log(`✅ Found ${topUsers.length} users in database.`);

    if (topUsers.length === 0) {
      console.log("No users found.");
      return;
    }

    const handleToUserMap = new Map<string, typeof topUsers[0]>();
    const handlesList: string[] = [];

    topUsers.forEach((u) => {
      if (u.twitterHandle) {
        const clean = u.twitterHandle.replace(/^@/, "").trim().toLowerCase();
        handleToUserMap.set(clean, u);
        handlesList.push(clean);
      }
    });

    console.log(`📋 Total handles to sync: ${handlesList.length}`);

    // Process in batches of 50 (Sorsa API supports up to 100 per request)
    const BATCH_SIZE = 50;
    let updatedCount = 0;

    for (let i = 0; i < handlesList.length; i += BATCH_SIZE) {
      const batchHandles = handlesList.slice(i, i + BATCH_SIZE);
      const usersData = await fetchSorsaBatch(batchHandles);

      console.log(`📦 Received data for ${usersData.length} users in batch ${Math.floor(i / BATCH_SIZE) + 1}`);

      for (const item of usersData) {
        const itemHandle = (item.username || "").toLowerCase();
        const followersCount = item.followers_count;

        if (itemHandle && handleToUserMap.has(itemHandle)) {
          const userObj = handleToUserMap.get(itemHandle)!;

          if (typeof followersCount === "number" && followersCount >= 0) {
            await prisma.user.update({
              where: { id: userObj.id },
              data: { followers: Math.floor(followersCount) },
            });
            console.log(
              `  ✅ Updated @${itemHandle}: followers = ${followersCount.toLocaleString()} (FrameScore: ${userObj.frameScore})`
            );
            updatedCount++;
          }
        }
      }
    }

    console.log("\n========================================");
    console.log(`🎉 Sync Completed! Successfully updated ${updatedCount} / ${topUsers.length} users in Supabase.`);
    console.log("========================================\n");
  } catch (error) {
    console.error("❌ Error running sync script:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
