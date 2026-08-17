import type { Metadata } from "next";
import { NewsTerminal } from "@/components/news-terminal";
import { getNewsPage } from "@/lib/news";

export const revalidate = 60;
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default async function Home() { const page = await getNewsPage(); return <NewsTerminal initialStories={page.stories} initialCursor={page.nextCursor} />; }
