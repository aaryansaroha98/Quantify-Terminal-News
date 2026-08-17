export const SITE_NAME = "Quantify Terminal Newsroom";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://news.quantifyterminal.com").replace(/\/$/, "");
export const CONTACT_EMAIL = "contact@quantifyterminal.com";
export const LEGAL_UPDATED = "August 18, 2026";

export const CATEGORY_DESKS: Record<string, string> = {
  markets: "Markets",
  stocks: "Stocks",
  india: "India",
  "us-markets": "US Markets",
  "global-markets": "Global Markets",
  economy: "Economy",
  companies: "Companies",
  crypto: "Crypto",
  commodities: "Commodities",
  technology: "Technology",
  geopolitics: "Geopolitics",
  earnings: "Earnings",
  ipo: "IPO",
  "m-and-a": "M&A",
  "central-banks": "Central Banks",
};

export const SECTOR_DESKS: Record<string, string> = {
  technology: "Technology",
  financials: "Financials",
  energy: "Energy",
  healthcare: "Healthcare",
  automotive: "Automotive",
  consumer: "Consumer",
  industrials: "Industrials",
  "real-estate": "Real Estate",
  media: "Media",
  telecom: "Telecom",
};

export const CATEGORY_LABELS = ["All News", ...Object.values(CATEGORY_DESKS)];
export const SECTOR_LABELS = Object.values(SECTOR_DESKS);

export const PRODUCT_LINKS = {
  website: "https://www.quantifyterminal.com/",
  features: "https://www.quantifyterminal.com/features",
  documentation: "https://www.quantifyterminal.com/documentation",
  download: "https://www.quantifyterminal.com/download",
  about: "https://www.quantifyterminal.com/about",
  connect: "https://www.quantifyterminal.com/connect",
  privacy: "https://www.quantifyterminal.com/privacy",
  terms: "https://www.quantifyterminal.com/terms",
} as const;
