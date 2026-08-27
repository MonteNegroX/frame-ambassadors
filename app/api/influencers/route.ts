import { NextRequest, NextResponse } from "next/server";
import { getInfluencersAction } from "@/lib/actions/influencers";

function parseNum(val: string | null): number | undefined {
  if (!val || val.trim() === "") return undefined;
  const num = Number(val);
  return isNaN(num) || num <= 0 ? undefined : num;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    search: searchParams.get("search") || undefined,
    minCs: parseNum(searchParams.get("minCs")),
    maxCs: parseNum(searchParams.get("maxCs")),
    minFollowers: parseNum(searchParams.get("minFollowers")),
    maxFollowers: parseNum(searchParams.get("maxFollowers")),
    minPrice: parseNum(searchParams.get("minPrice")),
    maxPrice: parseNum(searchParams.get("maxPrice")),
    sortBy: (searchParams.get("sortBy") as any) || "sorsaScore",
    sortDir: (searchParams.get("sortDir") as any) || "desc",
    isPremium: searchParams.get("isPremium") === "true" ? true : undefined,
    page: parseNum(searchParams.get("page")) || 1,
    limit: parseNum(searchParams.get("limit")) || 24,
  };

  const result = await getInfluencersAction(filters);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result);
}
