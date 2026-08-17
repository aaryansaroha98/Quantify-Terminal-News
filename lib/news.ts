import "server-only";
import { createHash } from "node:crypto";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { Story } from "./types";

const feeds = [
  { name: "Economic Times", url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms" },
  { name: "CNBC", url: "https://www.cnbc.com/id/100003114/device/rss/rss.html" },
  { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
];
const tickerMap: Record<string, string> = {
  nvidia: "NVDA", apple: "AAPL", microsoft: "MSFT", alphabet: "GOOGL", google: "GOOGL",
  amazon: "AMZN", meta: "META", tesla: "TSLA", bitcoin: "BTC-USD", ethereum: "ETH-USD",
  reliance: "RELIANCE", infosys: "INFY", tcs: "TCS", hdfc: "HDFCBANK", icici: "ICICIBANK",
  "yes bank": "YESBANK", bse: "BSE", nmdc: "NMDC", alibaba: "BABA", amd: "AMD",
};

function clean(value = "") {
  return value.replace(/<!\[CDATA\[/g, "").replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\]\]>/g, "")
    .replace(/\s+/g, " ").trim();
}
function cleanArticle(value = "") {
  return value.replace(/<!\[CDATA\[/g, "")
    .replace(/<\/(?:p|div|li|h[1-6])>/gi, "\n\n").replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, " ").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\]\]>/g, "")
    .replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
function rawNode(item: string, tag: string) {
  return item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] || "";
}
function node(item: string, tag: string) { return clean(rawNode(item, tag)); }
function normalizeImage(value?: string) {
  if (!value) return undefined;
  const decoded = value.replace(/&amp;/g, "&").trim();
  const absolute = decoded.startsWith("//") ? `https:${decoded}` : decoded;
  if (!/^https?:\/\//i.test(absolute) || /(?:pixel|tracker|spacer|1x1)/i.test(absolute)) return undefined;
  return absolute;
}
function categoryFor(text: string, url: string) {
  const value = `${text} ${url}`.toLowerCase();
  if (/merger|acquisition|takeover|buyout|\bm&a\b/.test(value)) return "M&A";
  if (/crypto|bitcoin|ethereum|blockchain/.test(value)) return "Crypto";
  if (/ipo|listing|debut|public offer/.test(value)) return "IPO";
  if (/earnings|results|revenue|profit|quarterly/.test(value)) return "Earnings";
  if (/rbi|fed |federal reserve|ecb|boj|central bank|rate decision/.test(value)) return "Central Banks";
  if (/war|conflict|sanction|geopolit|military|diplomatic/.test(value)) return "Geopolitics";
  if (/oil|gold|copper|commodity|sugar|natural gas/.test(value)) return "Commodities";
  if (/ai |chip|semiconductor|technology|cyber|software/.test(value)) return "Technology";
  if (/india|sensex|nifty|rupee|sebi|mumbai/.test(value)) return "India";
  if (/nasdaq|wall street|s&p|dow jones|us stock|u\.s\. market/.test(value)) return "US Markets";
  if (/economy|inflation|gdp|jobs|retail sales|employment/.test(value)) return "Economy";
  if (/stock|shares|equity|upgrade|downgrade|rall|tumble/.test(value)) return "Stocks";
  if (/company|corporate|partnership|business|deal/.test(value)) return "Companies";
  if (/market|futures|index|indices|investor/.test(value)) return "Markets";
  return "Global Markets";
}
function sectorFor(text: string) {
  const value = text.toLowerCase();
  if (/bank|lender|insurance|fintech|payments|financial/.test(value)) return "Financials";
  if (/oil|gas|energy|power|solar|renewable/.test(value)) return "Energy";
  if (/health|pharma|drug|biotech|hospital|diagnostic/.test(value)) return "Healthcare";
  if (/technology|software|cloud|cyber|\bai\b|chip|semiconductor/.test(value)) return "Technology";
  if (/auto|vehicle|ev |electric vehicle|automaker/.test(value)) return "Automotive";
  if (/retail|consumer|food|beverage|restaurant|e-commerce/.test(value)) return "Consumer";
  if (/real estate|reit|property|housing/.test(value)) return "Real Estate";
  if (/telecom|wireless|5g|broadband/.test(value)) return "Telecom";
  if (/media|streaming|entertainment|studio/.test(value)) return "Media";
  if (/industrial|manufacturing|infrastructure|defence|aerospace/.test(value)) return "Industrials";
  return undefined;
}
function enrich(base: { title: string; summary: string; body?: string; url: string; image?: string; source: string; publishedAt: string }): Story {
  const fullText = `${base.title} ${base.summary}`;
  const category = categoryFor(fullText, base.url);
  const sector = sectorFor(fullText);
  const lowered = base.title.toLowerCase();
  const tickers = Object.entries(tickerMap).filter(([name]) => lowered.includes(name)).map(([, ticker]) => ticker).slice(0, 5);
  const hash = createHash("sha1").update(base.url).digest("hex").slice(0, 10);
  const words = base.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72);
  const dateKey = base.publishedAt.slice(0, 10).replace(/-/g, "");
  return { id: hash, slug: `${dateKey}-${words}-${hash}`, headline: base.title, summary: base.summary || "This is a developing financial-market story. Open the original report for complete details.", body: base.body, category, sector, source: base.source, sourceUrl: base.url, image: normalizeImage(base.image), publishedAt: base.publishedAt, tickers };
}

