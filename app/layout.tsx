import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quantify News — Market Intelligence, Not Noise",
  description: "Fast, market-oriented news briefs with impact, affected assets, and what matters next.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://news.quantifyterminal.com"),
  openGraph: {
    title: "Quantify News",
    description: "Market intelligence, not noise.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}