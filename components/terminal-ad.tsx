"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./icon";

const nextDisplayKey = "qt-terminal-ad-next-display";
const cooldownMs = 3 * 60 * 1000;

export function TerminalAd() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setVisible(false);
    let nextDisplay = 0;
    try { nextDisplay = Number(sessionStorage.getItem(nextDisplayKey) || 0); } catch {}
    const remaining = Math.max(0, nextDisplay - Date.now());
    const arrivalDelay = 7000 + Math.floor(Math.random() * 8000);
    const timer = window.setTimeout(() => setVisible(true), remaining || arrivalDelay);
    return () => window.clearTimeout(timer);
  }, [cycle, pathname]);

  if (!visible) return null;

  const close = () => {
    setVisible(false);
    try { sessionStorage.setItem(nextDisplayKey, String(Date.now() + cooldownMs)); } catch {}
    setCycle((value) => value + 1);
  };

  return <aside className="global-terminal-ad global-terminal-ad--popup" aria-label="Quantify Terminal promotion">
    <div className="global-ad-brand"><img src="/qt-logo.png" alt="" width="52" height="52"/><span><b>Quantify Terminal</b><small>Professional financial research platform</small></span></div>
    <div className="global-ad-copy"><strong>Research markets with professional-grade tools.</strong><p>Built for quantitative analysts, hedge funds, investment teams, and serious market participants.</p></div>
    <div className="global-ad-points" aria-label="Product capabilities"><span>Advanced charts</span><span>Company intelligence</span><span>Portfolio research</span></div>
    <a href="https://www.quantifyterminal.com/download" target="_blank" rel="noopener noreferrer">Explore Quantify Terminal <Icon name="arrow" size={14}/></a>
    <button type="button" onClick={close} aria-label="Close promotion">×</button>
  </aside>;
}
