import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { NewsImage } from "@/components/news-image";
import { getStoryBySlug } from "@/lib/news";

export const revalidate = 30;
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const story = await getStoryBySlug(slug);
  return story ? { title: story.headline, description: story.summary, alternates: { canonical: `/story/${story.slug}` }, openGraph: { title: story.headline, description: story.summary, url: `/story/${story.slug}`, type: "article", publishedTime: story.publishedAt, images: story.image ? [story.image] : [] } } : {};
}
export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const story = await getStoryBySlug(slug); if (!story) notFound();
  const published = new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(story.publishedAt));
  const schema = { "@context": "https://schema.org", "@type": "NewsArticle", headline: story.headline, datePublished: story.publishedAt, image: story.image ? [story.image] : undefined, publisher: { "@type": "Organization", name: story.source }, isBasedOn: story.sourceUrl };
  return <div className="article-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <header className="article-topbar"><Link className="brand" href="/"><span>Quantify Terminal</span><b>Newsroom</b></Link><Link href="/" className="back-link">← Back to newsroom</Link></header>
    <main className="article-page"><div className="article-breadcrumb">{story.category.toUpperCase()} / LIVE REPORT</div><h1>{story.headline}</h1><p className="article-deck">{story.summary}</p><div className="article-byline"><span>SOURCED FROM {story.source.toUpperCase()}</span><time>{published} IST</time><a href={story.sourceUrl} target="_blank" rel="noopener noreferrer">OPEN ORIGINAL ↗</a></div>
      {story.image && <figure className="article-image"><NewsImage src={story.image} alt={story.headline} priority/><figcaption>Publisher-supplied image · {story.source}</figcaption></figure>}
      <div className="article-layout"><article><section><label>PUBLISHER SUMMARY</label><h2>What was reported</h2><p>{story.summary}</p><a className="original-report" href={story.sourceUrl} target="_blank" rel="noopener noreferrer">Read the complete original report at {story.source} <Icon name="external" size={14}/></a></section><div className="source-disclosure"><b>Source transparency</b><p>Quantify Terminal Newsroom organizes and links this report. The headline, summary, and image remain attributed to the original publisher. No automated investment analysis is shown.</p></div></article>
        <aside>{story.tickers.length > 0 && <div className="fact-box"><span>MENTIONED ASSETS</span>{story.tickers.map((ticker) => <b key={ticker}>{ticker}</b>)}</div>}<div className="fact-box"><span>STORY PROFILE</span><dl><dt>Desk</dt><dd>{story.category}</dd><dt>Publisher</dt><dd>{story.source}</dd><dt>Published</dt><dd>{published}</dd></dl></div><a href={story.sourceUrl} target="_blank" rel="noopener noreferrer" className="more-news">Original article <Icon name="external" size={13}/></a></aside></div>
    </main>
  </div>;
}