import { NextRequest, NextResponse } from "next/server";
import { getNewsPage } from "@/lib/news";

export const revalidate = 15;
export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get("cursor") || "l:0";
  const limit = Number(request.nextUrl.searchParams.get("limit") || 20);
  const category = request.nextUrl.searchParams.get("category") || undefined;
  const sector = request.nextUrl.searchParams.get("sector") || undefined;
  const page = await getNewsPage(cursor, limit, { category, sector });
  return NextResponse.json({ ...page, live: true, updatedAt: new Date().toISOString(), sources: ["Economic Times", "CNBC", "CoinDesk", "GDELT"] }, { headers: { "Cache-Control": "s-maxage=15, stale-while-revalidate=30" } });
}