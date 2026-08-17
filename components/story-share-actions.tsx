"use client";

import { useState } from "react";
import { Icon } from "./icon";

export function StoryShareActions({ headline, url }: { headline: string; url: string }) {
  const [status, setStatus] = useState("");
  const share = async () => {
    setStatus("");
    try {
      if (navigator.share) { await navigator.share({ title: headline, text: `${headline} — Quantify Terminal Newsroom`, url }); setStatus("Ready to share"); return; }
      await navigator.clipboard.writeText(url); setStatus("Link copied");
    } catch (error) {
      if ((error as DOMException).name === "AbortError") return;
      try { await navigator.clipboard.writeText(url); setStatus("Link copied"); } catch { setStatus("Unable to copy link"); }
    }
  };
  return <div className="story-share"><button className="story-share-trigger" type="button" onClick={share}><Icon name="share" size={16}/> Share story</button><span aria-live="polite">{status}</span></div>;
}
