/**
 * Ethos API Helper for Social Scoring
 */

export interface EthosUser {
  id: number;
  profileId: number;
  displayName: string;
  username: string;
  avatarUrl: string;
  score: number;
  status: string;
}

export async function getEthosUserByX(username: string): Promise<EthosUser | null> {
  if (!username) return null;

  try {
    const response = await fetch('https://api.ethos.network/api/v2/users/by/x', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountIdsOrUsernames: [username],
      }),
    });

    if (!response.ok) {
      console.error(`❌ [Ethos API Error]: Status ${response.status}`);
      return null;
    }

    const data = await response.json();

    // The API returns an array, we take the first matching user
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as EthosUser;
    }

    return null;
  } catch (error) {
    console.error("❌ [Ethos Fetch Error]:", error);
    return null;
  }
}

/**
 * Calculates the multiplier based on the Ethos score.
 * Formula: score / 1000
 * Fallback: 1.05
 */
export function calculateMultiplier(score: number | null | undefined): number {
  if (!score || score <= 0) return 1.05;
  const multiplier = score / 1000;
  return Math.max(multiplier, 1.05);
}
