"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./icon";
import { NewsImage } from "./news-image";
import type { Story } from "@/lib/types";
import { CATEGORY_LABELS, SECTOR_LABELS } from "@/lib/site";

const categories = CATEGORY_LABELS;
const sectors = SECTOR_LABELS;
const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
const timeFormat = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
const worldClocks = [{ city: "NEW DELHI", zone: "Asia/Kolkata" }, { city: "LONDON", zone: "Europe/London" }, { city: "NEW YORK", zone: "America/New_York" }, { city: "TOKYO", zone: "Asia/Tokyo" }, { city: "SYDNEY", zone: "Australia/Sydney" }];
function storyTime(value: string) { return timeFormat.format(new Date(value)); }
function worldTime(date: Date, zone: string) { return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: zone }).format(date); }
function categoryUrl(value: string) { if (value === "All News") return "/"; if (value === "M&A") return "/category/m-and-a"; return `/category/${value.toLowerCase().replace(/\s+/g, "-")}`; }
function sectorUrl(value: string) { return `/sector/${value.toLowerCase().replace(/\s+/g, "-")}`; }
function newsUrl(cursor: string, category?: string, sector?: string) { const params = new URLSearchParams({ cursor, limit: "20" }); if (category && category !== "All News") params.set("category", category); if (sector) params.set("sector", sector); return `/api/news?${params}`; }
function mergeStories(current: Story[], incoming: Story[]) { const merged = new Map<string, Story>(); [...incoming, ...current].forEach((story) => merged.set(story.id, story)); return [...merged.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)); }

