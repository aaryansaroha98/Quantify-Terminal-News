export type Story = {
  id: string;
  slug: string;
  headline: string;
  summary: string;
  body?: string;
  category: string;
  sector?: string;
  source: string;
  sourceUrl: string;
  image?: string;
  publishedAt: string;
  tickers: string[];
};