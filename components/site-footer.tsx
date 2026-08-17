import Link from "next/link";
import { PRODUCT_LINKS } from "@/lib/site";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="site-footer-main">
      <div className="site-footer-intro"><Link className="brand" href="/"><span>Quantify Terminal</span><b>Newsroom</b></Link><p>Live financial reporting, organized for market participants with clear publisher attribution.</p></div>
      <nav aria-label="Newsroom links"><strong>Newsroom</strong><Link href="/latest">Latest news</Link><Link href="/sources">Sources</Link><Link href="/methodology">Methodology</Link></nav>
      <nav aria-label="Company links"><strong>Company</strong><Link href="/about">About us</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms & conditions</Link></nav>
      <nav aria-label="Quantify Terminal product links"><strong>Quantify Terminal</strong><a href={PRODUCT_LINKS.website}>Official website</a><a href={PRODUCT_LINKS.features}>Features</a><a href={PRODUCT_LINKS.documentation}>Documentation</a><a href={PRODUCT_LINKS.download}>Download</a></nav>
    </div>
    <div className="site-footer-bottom"><span>© 2026 Quantify Terminal. All rights reserved.</span><span>Financial information only — not investment advice.</span></div>
  </footer>;
}
