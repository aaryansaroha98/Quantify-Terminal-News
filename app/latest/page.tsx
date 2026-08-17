import type { Metadata } from "next";
import { NewsTerminal } from "@/components/news-terminal";
import { getNewsPage } from "@/lib/news";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Latest Financial News", description: "The latest live financial and market news, updated continuously.", alternates: { canonical: "/latest" } };
export default async function LatestPage() { const page = await getNewsPage(); return <NewsTerminal initialStories={page.stories} initialCursor={page.nextCursor} />; }
