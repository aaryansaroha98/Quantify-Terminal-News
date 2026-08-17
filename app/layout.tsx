import type { Metadata } from "next";
import "@fontsource-variable/inter";
import { TerminalAd } from "@/components/terminal-ad";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Quantify Terminal Newsroom", template: "%s | Quantify Terminal Newsroom" },
  description: "Live, attributed financial and market news from established publishers.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://news.quantifyterminal.com"),
  icons: { icon: "/icon.png", apple: "/qt-logo.png" },
  openGraph: {
    title: "Quantify Terminal Newsroom",
    description: "Live financial reporting with clear source attribution.",
    type: "website",
    siteName: "Quantify Terminal Newsroom",
    images: ["/qt-logo.png"],
  },
  twitter: { card: "summary", title: "Quantify Terminal Newsroom", description: "Live financial reporting with clear source attribution.", images: ["/qt-logo.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<TerminalAd /></body></html>;
}