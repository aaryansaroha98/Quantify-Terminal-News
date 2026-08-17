import type { Metadata } from "next";
import { InfoPageShell } from "@/components/info-page-shell";
import { CONTACT_EMAIL, PRODUCT_LINKS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = { title: "About Us", description: "About Quantify Terminal Newsroom and its mission to organize attributed financial reporting.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  const schema = { "@context": "https://schema.org", "@type": "Organization", name: "Quantify Terminal", url: PRODUCT_LINKS.website, email: CONTACT_EMAIL, subOrganization: { "@type": "NewsMediaOrganization", name: "Quantify Terminal Newsroom", url: SITE_URL } };
  return <InfoPageShell eyebrow="ABOUT US" title={<>Financial news,<br/>built into a broader research vision.</>} lead="Quantify Terminal Newsroom is the live financial-news publication of Quantify Terminal, created to make market-relevant reporting easier to discover, verify, and continue researching.">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}/>
    <section><h2>Our purpose</h2><p>Markets produce more information than any investor can follow. The newsroom organizes current reporting by market, company, region, category, and sector while preserving the original publisher, timestamp, summary, image, and source link.</p></section>
    <section><h2>Part of Quantify Terminal</h2><p><a className="text-link" href={PRODUCT_LINKS.website}>Quantify Terminal</a> is a professional market-intelligence workspace unifying research, portfolio intelligence, alerts, screeners, strategy, news, maps, and global context. The newsroom is the public news layer of that product ecosystem: start with a verified report here, then continue deeper research in the Terminal.</p></section>
    <section><h2>How we work</h2><div className="source-cards"><div><b>Attribution first</b><p>Third-party reporting is clearly identified and linked to its original publisher.</p></div><div><b>Market relevance</b><p>Coverage is filtered for companies, economies, policy, technology, commodities, and digital assets.</p></div><div><b>No invented analysis</b><p>We do not show synthetic recommendations or unsupported AI-generated market impact.</p></div><div><b>Transparent systems</b><p>Our sources and editorial processing are documented publicly.</p></div></div></section>
    <section><h2>Built from India, designed for global markets</h2><p>Quantify Terminal was founded by Aaryan Saroha with a long-term focus on financial technology, quantitative finance, and data-driven market intelligence. Read the <a className="text-link" href={PRODUCT_LINKS.about}>official founder profile</a> or <a className="text-link" href="/contact">connect with the team</a>.</p></section>
  </InfoPageShell>;
}
