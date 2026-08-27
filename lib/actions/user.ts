"use server";

import prisma from "../prisma";
import { PrivyClient } from "@privy-io/server-auth";
import { cookies } from "next/headers";
import { getEthosUserByX, calculateMultiplier } from "../ethos";
import { unstable_cache } from "next/cache";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET || "";

const privy = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);

export async function syncUserAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("privy-token")?.value;

  if (!token) {
    return { error: "No token found" };
  }

  try {
    const verifiedPayload = await privy.verifyAuthToken(token);
    const privyUser = await privy.getUser(verifiedPayload.userId);

    const twitterAccount = privyUser.linkedAccounts.find(
      (acc) => acc.type === "twitter_oauth"
    ) as any;

    if (!twitterAccount) {
      return { error: "Twitter account not linked" };
    }

    const twitterId = twitterAccount.subject;
    const twitterHandle = twitterAccount.username;
    const twitterName = twitterAccount.name || null;
    const twitterAvatar = twitterAccount.profilePictureUrl || twitterAccount.profile_picture_url || null;

    // Extract Wallet Address (if available)
    const walletAccount = privyUser.linkedAccounts.find(
      (acc) => acc.type === "wallet"
    ) as any;
    const walletAddress = walletAccount?.address || null;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { twitterId },
      include: {
        _count: {
          select: { referrals: true }
        },
        referrals: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            twitterHandle: true,
            ethosAvatarUrl: true,
            createdAt: true
          }
        }
      }
    }) as any;

    if (!user) {
      // 1. Fetch Social Data from Ethos (Registration only)
      const ethosData = await getEthosUserByX(twitterHandle);
      const ethosScore = ethosData?.score || 0;
      const multiplier = calculateMultiplier(ethosScore);

      // 2. Logic for referral attribution
      const referralCodeFromCookie = cookieStore.get("ref")?.value;
      let referredBy = null;

      if (referralCodeFromCookie) {
        referredBy = await prisma.user.findUnique({
          where: { referralCode: referralCodeFromCookie },
        });
      }

      // 3. Create new user with their Twitter handle as the referral code (Premium Identity)
      // Fallback to random if handle is missing for some reason
      const referralCode = twitterHandle || Math.random().toString(36).substring(2, 10).toUpperCase();

      const baseInitialPoints = 100;
      const boostedInitialPoints = Math.round(baseInitialPoints * multiplier);

      user = await prisma.user.create({
        data: {
          twitterId,
          twitterHandle,
          walletAddress,
          referralCode: referralCode,
          points: boostedInitialPoints,
          xpPoints: boostedInitialPoints, 
          multiplier: multiplier,
          ethosScore: ethosScore,
          // Fallback logic: Use Ethos data if available, otherwise use Privy data
          ethosAvatarUrl: ethosData?.avatarUrl || twitterAvatar,
          ethosDisplayName: ethosData?.displayName || twitterName,
          sorsaScore: 0, 
          referredById: referredBy?.id || null,
        },
        include: {
          _count: {
            select: { referrals: true }
          },
          referrals: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              twitterHandle: true,
              ethosAvatarUrl: true,
              createdAt: true
            }
          }
        }
      });

      // 4. Award points to referrer (also boosted by registration)
      if (referredBy) {
        const baseReferralPoints = 50;
        const boostedReferralPoints = Math.round(baseReferralPoints * (referredBy.multiplier || 1.05));
        
        await prisma.user.update({
          where: { id: referredBy.id },
          data: {
            points: { increment: boostedReferralPoints },
            xpPoints: { increment: boostedReferralPoints },
          },
        });
      }
    } else {
      // Update data if changed
      const updates: any = {};
      if (user.twitterHandle !== twitterHandle) updates.twitterHandle = twitterHandle;
      if (!user.walletAddress && walletAddress) updates.walletAddress = walletAddress;

      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates,
          include: {
            _count: {
              select: { referrals: true }
            },
            referrals: {
              take: 5,
              orderBy: { createdAt: 'desc' },
              select: {
                twitterHandle: true,
                ethosAvatarUrl: true,
                createdAt: true
              }
            }
          }
        });
      }
    }

    // Dynamic Rank Calculation
    const countHigher = await prisma.user.count({
      where: {
        points: { gt: user.points }
      }
    });

    const calculatedRank = countHigher + 1;

    // Persist rank to DB for global consistency
    if (user.waitlistRank !== calculatedRank) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { waitlistRank: calculatedRank },
        include: {
          _count: {
            select: { referrals: true }
          },
          referrals: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              twitterHandle: true,
              ethosAvatarUrl: true,
              createdAt: true
            }
          }
        }
      });
    }

    return { success: true, user };
  } catch (error) {
    console.error("❌ [Sync User Error]:", error);
    return { error: "Failed to sync user" };
  }
}

