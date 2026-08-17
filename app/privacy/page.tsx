import type { Metadata } from "next";
import { InfoPageShell } from "@/components/info-page-shell";
import { CONTACT_EMAIL, LEGAL_UPDATED, PRODUCT_LINKS } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Quantify Terminal Newsroom handles information, browser storage, external links, and communications.", alternates: { canonical: "/privacy" } };
const sections = [
  ["1. Scope", "This policy applies to Quantify Terminal Newsroom. The desktop product and main Quantify Terminal website are covered by the separate product privacy policy linked below."],
  ["2. Information we process", "The newsroom does not currently offer user accounts, payment collection, newsletter sign-up, or a contact form. If you email us, we receive the information you choose to send. Our hosting and security infrastructure may process standard request metadata such as IP address, browser type, requested URL, timestamps, and diagnostic logs."],
  ["3. How information is used", "Information is used to operate and secure the service, diagnose reliability issues, answer messages, review corrections, and improve the newsroom. We do not sell or rent personal information."],
  ["4. Browser storage", "The site uses session storage to remember when you dismiss the Quantify Terminal promotional banner. This preference expires with the browser session. We do not currently use that preference for advertising profiles or cross-site tracking."],
  ["5. News providers and external links", "Our servers retrieve reporting and images from third-party news providers. Opening an original publisher, social channel, or product link takes you to an external service governed by its own privacy practices."],
  ["6. Retention and security", "Correspondence and technical logs may be retained only as reasonably needed for support, security, legal obligations, and service reliability. We use reasonable safeguards, but no internet transmission or storage method is completely secure."],
  ["7. Your choices and rights", `You may ask about, correct, or request deletion of personal information you directly supplied by contacting ${CONTACT_EMAIL}. Rights may vary by location and applicable law.`],
  ["8. Children", "The newsroom is a general financial-information service and is not directed to children. We do not knowingly collect personal information from children through the site."],
  ["9. Policy changes", "We may revise this policy as the newsroom changes. The revision date on this page identifies the current version."],
];

export default function PrivacyPage() { return <InfoPageShell eyebrow="LEGAL" title={<>Privacy Policy</>} lead="A clear account of the limited information used to operate and support Quantify Terminal Newsroom."><p className="legal-updated">Last updated: {LEGAL_UPDATED}</p><div className="legal-sections">{sections.map(([title, copy]) => <section key={title}><h2>{title}</h2><p>{copy}</p></section>)}</div><section><h2>10. Contact and product policy</h2><p>Privacy questions may be sent to <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Use of the desktop platform and official product website is also subject to the <a className="text-link" href={PRODUCT_LINKS.privacy}>Quantify Terminal product privacy policy</a>.</p></section></InfoPageShell>; }
