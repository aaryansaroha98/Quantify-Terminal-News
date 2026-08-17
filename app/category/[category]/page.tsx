import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsTerminal } from "@/components/news-terminal";
import { getNewsPage } from "@/lib/news";

export const dynamic = "force-dynamic";
const categories: Record<string, string> = { markets: "Markets", stocks: "Stocks", india: "India", "us-markets": "US Markets", "global-markets": "Global Markets", economy: "Economy", companies: "Companies", crypto: "Crypto", commodities: "Commodities", technology: "Technology", geopolitics: "Geopolitics", earnings: "Earnings", ipo: "IPO", "m-and-a": "M&A", "central-banks": "Central Banks" };
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> { const { category } = await params; const label = categories[category]; return label ? { title: `${label} News — Quantify Terminal`, description: `Live, attributed ${label.toLowerCase()} news from established publishers.` } : {}; }
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; const label = categories[category]; if (!label) notFound(); const page = await getNewsPage("l:0", 20, { category: label }); return <NewsTerminal initialStories={page.stories} initialCursor={page.nextCursor} initialCategory={label} />; }