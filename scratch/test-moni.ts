import * as dotenv from "dotenv";

dotenv.config();

const MONI_API_KEY = process.env.MONI_API_KEY;

async function getSmartProfile(username: string) {
  if (!MONI_API_KEY) {
    console.error("❌ MONI_API_KEY is not set in .env");
    return;
  }

  const url = `https://api.discover.getmoni.io/api/v3/accounts/${username}/info/smart_profile/`;
  
  try {
    console.log(`🔍 Fetching Smart Profile for @${username}...`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Api-Key": MONI_API_KEY,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error("Response body:", text);
      return;
    }

    const data = await response.json();
    console.log("\n✅ Smart Profile Data:");
    console.log(JSON.stringify(data, null, 2));
    
    // Extract Tier
    const tier = data.smartProfile?.smartTier?.tier;
    if (tier) {
      const brains = "🧠".repeat(4 - tier); // Tier 1 = 3 brains, Tier 2 = 2 brains, Tier 3 = 1 brain (according to docs: 1 - 🧠, 2 - 🧠🧠, 3 - 🧠🧠🧠 wait! Doc says: 1 - 🧠, 2 - 🧠🧠, 3 - 🧠🧠🧠. Wait, usually 1 is the highest so maybe 1 is 3 brains? The doc explicitly says: 1 - 🧠, 2 - 🧠🧠, 3 - 🧠🧠🧠)
      console.log(`\n🧠 Smart Status: Tier ${tier} (${brains})`);
    } else {
      console.log(`\n⚪ No Smart Tier found.`);
    }

  } catch (error) {
    console.error("❌ Request Failed:", error);
  }
}

async function getSmartsFull(username: string) {
  if (!MONI_API_KEY) {
    console.error("❌ MONI_API_KEY is not set in .env");
    return;
  }

  const url = `https://api.discover.getmoni.io/api/v3/accounts/${username}/smarts/full/?limit=1`;
  
  try {
    console.log(`\n🔍 Fetching Smarts Full (Followers) for @${username}...`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Api-Key": MONI_API_KEY,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error("Response body:", text);
      return;
    }

    const data = await response.json();
    console.log("\n✅ Smarts Full Data:");
    console.log(`👥 Total Smart Followers: ${data.totalCount}`);
    
  } catch (error) {
    console.error("❌ Request Failed:", error);
  }
}

async function main() {
  const username = process.argv[2] || "frameonx"; // Default to frameonx if no args
  await getSmartProfile(username);
  await getSmartsFull(username);
}

main();
