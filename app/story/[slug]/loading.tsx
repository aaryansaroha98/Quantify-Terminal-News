import Link from "next/link";

export default function StoryLoading() {
  return <div className="article-shell" aria-busy="true" aria-label="Loading story">
    <header className="article-topbar"><Link className="brand" href="/"><span>Quantify Terminal</span><b>Newsroom</b></Link><Link href="/" className="back-link">← Back to newsroom</Link></header>
    <main className="article-page story-loading"><div className="story-loading-line story-loading-label"/><div className="story-loading-line story-loading-title"/><div className="story-loading-line story-loading-title story-loading-title--short"/><div className="story-loading-line story-loading-deck"/><div className="story-loading-line story-loading-deck story-loading-deck--short"/><div className="story-loading-meta"/><div className="story-loading-visual"/></main>
  </div>;
}
