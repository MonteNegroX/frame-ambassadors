import { NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET || "";

const privy = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("privy-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    // Verify token
    const verifiedPayload = await privy.verifyAuthToken(token);
    const privyUser = await privy.getUser(verifiedPayload.userId);

    // Get Twitter account details
    const twitterAccount = privyUser.linkedAccounts.find(
      (acc) => acc.type === "twitter_oauth"
    ) as any;

    if (!twitterAccount || !twitterAccount.subject) {
      return NextResponse.json(
        { error: "No Twitter account linked" },
        { status: 400 }
      );
    }

    const twitterId = twitterAccount.subject;
    const twitterHandle = twitterAccount.username; // usually provided by Privy

    // Get Wallet Address if available
    const walletAccount = privyUser.linkedAccounts.find(
      (acc) => acc.type === "wallet"
    ) as any;
    const walletAddress = walletAccount?.address;

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { twitterId },
      update: {
        twitterHandle: twitterHandle || undefined,
        walletAddress: walletAddress || undefined,
      },
      create: {
        twitterId,
        twitterHandle: twitterHandle || null,
        walletAddress: walletAddress || null,
        role: "KOL", // Default role
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("❌ [Sync API Error]:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}
