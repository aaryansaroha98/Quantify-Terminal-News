"use client";

import { useState } from "react";
import { canProxyPublisherImage } from "@/lib/image-policy";

function imageSource(src?: string) {
  if (!src) return "/news-placeholder.svg";
  try { return canProxyPublisherImage(src) ? `/api/image?url=${encodeURIComponent(src)}` : new URL(src).toString(); }
  catch { return "/news-placeholder.svg"; }
}
export function NewsImage({ src, alt, priority = false }: { src?: string; alt: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <img src={failed ? "/news-placeholder.svg" : imageSource(src)} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
}