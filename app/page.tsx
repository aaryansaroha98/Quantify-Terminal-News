import type { Metadata } from "next";
import { NewsTerminal } from "@/components/news-terminal";
import { getNewsPage } from "@/lib/news";

export const revalidate = 15;
export const dynamic = "force-dynamic";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default async function Home() { const page = await getNewsPage(); return <NewsTerminal initialStories={page.stories} initialCursor={page.nextCursor} />; }
