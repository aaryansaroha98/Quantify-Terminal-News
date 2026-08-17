import type { MetadataRoute } from "next";
import { CATEGORY_DESKS, SECTOR_DESKS, SITE_URL } from "@/lib/site";

export const revalidate = 900;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/latest`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: "2026-08-18", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: "2026-08-18", changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/sources`, lastModified: "2026-08-18", changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/methodology`, lastModified: "2026-08-18", changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: "2026-08-18", changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: "2026-08-18", changeFrequency: "yearly", priority: 0.3 },
  ];
  const categories: MetadataRoute.Sitemap = Object.keys(CATEGORY_DESKS).map((slug) => ({ url: `${SITE_URL}/category/${slug}`, lastModified: now, changeFrequency: "hourly", priority: 0.8 }));
  const sectors: MetadataRoute.Sitemap = Object.keys(SECTOR_DESKS).map((slug) => ({ url: `${SITE_URL}/sector/${slug}`, lastModified: now, changeFrequency: "hourly", priority: 0.75 }));
  return [...staticRoutes, ...categories, ...sectors];
}
