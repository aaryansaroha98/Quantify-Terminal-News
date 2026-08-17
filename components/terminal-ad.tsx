"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icon";

const dismissalKey = "qt-terminal-ad-dismissed";

export function TerminalAd() {
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(dismissalKey) === "1");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || dismissed) return;
    document.body.classList.add("terminal-ad-visible");
    return () => document.body.classList.remove("terminal-ad-visible");
  }, [dismissed, ready]);

  if (!ready || dismissed) return null;

  const close = () => {
    setDismissed(true);
    try { sessionStorage.setItem(dismissalKey, "1"); } catch {}
  };

  return <aside className="global-terminal-ad" aria-label="Quantify Terminal promotion">
    <div className="global-ad-brand"><img src="/qt-logo.png" alt="" width="52" height="52"/><span><b>Quantify Terminal</b><small>Professional market workspace</small></span></div>
    <div className="global-ad-copy"><strong>Move from financial news to deeper research.</strong><p>Explore charts, company fundamentals, watchlists, and market intelligence in one focused workspace.</p></div>
    <div className="global-ad-points" aria-label="Product capabilities"><span>Advanced charts</span><span>Company intelligence</span><span>Personal watchlists</span></div>
    <a href="https://www.quantifyterminal.com/download" target="_blank" rel="noopener noreferrer">Explore Terminal <Icon name="arrow" size={14}/></a>
    <button type="button" onClick={close} aria-label="Dismiss Quantify Terminal promotion">×</button>
  </aside>;
}
