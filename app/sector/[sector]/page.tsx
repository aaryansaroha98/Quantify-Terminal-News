import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsTerminal } from "@/components/news-terminal";
import { getNewsPage } from "@/lib/news";
import { SECTOR_DESKS } from "@/lib/site";

export const revalidate = 60;
export function generateStaticParams() { return Object.keys(SECTOR_DESKS).map((sector) => ({ sector })); }
export async function generateMetadata({ params }: { params: Promise<{ sector: string }> }): Promise<Metadata> { const { sector } = await params; const label = SECTOR_DESKS[sector]; return label ? { title: `${label} Sector News`, description: `Live ${label.toLowerCase()} sector news from attributed publishers.`, alternates: { canonical: `/sector/${sector}` }, openGraph: { url: `/sector/${sector}`, title: `${label} Sector News` } } : {}; }
export default async function SectorPage({ params }: { params: Promise<{ sector: string }> }) { const { sector } = await params; const label = SECTOR_DESKS[sector]; if (!label) notFound(); const page = await getNewsPage("l:0", 20, { sector: label }); return <NewsTerminal initialStories={page.stories} initialCursor={page.nextCursor} initialSector={label} />; }
