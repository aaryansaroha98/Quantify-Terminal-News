import type { Metadata } from "next";
import { InfoPageShell } from "@/components/info-page-shell";
import { CONTACT_EMAIL, LEGAL_UPDATED, PRODUCT_LINKS } from "@/lib/site";

export const metadata: Metadata = { title: "Terms & Conditions", description: "Terms governing access to and use of Quantify Terminal Newsroom.", alternates: { canonical: "/terms" } };
const sections = [
  ["1. Acceptance", "By accessing or using Quantify Terminal Newsroom, you agree to these terms and applicable laws. If you do not agree, do not use the service."],
  ["2. Informational purpose", "The newsroom organizes financial reporting for general information and research. It does not provide financial, investment, legal, accounting, or tax advice, and no content is a recommendation to buy, sell, or hold any asset."],
  ["3. Third-party reporting", "Headlines, summaries, images, timestamps, and source links may originate from independent publishers and data services. Rights remain with their respective owners. Verify important information with the original publisher, issuer filing, exchange, regulator, or other primary source."],
  ["4. Accuracy and availability", "We work to keep feeds timely and links accurate, but do not guarantee that content is complete, current, uninterrupted, error-free, or available in every location. Reports may be delayed, changed, removed, duplicated, or classified incorrectly."],
  ["5. Permitted use", "You may use the newsroom for lawful personal or professional research. You may not disrupt the service, bypass security controls, scrape it at harmful volumes, misrepresent content or attribution, introduce malicious code, or use the service to violate another party's rights."],
  ["6. Intellectual property", "Quantify Terminal branding, site design, software, and original materials are protected by applicable intellectual-property laws. Third-party publisher content is not transferred to Quantify Terminal or to users."],
  ["7. External services", "Links and integrations lead to independent publishers, social platforms, and product services. We do not control and are not responsible for their content, availability, security, terms, or privacy practices."],
  ["8. Disclaimer and liability", "The newsroom is provided on an as-is and as-available basis. To the maximum extent permitted by applicable law, Quantify Terminal disclaims implied warranties and is not liable for losses arising from reliance on content, market decisions, service interruption, or third-party services."],
  ["9. Changes and termination", "We may change, suspend, or discontinue features and may update these terms. Continued use after an update means you accept the revised terms."],
];

export default function TermsPage() { return <InfoPageShell eyebrow="LEGAL" title={<>Terms &amp; Conditions</>} lead="The rules and important limitations governing use of Quantify Terminal Newsroom."><p className="legal-updated">Last updated: {LEGAL_UPDATED}</p><div className="legal-sections">{sections.map(([title, copy]) => <section key={title}><h2>{title}</h2><p>{copy}</p></section>)}</div><section><h2>10. Contact and product terms</h2><p>Questions may be sent to <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. The Quantify Terminal desktop platform and main product website are governed by the separate <a className="text-link" href={PRODUCT_LINKS.terms}>product Terms of Use</a>.</p></section></InfoPageShell>; }
