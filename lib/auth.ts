import { PrivyClient } from "@privy-io/server-auth"
import { cookies } from "next/headers"
import prisma from "./prisma"

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET || ""

export interface Session {
  user: {
    id: string
    twitterHandle?: string
    walletAddress?: string
    points: number
    referralCode?: string
    followedTwitter: boolean
    postedTweet: boolean
  }
}

const privy = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET)

export async function auth(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("privy-token")?.value

  if (!token) return null

  try {
    const verifiedPayload = await privy.verifyAuthToken(token)
    const privyUser = await privy.getUser(verifiedPayload.userId)

    const twitterAccount = privyUser.linkedAccounts.find(
      (acc) => acc.type === "twitter_oauth"
    ) as any
    
    const twitterId = twitterAccount?.subject;

    if (!twitterId) return null;

    const user = await prisma.user.findUnique({
      where: { twitterId },
    })

    if (!user) return null

    return {
      user: {
        id: user.id,
        twitterHandle: user.twitterHandle || undefined,
        walletAddress: user.walletAddress || undefined,
        points: user.points,
        referralCode: user.referralCode || undefined,
        followedTwitter: user.followedTwitter,
        postedTweet: user.postedTweet,
      },
    }
  } catch (error) {
    console.error("❌ [Auth Error]:", error);
    return null
  }
}