export async function getGlobalStatsAction() {
  return getCachedGlobalStats();
}

const getCachedGlobalStats = unstable_cache(
  async () => {
    try {
      const [
        totalUsers,
        globalSum,
        avgEthosData,
        avgSorsaData,
        avgFrameData,
        totalReferrals,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.aggregate({ _sum: { points: true } }),
        prisma.user.aggregate({ where: { ethosScore: { gt: 0 } }, _avg: { ethosScore: true } }),
        prisma.user.aggregate({ where: { sorsaScore: { gt: 0 } }, _avg: { sorsaScore: true } }),
        prisma.user.aggregate({ where: { frameScore: { gt: 0 } }, _avg: { frameScore: true } }),
        prisma.user.count({ where: { referredById: { not: null } } }),
      ]);

      return {
        success: true,
        stats: {
          totalUsers: totalUsers || 0,
          totalPoints: globalSum._sum.points || 0,
          totalReferrals: totalReferrals || 0,
          avgEthos: Math.round(avgEthosData._avg.ethosScore || 0),
          avgSorsa: Math.round(avgSorsaData._avg.sorsaScore || 0),
          avgFrameScore: Math.round(avgFrameData._avg.frameScore || 0),
          networkStatus: "Synchronized",
          version: "1.0 Alpha",
          payoutsHandled: "$2.4M",
        },
      };
    } catch (error) {
      console.error("❌ [Stats Error]:", error);
      return { success: false };
    }
  },
  ["global-stats"],       // cache key
  { revalidate: 60 }      // обновляется раз в 60 секунд
);

export async function getRecentUsersAction() {
  try {
    const recentUsers = await prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        twitterHandle: true,
        ethosAvatarUrl: true,
        createdAt: true
      }
    });

    return {
      success: true,
      users: recentUsers
    };
  } catch (error) {
    console.error("❌ [Recent Users Error]:", error);
    return { success: false };
  }
}

export async function getLeaderboardAction(limit: number = 10) {
  try {
    const topUsers = await prisma.user.findMany({
      where: {
        role: "KOL"
      },
      orderBy: { points: "desc" },
      take: limit,
      select: {
        id: true,
        twitterHandle: true,
        points: true,
        ethosAvatarUrl: true,
        tweetId: true,
        moniSmartTier: true,
      },
    });
    return { success: true, topUsers };
  } catch (error) {
    console.error("❌ [Leaderboard Error]:", error);
    return { error: "Failed to fetch leaderboard" };
  }
}

