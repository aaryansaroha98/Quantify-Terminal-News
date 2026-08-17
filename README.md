# Quantify Terminal Newsroom

A live, market-oriented financial newsroom for Quantify Terminal.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Live newsroom

- **News:** Economic Times market RSS, CNBC RSS, and CoinDesk RSS.
- **Global fallback:** GDELT's public news index when primary feeds are sparse.
- **Refresh:** Browser and server aggregation update every 15 seconds.
- **Live headline ticker:** The latest 10 real stories move continuously and refresh without reloading the page.
- **Images:** Publisher-provided RSS/GDELT images with a resilient local Quantify fallback.
- **Global clocks:** Live New Delhi, London, New York, Tokyo, and Sydney clocks.
- **Pages:** Top stories, category desks, sector desks, latest news, sourced story pages, source transparency, editorial methodology, About, Contact, Privacy Policy, and Terms & Conditions.
- **Discovery:** Canonical metadata, `robots.txt`, and a revalidated XML sitemap covering every permanent page, category, and sector route.

No article feed is hardcoded. Publisher headlines, images, summaries, timestamps, and links remain attributed. Automated investment analysis is intentionally disabled until a reviewed AI analysis service is connected.

## Deployment

The app is compatible with Vercel's Next.js deployment. Connect this repository in Vercel and use the default build command (`npm run build`).

Before a commercial public launch, obtain written redistribution rights from each publisher and confirm image-republication rights.