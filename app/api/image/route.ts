import { NextRequest } from "next/server";

const allowedHosts = ["img.etimg.com", "image.cnbcfm.com", "images.cnbcfm.com", "cdn.sanity.io", "www.coindesk.com", "assets.coindesk.com"];
function isAllowed(url: URL) {
  return url.protocol === "https:" && allowedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
}
async function fetchImage(url: URL, redirects = 0): Promise<Response> {
  if (!isAllowed(url) || redirects > 3) return new Response("Image source not allowed", { status: 403 });
  const response = await fetch(url, { redirect: "manual", headers: { Accept: "image/avif,image/webp,image/*", "User-Agent": "QuantifyNews/1.0" }, signal: AbortSignal.timeout(8000) });
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    return location ? fetchImage(new URL(location, url), redirects + 1) : new Response("Invalid redirect", { status: 502 });
  }
  const type = response.headers.get("content-type") || "";
  const length = Number(response.headers.get("content-length") || 0);
  if (!response.ok || !type.startsWith("image/") || length > 8_000_000) return new Response("Invalid image", { status: 502 });
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > 8_000_000) return new Response("Image too large", { status: 413 });
  return new Response(bytes, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800", "Content-Length": String(bytes.byteLength) } });
}
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");
  if (!raw) return new Response("Missing image URL", { status: 400 });
  try { return await fetchImage(new URL(raw)); } catch { return new Response("Image unavailable", { status: 502 }); }
}