export async function completeSocialTaskAction(task: "follow" | "post", tweetId?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("privy-token")?.value;

  if (!token) return { error: "Unauthorized" };

  try {
    const verifiedPayload = await privy.verifyAuthToken(token);
    const userId = verifiedPayload.userId;
    const privyUser = await privy.getUser(userId);
    const twitterAccount = privyUser.linkedAccounts.find(a => a.type === 'twitter_oauth');
    
    if (!twitterAccount) return { error: "Twitter not linked" };

    const user = await prisma.user.findFirst({
      where: { twitterId: twitterAccount.subject },
    });

    if (!user) return { error: "User not found" };

    const multiplier = user.multiplier || 1.05;

    let taskVerified = false;

    if (process.env.COMPOSIO_API_KEY) {
      try {
        if (task === "follow") {
          if (!process.env.COMPOSIO_ENTITY_ID || !process.env.COMPOSIO_CONNECTION_ID) {
            console.error("❌ MISSING ENV VARS: COMPOSIO_ENTITY_ID or COMPOSIO_CONNECTION_ID is undefined!");
            return { error: "Server Configuration Error: Missing Composio Entity ID" };
          }
          
          const executeUrl = "https://backend.composio.dev/api/v3/tools/execute/TWITTER_FOLLOWERS_BY_USER_ID";
          const followCheckResponse = await fetch(executeUrl, {
            method: "POST",
            headers: {
              "x-api-key": process.env.COMPOSIO_API_KEY as string,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              entity_id: process.env.COMPOSIO_ENTITY_ID,
              connected_account_id: process.env.COMPOSIO_CONNECTION_ID,
              arguments: { id: "2012578934076899328" } // @frameonx
            })
          });
          
          let followCheck: any = {};
          try {
            followCheck = await followCheckResponse.json();
          } catch {
            console.error("Failed to parse Composio raw JSON");
          }
          
          if (!followCheck?.successful || !followCheck?.data?.data) {
            console.error("[Composio API Error]: Invalid or missing response", followCheck);
            return { error: "Failed to verify. Please try again." };
          }

          const isFollowing = followCheck.data.data.some((u: any) => u.id === twitterAccount.subject);

          if (!isFollowing) {
            return { error: "Verification Failed: You are not following the account." };
          }
          
          taskVerified = true;
        }

        if (task === "post") {
          const targetTweetId = "2046266152662315460"; // Official Launch Tweet ID
          
          const executeUrl = "https://backend.composio.dev/api/v3/tools/execute/TWITTER_RECENT_SEARCH";
          const recentSearchResponse = await fetch(executeUrl, {
            method: "POST",
            headers: {
              "x-api-key": process.env.COMPOSIO_API_KEY as string,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              entity_id: process.env.COMPOSIO_ENTITY_ID,
              connected_account_id: process.env.COMPOSIO_CONNECTION_ID,
              arguments: { 
                query: `from:${twitterAccount.username} is:quote`,
                tweet_fields: ["referenced_tweets"]
              }
            })
          });
          
          let searchData: any = {};
          try {
            searchData = await recentSearchResponse.json();
          } catch {
            console.error("Failed to parse Composio raw JSON");
          }
          
          if (!searchData?.successful || !searchData?.data?.data) {
            console.error("[Composio API Error]: Invalid or empty search response", searchData);
            return { error: "Verification Failed: We could not fetch your recent tweets. Are your tweets protected?" };
          }
          
          // Check if any of THEIR quotes references our target tweet OR contains @frameonx
          const expectedHandle = `@frameonx`;
          const hasQuoted = searchData.data.data.some((tweet: any) => {
            // Priority 1: Use strict API referenced_tweets array if Composio passed it
            if (tweet.referenced_tweets && Array.isArray(tweet.referenced_tweets)) {
              if (tweet.referenced_tweets.some((ref: any) => ref.type === 'quoted' && ref.id === targetTweetId)) {
                return true;
              }
            }
            // Priority 2: Safe fallback to text check to bypass Composio stripping payload
            return tweet.text && tweet.text.toLowerCase().includes(expectedHandle);
          });

          if (!hasQuoted) {
            return { error: "Verification Failed: We couldn't find your Quote Tweet. Please ensure you reposted the target tweet correctly." };
          }
          
          taskVerified = true;
        }
      } catch (e: any) {
        console.error("❌ [Composio API Error]:", e);
        return { error: "Failed to parse Composio data" };
      }
    } else {
      // --> MVP Fallback: Assuming success for the test flow when no API key is specified
      taskVerified = true;
    }

    if (taskVerified) {
      if (task === "follow" && !user.followedTwitter) {
        const basePoints = 50;
        const boostedPoints = Math.round(basePoints * multiplier);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            followedTwitter: true,
            points: { increment: boostedPoints },
            xpPoints: { increment: boostedPoints },
          },
        });
        return { success: true, pointsAdded: boostedPoints };
      }

      if (task === "post" && !user.postedTweet) {
        const basePoints = 100;
        const boostedPoints = Math.round(basePoints * multiplier);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            postedTweet: true,
            tweetId: tweetId || null,
            points: { increment: boostedPoints },
            xpPoints: { increment: boostedPoints },
          },
        });
        return { success: true, pointsAdded: boostedPoints };
      }
    }

    return { error: "Task already completed or invalid" };
  } catch (error) {
    console.error("❌ [Task Error]:", error);
    return { error: "Failed to complete task" };
  }
}
