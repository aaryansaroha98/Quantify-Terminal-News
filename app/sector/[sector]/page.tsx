import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsTerminal } from "@/components/news-terminal";
import { getNewsPage } from "@/lib/news";

export const dynamic = "force-dynamic";
const sectors: Record<string, string> = { technology: "Technology", financials: "Financials", energy: "Energy", healthcare: "Healthcare", automotive: "Automotive", consumer: "Consumer", industrials: "Industrials", "real-estate": "Real Estate", media: "Media", telecom: "Telecom" };
export async function generateMetadata({ params }: { params: Promise<{ sector: string }> }): Promise<Metadata> { const { sector } = await params; const label = sectors[sector]; return label ? { title: `${label} Sector News — Quantify Terminal`, description: `Live ${label.toLowerCase()} sector news from attributed publishers.` } : {}; }
export default async function SectorPage({ params }: { params: Promise<{ sector: string }> }) { const { sector } = await params; const label = sectors[sector]; if (!label) notFound(); const page = await getNewsPage("l:0", 20, { sector: label }); return <NewsTerminal initialStories={page.stories} initialCursor={page.nextCursor} initialSector={label} />; }