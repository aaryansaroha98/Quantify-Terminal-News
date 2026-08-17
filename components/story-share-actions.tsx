"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";

export function StoryShareActions({ headline, url, instagramCard }: { headline: string; url: string; instagramCard: string }) {
  const [open, setOpen] = useState(false); const [status, setStatus] = useState(""); const rootRef = useRef<HTMLDivElement>(null);
  const caption = `${headline}\n\nRead via Quantify Terminal Newsroom\n${url}`;
  const xUrl = `https://x.com/intent/post?${new URLSearchParams({ text: headline, url })}`;
  const threadsUrl = `https://www.threads.net/intent/post?${new URLSearchParams({ text: caption })}`;
  const redditUrl = `https://www.reddit.com/submit?${new URLSearchParams({ url, title: headline })}`;
  useEffect(() => { const close = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); }; const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; document.addEventListener("mousedown", close); document.addEventListener("keydown", escape); return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); }; }, []);
  const shareInstagram = async () => {
    setStatus("Preparing branded card…");
    try {
      const response = await fetch(instagramCard); if (!response.ok) throw new Error(); const blob = await response.blob();
      const file = new File([blob], "quantify-terminal-news.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], text: caption, title: headline }); setStatus("Card ready to share"); }
      else { const objectUrl = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = objectUrl; anchor.download = file.name; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000); try { await navigator.clipboard.writeText(caption); setStatus("Card downloaded · caption copied"); } catch { setStatus("Card downloaded · upload it to Instagram"); } }
    } catch (error) { if ((error as DOMException).name !== "AbortError") setStatus("Could not prepare the card. Try again."); }
  };
  const copyLink = async () => { try { await navigator.clipboard.writeText(url); setStatus("Link copied"); } catch { setStatus("Copy unavailable"); } };
  return <div className="story-share" ref={rootRef}><span>SHARE STORY</span><button className="story-share-trigger" type="button" aria-expanded={open} onClick={() => { setOpen((value) => !value); setStatus(""); }}><Icon name="share" size={16}/> Share</button>{open && <div className="story-share-menu" role="menu"><a href={xUrl} target="_blank" rel="noopener noreferrer" role="menuitem"><i>X</i><span>Post on X</span></a><button type="button" role="menuitem" onClick={shareInstagram}><i className="instagram-mark">◎</i><span>Instagram card</span></button><a href={threadsUrl} target="_blank" rel="noopener noreferrer" role="menuitem"><i>@</i><span>Post on Threads</span></a><a href={redditUrl} target="_blank" rel="noopener noreferrer" role="menuitem"><i className="reddit-mark">r/</i><span>Share to Reddit</span></a><button type="button" role="menuitem" onClick={copyLink}><i>↗</i><span>Copy link</span></button>{status && <p aria-live="polite">{status}</p>}</div>}</div>;
}