export function NewsTerminal({ initialStories, initialCursor, initialCategory = "All News", initialSector }: { initialStories: Story[]; initialCursor: string | null; initialCategory?: string; initialSector?: string }) {
  const [stories, setStories] = useState(initialStories);
  const category = initialCategory;
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [updated, setUpdated] = useState(new Date());
  const [clockNow, setClockNow] = useState(new Date());
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(Boolean(initialCursor));
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const sector = initialSector;
  useEffect(() => {
    let newsBusy = false;
    const refreshNews = async () => { if (newsBusy) return; newsBusy = true; try { const response = await fetch(newsUrl("l:0", category, sector), { signal: AbortSignal.timeout(10000) }); const data = await response.json() as { stories?: Story[]; updatedAt?: string }; if (data.stories?.length) { setStories((current) => mergeStories(current, data.stories!)); setUpdated(new Date(data.updatedAt || Date.now())); } } catch {} finally { newsBusy = false; } };
    const refreshVisible = () => { if (document.visibilityState === "visible") refreshNews(); };
    refreshNews(); document.addEventListener("visibilitychange", refreshVisible); window.addEventListener("focus", refreshVisible);
    const newsTimer = window.setInterval(refreshNews, 15000); const clockTimer = window.setInterval(() => setClockNow(new Date()), 1000);
    return () => { document.removeEventListener("visibilitychange", refreshVisible); window.removeEventListener("focus", refreshVisible); window.clearInterval(newsTimer); window.clearInterval(clockTimer); };
  }, [category, sector]);
  useEffect(() => {
    const target = sentinelRef.current; if (!target || !hasMore || !cursor) return;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || loadingRef.current) return; loadingRef.current = true; setLoadingMore(true);
      try { const response = await fetch(newsUrl(cursor, category, sector), { signal: AbortSignal.timeout(12000) }); const data = await response.json() as { stories?: Story[]; nextCursor?: string | null }; if (data.stories?.length) setStories((current) => mergeStories(current, data.stories!)); setCursor(data.nextCursor || null); setHasMore(Boolean(data.nextCursor)); }
      catch {} finally { loadingRef.current = false; setLoadingMore(false); }
    }, { rootMargin: "700px 0px" });
    observer.observe(target); return () => observer.disconnect();
  }, [cursor, hasMore, category, sector]);
  const filtered = useMemo(() => stories.filter((story) => {
    const categoryMatch = category === "All News" || story.category === category || (category === "Markets" && story.category.includes("Markets"));
    const sectorMatch = !sector || story.sector === sector;
    const needle = query.trim().toLowerCase();
    return categoryMatch && sectorMatch && (!needle || `${story.headline} ${story.summary} ${story.source} ${story.tickers.join(" ")}`.toLowerCase().includes(needle));
  }), [stories, category, sector, query]);
  const hero = filtered[0]; const rest = filtered.slice(1);
  const toggleSaved = (id: string) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  return <div className="news-shell">
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle sections"><Icon name="menu" /></button>
      <a className="brand" href="/"><span>Quantify Terminal</span><b>Newsroom</b></a>
      <nav className="product-nav"><a href="/" className="active">Top Stories</a><a href="/#briefs">Latest News</a><a href="/latest">All Stories</a><a href="/sources">Sources</a></nav>
      <div className="top-actions"><label className="search"><Icon name="search" size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies, markets or topics" aria-label="Search news"/></label><a className="terminal-cta-top" href="https://www.quantifyterminal.com/download" target="_blank" rel="noopener noreferrer">Download Terminal <Icon name="arrow" size={14}/></a></div>
    </header>
    <section className="world-clock-bar" aria-label="World market clocks">{worldClocks.map((clock) => <div className="world-clock" key={clock.city}><span>{clock.city}</span><b>{worldTime(clockNow, clock.zone)}</b></div>)}<small>GLOBAL DESK</small></section>
    <section className="headline-rail" aria-label="Latest live financial headlines"><span><i/> LIVE NEWS</span><div className="headline-ticker-window"><div className="headline-ticker-track">{[...stories.slice(0, 10), ...stories.slice(0, 10)].map((story, index) => <a href={`/story/${story.slug}`} key={`${story.id}-${index}`}><time>{storyTime(story.publishedAt)}</time><b>{story.source}</b>{story.headline}</a>)}</div></div><small>REFRESHED {storyTime(updated.toISOString())} IST</small></section>
    <div className="workspace">
      <aside className={`sidebar ${menuOpen ? "sidebar--open" : ""}`}><div className="side-label">News desks</div><nav className="category-nav">{categories.map((item) => <a href={categoryUrl(item)} key={item} className={category === item && !sector ? "selected" : ""} onClick={() => setMenuOpen(false)}><span>{item}</span></a>)}</nav><div className="side-divider"/><div className="side-label">Sectors</div><nav className="sector-nav">{sectors.map((item) => <a href={sectorUrl(item)} key={item} className={sector === item ? "selected" : ""} onClick={() => setMenuOpen(false)}>{item}</a>)}</nav><div className="sidebar-note"><span>LIVE NEWSROOM</span><p>New reports load continuously as you scroll.</p><a href="/methodology">How it works <Icon name="arrow" size={12}/></a></div><a className="terminal-promo" href="https://www.quantifyterminal.com/download" target="_blank" rel="noopener noreferrer"><span>QUANTIFY TERMINAL</span><div className="terminal-preview"><img src="/qt-logo.png" alt="" width="48" height="48"/><div><b>ONE PROFESSIONAL WORKSPACE</b><em>Research companies, study charts, and organize the markets you follow.</em></div></div><h3>Go beyond the headline.</h3><p>Charts, fundamentals, watchlists, and market intelligence—built for focused research.</p><strong>Explore Terminal <Icon name="arrow" size={13}/></strong></a></aside>
      <main className="content" id="top">
        <section className="page-heading"><div><div className="eyebrow">{dateFormat.format(new Date()).toUpperCase()} · {(sector ? `${sector} SECTOR` : category !== "All News" ? `${category} DESK` : "GLOBAL EDITION").toUpperCase()}</div><h1>Markets move fast.<br/><em>Stay informed.</em></h1><p>Live financial reporting from established publishers, organized by market, company, sector, and region.</p></div><div className="edition-mark"><span className="live-pulse"/><small>LIVE NEWSROOM<br/>UPDATED {storyTime(updated.toISOString())} IST</small></div></section>
        {hero ? <article className={`hero-story ${hero.image ? "" : "hero-story--no-image"}`}>
          {hero.image && <a className="hero-visual" href={`/story/${hero.slug}`}><NewsImage src={hero.image} alt={hero.headline} priority/><span className="image-source">IMAGE / {hero.source.toUpperCase()}</span></a>}
          <div className="hero-copy"><div className="story-meta"><span className="breaking"><i/> TOP STORY</span><span>{hero.category.toUpperCase()}</span><span>{storyTime(hero.publishedAt)} IST</span></div><h2><a href={`/story/${hero.slug}`}>{hero.headline}</a></h2><p>{hero.summary}</p>{hero.tickers.length > 0 && <div className="ticker-row">{hero.tickers.map((ticker) => <span key={ticker}>{ticker}</span>)}</div>}<div className="hero-actions"><a href={`/story/${hero.slug}`} className="read-analysis">Read full story <Icon name="arrow" size={15}/></a><a href={hero.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">Original reporting · {hero.source} <Icon name="external" size={12}/></a></div></div>
        </article> : <div className="news-error"><h2>Finding stories for this desk…</h2><p>Older reports will load automatically as the archive is searched.</p></div>}

        <section className="brief-section" id="briefs"><div className="section-heading"><div><span className="section-index">01</span><h2>Latest Stories</h2><p>Live, attributed financial reporting from established publishers.</p></div><span className="story-count">CONTINUOUS FEED</span></div>
          <div className="story-grid">{rest.slice(0, 4).map((story) => <article className={`image-card ${story.image ? "" : "image-card--no-image"}`} key={story.id}>{story.image && <a href={`/story/${story.slug}`} className="card-image"><NewsImage src={story.image} alt={story.headline}/></a>}<div className="card-copy"><div className="brief-kicker"><span>{story.category.toUpperCase()}</span><time>{storyTime(story.publishedAt)} IST</time></div><h3><a href={`/story/${story.slug}`}>{story.headline}</a></h3><p>{story.summary}</p><div className="card-footer"><span>{story.source}</span><a href={story.sourceUrl} target="_blank" rel="noopener noreferrer">Original source ↗</a></div></div></article>)}</div>
          <div className="brief-list">{rest.slice(4).map((story) => <article className={`brief ${story.image ? "" : "brief--no-image"}`} key={story.id}>{story.image && <a className="brief-thumb" href={`/story/${story.slug}`}><NewsImage src={story.image} alt={story.headline}/></a>}<div className="brief-time"><b>{storyTime(story.publishedAt)}</b><span>IST</span><i /></div><div className="brief-body"><div className="brief-kicker"><span>{story.category.toUpperCase()} · {story.source.toUpperCase()}</span></div><h3><a href={`/story/${story.slug}`}>{story.headline}</a></h3><p>{story.summary}</p><div className="brief-footer"><div className="ticker-row">{story.tickers.map((ticker) => <span key={ticker}>{ticker}</span>)}</div><a href={`/story/${story.slug}`}>Read story <Icon name="arrow" size={13}/></a></div></div><button className={`save-button ${saved.includes(story.id) ? "is-saved" : ""}`} onClick={() => toggleSaved(story.id)} aria-label="Save article"><Icon name="bookmark" size={17}/></button></article>)}</div>
          <div ref={sentinelRef} className="infinite-loader" aria-live="polite">{loadingMore ? <><i/><span>Loading more live news…</span></> : hasMore ? <span>Scroll for more news</span> : <span>News archive reached</span>}</div>
        </section>
      </main>
      <aside className="right-rail" id="latest"><section className="rail-panel latest-panel"><div className="rail-heading"><span>LIVE WIRE</span><i>UPDATING</i></div>{stories.slice(0, 8).map((story, index) => <a href={`/story/${story.slug}`} className={`latest-item ${story.image ? "" : "latest-item--no-image"}`} key={story.id}>{story.image && <span className="latest-thumb"><NewsImage src={story.image} alt={story.headline}/></span>}<div><time>{storyTime(story.publishedAt)} IST</time><span>{story.source} · {story.category}</span><h3>{story.headline}</h3><div>{story.tickers.slice(0,2).map((ticker) => <b key={ticker}>{ticker}</b>)}</div></div><em>{String(index + 1).padStart(2,"0")}</em></a>)}</section><section className="rail-panel source-panel"><div className="rail-heading"><span>NEWS SOURCES</span><small>LIVE</small></div><p>Economic Times</p><p>CNBC</p><p>CoinDesk</p><p>GDELT global index <small>fallback</small></p></section></aside>
    </div>
  </div>;
}