import type { Metadata } from "next";
import { InfoPageShell } from "@/components/info-page-shell";
import { CONTACT_EMAIL, PRODUCT_LINKS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = { title: "About Us", description: "Quantify Terminal is building a professional financial research platform for modern market participants.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  const schema = { "@context": "https://schema.org", "@type": "Organization", name: "Quantify Terminal", url: PRODUCT_LINKS.website, email: CONTACT_EMAIL, subOrganization: { "@type": "NewsMediaOrganization", name: "Quantify Terminal Newsroom", url: SITE_URL } };
  return <InfoPageShell eyebrow="ABOUT QUANTIFY TERMINAL" title={<>Professional market intelligence,<br/>built for everyone ready to go deeper.</>} lead="Quantify Terminal is building a new generation of financial research infrastructure—powerful enough for professional market participants and accessible to every ambitious investor.">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}/>
    <section><h2>Our mission</h2><p>Institutional-quality market research has traditionally been fragmented, expensive, and difficult to access. We are building Quantify Terminal to change that: one focused platform where users can move from a market headline to company intelligence, advanced charts, portfolio context, screeners, alerts, and deeper research.</p></section>
    <section><h2>Designed for serious decision-makers</h2><div className="source-cards"><div><b>Quantitative analysts</b><p>Explore data, market structure, companies, and global context in a research-first workspace.</p></div><div><b>Hedge funds and investment teams</b><p>Bring news, monitoring, portfolio intelligence, and idea discovery into one operating environment.</p></div><div><b>Independent investors</b><p>Access a cleaner, more capable way to understand markets without depending on fragmented tools.</p></div><div><b>Builders and researchers</b><p>Follow the connections between technology, economies, sectors, assets, and companies.</p></div></div></section>
    <section><h2>More than a news website</h2><p>The Newsroom is the real-time information layer of the wider <a className="text-link" href={PRODUCT_LINKS.website}>Quantify Terminal</a> platform. News tells you what changed. Quantify Terminal is being built to help you investigate why it matters, understand the surrounding market, and continue your own research with professional tools.</p></section>
    <section><h2>Our long-term vision</h2><p>Our ambition is to build a world-class financial intelligence platform from India for global markets—an independent alternative that raises the standard for speed, clarity, depth, and access. The goal is simple: give every serious market participant the research environment they deserve.</p></section>
    <aside><b>Build your market edge.</b><br/>Explore the <a className="text-link" href={PRODUCT_LINKS.features}>platform features</a>, <a className="text-link" href={PRODUCT_LINKS.download}>download Quantify Terminal</a>, or <a className="text-link" href="/contact">connect with the team</a>.</aside>
  </InfoPageShell>;
}
