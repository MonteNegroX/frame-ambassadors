import { NextRequest, NextResponse } from "next/server";
import { getInfluencersAction } from "@/lib/actions/influencers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    search: searchParams.get("search") || undefined,
    minCs: searchParams.get("minCs") ? Number(searchParams.get("minCs")) : undefined,
    maxCs: searchParams.get("maxCs") ? Number(searchParams.get("maxCs")) : undefined,
    minFollowers: searchParams.get("minFollowers") ? Number(searchParams.get("minFollowers")) : undefined,
    maxFollowers: searchParams.get("maxFollowers") ? Number(searchParams.get("maxFollowers")) : undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sortBy: (searchParams.get("sortBy") as any) || "sorsaScore",
    sortDir: (searchParams.get("sortDir") as any) || "desc",
    isPremium: searchParams.get("isPremium") === "true" ? true : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 24,
  };

  const result = await getInfluencersAction(filters);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result);
}
