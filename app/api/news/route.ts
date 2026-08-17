import { NextRequest, NextResponse } from "next/server";
import { getNewsPage } from "@/lib/news";

export const revalidate = 60;
export async function GET(request: NextRequest) {
  const rawCursor = request.nextUrl.searchParams.get("cursor") || "l:0";
  const cursor = /^(?:l:\d+|h:\d+:\d+)$/.test(rawCursor) ? rawCursor : "l:0";
  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") || 20);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(Math.trunc(requestedLimit), 5), 30) : 20;
  const category = request.nextUrl.searchParams.get("category") || undefined;
  const sector = request.nextUrl.searchParams.get("sector") || undefined;
  const page = await getNewsPage(cursor, limit, { category, sector });
  return NextResponse.json({ ...page, live: true, updatedAt: new Date().toISOString() }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}