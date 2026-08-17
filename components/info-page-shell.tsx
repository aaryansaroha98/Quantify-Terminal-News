import Link from "next/link";
import type { ReactNode } from "react";

export function InfoPageShell({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead: string; children: ReactNode }) {
  return <main className="info-page">
    <header><Link className="brand" href="/"><span>Quantify Terminal</span><b>Newsroom</b></Link><Link href="/">← Newsroom</Link></header>
    <article><span className="info-eyebrow">{eyebrow}</span><h1>{title}</h1><p className="info-lead">{lead}</p>{children}</article>
  </main>;
}
