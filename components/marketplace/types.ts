// Shared types for the Influencer Marketplace

export interface InfluencerData {
  id: string;
  twitterHandle: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  csScore: number;
  followerCount: number;
  moniSmartTier: number | null;
  isPremium: boolean;
  niches: string[];
  prices: {
    promoTweet: number;
    likeRt: number;
    follow: number;
    comment: number;
    isEstimated: boolean;
  };
}
