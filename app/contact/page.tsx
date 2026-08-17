import type { Metadata } from "next";
import { InfoPageShell } from "@/components/info-page-shell";
import { CONTACT_EMAIL, PRODUCT_LINKS } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Contact Quantify Terminal Newsroom for support, corrections, partnerships, press, and product questions.", alternates: { canonical: "/contact" } };
const channels = [
  ["Email", `mailto:${CONTACT_EMAIL}`, CONTACT_EMAIL], ["Official website", PRODUCT_LINKS.website, "quantifyterminal.com"],
  ["X", "https://x.com/QuantifTerm", "@QuantifTerm"], ["LinkedIn", "https://www.linkedin.com/company/quantify-terminal/", "Quantify Terminal"],
  ["YouTube", "https://www.youtube.com/@QuantifyTerminal", "@QuantifyTerminal"], ["Discord", "https://discord.gg/djKVhBH8cF", "Community server"],
  ["GitHub", "https://github.com/Quantify-Terminal", "Quantify-Terminal"], ["Instagram", "https://www.instagram.com/quantifyterminal/", "@quantifyterminal"],
];

export default function ContactPage() {
  return <InfoPageShell eyebrow="CONTACT" title={<>Connect with<br/>Quantify Terminal.</>} lead="Use the official channels below for newsroom corrections, product support, partnerships, press, release access, and community questions.">
    <section><h2>Get in touch</h2><div className="contact-grid">{channels.map(([name, href, detail]) => <a href={href} key={name}><span>{name}</span><b>{detail}</b><em>Open ↗</em></a>)}</div></section>
    <section><h2>Newsroom corrections</h2><p>If a headline, source, timestamp, image attribution, or link appears incorrect, email <a className="text-link" href={`mailto:${CONTACT_EMAIL}?subject=Newsroom%20correction`}>{CONTACT_EMAIL}</a> with the story URL and a short description. We will review source-level corrections against the original publisher.</p></section>
    <section><h2>Product and partnership inquiries</h2><p>For Quantify Terminal downloads, support, partnerships, press, or professional inquiries, use the same official email or visit the <a className="text-link" href={PRODUCT_LINKS.connect}>product connect page</a>.</p></section>
  </InfoPageShell>;
}
