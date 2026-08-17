import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsTerminal } from "@/components/news-terminal";
import { getNewsPage } from "@/lib/news";
import { CATEGORY_DESKS } from "@/lib/site";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> { const { category } = await params; const label = CATEGORY_DESKS[category]; return label ? { title: `${label} News`, description: `Live, attributed ${label.toLowerCase()} news from established publishers.`, alternates: { canonical: `/category/${category}` }, openGraph: { url: `/category/${category}`, title: `${label} News` } } : {}; }
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; const label = CATEGORY_DESKS[category]; if (!label) notFound(); const page = await getNewsPage("l:0", 20, { category: label }); return <NewsTerminal initialStories={page.stories} initialCursor={page.nextCursor} initialCategory={label} />; }
