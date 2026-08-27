"use server";

import prisma from "../prisma";

export interface InfluencerFilters {
  search?: string;
  minCs?: number;
  maxCs?: number;
  minFollowers?: number;
  maxFollowers?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "sorsaScore" | "followers" | "points" | "createdAt";
  sortDir?: "asc" | "desc";
  isPremium?: boolean; // moniSmartTier <= 3 and not null
  page?: number;
  limit?: number;
}

/**
 * Calculates estimated prices based on follower count and sorsa score
 * when no manual prices are stored in the DB.
 */
function calcEstimatedPrices(
  followers: number | null,
  sorsaScore: number | null
) {
  const f = followers ?? 0;
  const s = sorsaScore ?? 0;

  // Base: $5 minimum, scaling with followers (per 1k = $2) and CS bonus
  const base = 5 + (f / 1000) * 2 + s * 0.05;

  return {
    pricePromoTweet: parseFloat((base * 4).toFixed(2)),
    priceLikeRt: parseFloat((base * 0.8).toFixed(2)),
    priceFollow: parseFloat((base * 0.8).toFixed(2)),
    priceComment: parseFloat((base * 0.8).toFixed(2)),
  };
}

export async function getInfluencersAction(filters: InfluencerFilters = {}) {
  const {
    search,
    minCs,
    maxCs,
    minFollowers,
    maxFollowers,
    sortBy = "sorsaScore",
    sortDir = "desc",
    isPremium,
    page = 1,
    limit = 24,
  } = filters;

  const skip = (page - 1) * limit;

  try {
    // Build where clause for User — match all users with registered twitter handle
    const userWhere: any = {
      twitterHandle: { not: null },
    };

    if (search) {
      userWhere.twitterHandle = {
        contains: search.replace("@", "").trim(),
        mode: "insensitive",
      };
    }

    // CS = sorsaScore on User level
    if (minCs !== undefined && !isNaN(minCs)) {
      userWhere.sorsaScore = { ...(userWhere.sorsaScore || {}), gte: minCs };
    }
    if (maxCs !== undefined && !isNaN(maxCs)) {
      userWhere.sorsaScore = { ...(userWhere.sorsaScore || {}), lte: maxCs };
    }

    if (isPremium) {
      userWhere.moniSmartTier = { not: null, lte: 3 };
    }

    // Follower filter — check moniSmartFollowers on User level or kolProfile
    if (minFollowers !== undefined && !isNaN(minFollowers)) {
      userWhere.OR = [
        { moniSmartFollowers: { gte: minFollowers } },
        { kolProfile: { followerCount: { gte: minFollowers } } },
      ];
    }
    if (maxFollowers !== undefined && !isNaN(maxFollowers)) {
      userWhere.AND = [
        ...(userWhere.AND || []),
        {
          OR: [
            { moniSmartFollowers: { lte: maxFollowers } },
            { kolProfile: { followerCount: { lte: maxFollowers } } },
          ],
        },
      ];
    }

    // Build orderBy (use moniSmartFollowers for followers sort)
    const orderByMap: Record<string, any> = {
      sorsaScore: [{ sorsaScore: sortDir }, { points: sortDir }],
      points: { points: sortDir },
      createdAt: { createdAt: sortDir },
      followers: [{ moniSmartFollowers: sortDir }, { points: sortDir }],
    };
    const orderBy = orderByMap[sortBy] ?? [{ sorsaScore: "desc" }, { points: "desc" }];

    const [total, users] = await Promise.all([
      prisma.user.count({ where: userWhere }),
      prisma.user.findMany({
        where: userWhere,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          twitterHandle: true,
          ethosAvatarUrl: true,
          ethosDisplayName: true,
          sorsaScore: true,
          frameScore: true,
          moniSmartTier: true,
          moniSmartFollowers: true,
          points: true,
          waitlistRank: true,
          kolProfile: {
            select: {
              followerCount: true,
              niches: true,
              avgEngagementRate: true,
              socialScore: true,
              scoutScore: true,
              pricePromoTweet: true,
              priceLikeRt: true,
              priceFollow: true,
              priceComment: true,
            },
          },
        },
      }),
    ]);

    // Enrich with computed prices where manual prices are absent
    const influencers = users.map((u) => {
      const kol = u.kolProfile;
      const followers = kol?.followerCount ?? u.moniSmartFollowers ?? null;
      const cs = u.sorsaScore ?? 0;

      const estimated = calcEstimatedPrices(followers, cs);

      return {
        id: u.id,
        twitterHandle: u.twitterHandle,
        displayName: u.ethosDisplayName,
        avatarUrl: u.ethosAvatarUrl,
        csScore: cs,
        frameScore: u.frameScore ?? 0,
        followerCount: followers ?? 0,
        moniSmartTier: u.moniSmartTier,
        niches: kol?.niches ?? [],
        engagementRate: kol?.avgEngagementRate ?? null,
        isPremium: u.moniSmartTier !== null && u.moniSmartTier <= 3,
        prices: {
          promoTweet: kol?.pricePromoTweet ?? estimated.pricePromoTweet,
          likeRt: kol?.priceLikeRt ?? estimated.priceLikeRt,
          follow: kol?.priceFollow ?? estimated.priceFollow,
          comment: kol?.priceComment ?? estimated.priceComment,
          isEstimated:
            !kol?.pricePromoTweet &&
            !kol?.priceLikeRt &&
            !kol?.priceFollow &&
            !kol?.priceComment,
        },
      };
    });

    return {
      success: true,
      influencers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("❌ [Influencers Action Error]:", error);
    return { success: false, error: "Failed to fetch influencers" };
  }
}
