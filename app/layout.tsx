import type { Metadata } from "next";
import "@fontsource-variable/inter";
import { SiteFooter } from "@/components/site-footer";
import { TerminalAd } from "@/components/terminal-ad";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "Live, attributed financial and market news from established publishers, organized by category, region, company, and sector.",
  keywords: ["financial news", "market news", "stock market news", "business news", "Quantify Terminal"],
  authors: [{ name: "Quantify Terminal", url: "https://www.quantifyterminal.com/" }],
  creator: "Quantify Terminal",
  publisher: "Quantify Terminal",
  category: "finance",
  referrer: "origin-when-cross-origin",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: "/icon.png", apple: "/qt-logo.png" },
  openGraph: { title: SITE_NAME, description: "Live financial reporting with clear source attribution.", url: SITE_URL, type: "website", siteName: SITE_NAME, locale: "en_IN", images: [{ url: "/qt-logo.png", width: 256, height: 256, alt: "Quantify Terminal" }] },
  twitter: { card: "summary", title: SITE_NAME, description: "Live financial reporting with clear source attribution.", site: "@QuantifTerm", images: ["/qt-logo.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<SiteFooter/><TerminalAd/></body></html>;
}