function parseRss(xml: string, source: string): Story[] {
  return [...xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/gi)].map((match) => {
    const item = match[1]; const title = node(item, "title");
    const url = node(item, "link") || node(item, "guid"); const summary = node(item, "description");
    const suppliedBody = cleanArticle(rawNode(item, "content:encoded") || rawNode(item, "content"));
    const body = suppliedBody.length > summary.length + 180 ? suppliedBody.slice(0, 20_000) : undefined;
    const image = item.match(/<enclosure[^>]+url=["']([^"']+)/i)?.[1]
      || item.match(/<media:(?:content|thumbnail)[^>]+url=["']([^"']+)/i)?.[1]
      || item.match(/<(?:img|image)[^>]+(?:src|url)=["']([^"']+)/i)?.[1]
      || item.match(/(?:og:image|twitter:image)[^>]+content=["']([^"']+)/i)?.[1];
    const date = node(item, "pubDate") || node(item, "dc:date");
    return title && url ? enrich({ title, summary, body, url, image, source, publishedAt: new Date(date || Date.now()).toISOString() }) : null;
  }).filter((story): story is Story => Boolean(story));
}
type GdeltArticle = { url: string; title: string; seendate: string; socialimage?: string; domain: string };
function gdeltTimestamp(date: Date) { return date.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14); }
async function gdeltWindow(dayOffset = 0): Promise<Story[]> {
  try {
    const params = new URLSearchParams({ query: "(markets OR stocks OR economy OR business OR earnings) sourcelang:english", mode: "artlist", maxrecords: "100", format: "json", sort: "datedesc" });
    if (dayOffset === 0) params.set("timespan", "24h");
    else { const end = new Date(Date.now() - dayOffset * 86_400_000); const start = new Date(end.getTime() - 86_400_000); params.set("startdatetime", gdeltTimestamp(start)); params.set("enddatetime", gdeltTimestamp(end)); }
    const response = await fetch(`https://api.gdeltproject.org/api/v2/doc/doc?${params}`, { next: { revalidate: dayOffset ? 3600 : 120 }, signal: AbortSignal.timeout(5000) }); if (!response.ok) return [];
    const data = await response.json() as { articles?: GdeltArticle[] };
    return (data.articles || []).filter((item) => item.title && item.url).map((item) => enrich({ title: clean(item.title), summary: "Developing report indexed from the original publisher. Open the source for the complete article and primary reporting.", url: item.url, image: item.socialimage, source: item.domain.replace(/^www\./, ""), publishedAt: item.seendate ? `${item.seendate.slice(0,4)}-${item.seendate.slice(4,6)}-${item.seendate.slice(6,8)}T${item.seendate.slice(9,11)}:${item.seendate.slice(11,13)}:00Z` : new Date().toISOString() }));
  } catch { return []; }
}

const financialNews = /market|stock|share|bond|yield|bank|econom|inflation|gdp|earnings|revenue|profit|invest|trade|tariff|oil|gold|commodity|crypto|bitcoin|ethereum|company|business|fed|rbi|ipo|merger|acquisition|currency|rupee|dollar|technology|\bai\b|semiconductor|fund|finance|interest rate|retail sales|jobs|employment|futures|nasdaq|dow|s&p/i;

export type NewsFilters = { category?: string; sector?: string };
function dedupe(stories: Story[]) { const unique = new Map<string, Story>(); stories.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).forEach((story) => { if (!unique.has(story.headline.toLowerCase())) unique.set(story.headline.toLowerCase(), story); }); return [...unique.values()]; }
export function filterNews(stories: Story[], filters: NewsFilters = {}) {
  return stories.filter((story) => (!filters.category || filters.category === "All News" || story.category === filters.category) && (!filters.sector || story.sector === filters.sector));
}
async function fetchLiveNewsSnapshot(): Promise<Story[]> {
  const [gdelt, ...batches] = await Promise.all([gdeltWindow(0), ...feeds.map(async (feed) => {
    try { const response = await fetch(feed.url, { headers: { "User-Agent": "QuantifyNews/1.0 (+https://quantifyterminal.com)" }, next: { revalidate: 120 }, signal: AbortSignal.timeout(5000) }); return response.ok ? parseRss(await response.text(), feed.name) : []; }
    catch { return []; }
  })]);
  const rssStories = batches.flat().filter((story) => financialNews.test(`${story.headline} ${story.summary}`));
  return dedupe([...rssStories, ...gdelt.filter((story) => financialNews.test(`${story.headline} ${story.summary}`))]);
}
const getCachedLiveNews = unstable_cache(fetchLiveNewsSnapshot, ["live-news-v4"], { revalidate: 60, tags: ["live-news"] });
export async function getLiveNews(): Promise<Story[]> { return getCachedLiveNews(); }

export type NewsPage = { stories: Story[]; nextCursor: string | null };
export async function getNewsPage(cursor = "l:0", limit = 20, filters: NewsFilters = {}): Promise<NewsPage> {
  const safeLimit = Math.min(Math.max(limit, 5), 30); const [mode, first = "0", second = "0"] = cursor.split(":");
  if (mode === "h") { const day = Math.max(1, Number(first) || 1); if (day > 30) return { stories: [], nextCursor: null }; const offset = Math.max(0, Number(second) || 0); const history = filterNews(dedupe((await gdeltWindow(day)).filter((story) => financialNews.test(`${story.headline} ${story.summary}`))), filters); const stories = history.slice(offset, offset + safeLimit); const nextCursor = stories.length === 0 ? null : offset + safeLimit < history.length ? `h:${day}:${offset + safeLimit}` : `h:${day + 1}:0`; return { stories, nextCursor }; }
  const offset = Math.max(0, Number(first) || 0); const live = filterNews(await getLiveNews(), filters); const stories = live.slice(offset, offset + safeLimit); const nextCursor = offset + safeLimit < live.length ? `l:${offset + safeLimit}` : "h:1:0"; return { stories, nextCursor };
}
async function findStoryBySlug(slug: string) {
  const live = await getLiveNews(); const current = live.find((story) => story.slug === slug); if (current) return current;
  const dateMatch = slug.match(/^(\d{4})(\d{2})(\d{2})-/); if (!dateMatch) return undefined;
  const published = Date.UTC(Number(dateMatch[1]), Number(dateMatch[2]) - 1, Number(dateMatch[3])); const day = Math.max(1, Math.round((Date.now() - published) / 86_400_000)); if (day > 30) return undefined;
  return (await gdeltWindow(day)).find((story) => story.slug === slug);
}
const getCachedStoryBySlug = unstable_cache(findStoryBySlug, ["story-by-slug-v3"], { revalidate: 3600, tags: ["stories"] });
export const getStoryBySlug = cache((slug: string) => getCachedStoryBySlug(slug));