"use client";

import { useState } from "react";

const proxiedHosts = ["img.etimg.com", "image.cnbcfm.com", "images.cnbcfm.com", "cdn.sanity.io", "www.coindesk.com", "assets.coindesk.com"];
function imageSource(src?: string) {
  if (!src) return "/news-placeholder.svg";
  try {
    const url = new URL(src);
    const proxied = proxiedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
    return proxied ? `/api/image?url=${encodeURIComponent(src)}` : src;
  } catch { return "/news-placeholder.svg"; }
}
export function NewsImage({ src, alt, priority = false }: { src?: string; alt: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <img src={failed ? "/news-placeholder.svg" : imageSource(src)} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
}