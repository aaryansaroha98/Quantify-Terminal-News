export const PUBLISHER_IMAGE_HOSTS = ["img.etimg.com", "image.cnbcfm.com", "images.cnbcfm.com", "cdn.sanity.io", "www.coindesk.com", "assets.coindesk.com"];

export function isAllowedPublisherImage(url: URL) {
  return url.protocol === "https:" && PUBLISHER_IMAGE_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
}

export function canProxyPublisherImage(src?: string) {
  if (!src) return false;
  try { return isAllowedPublisherImage(new URL(src)); } catch { return false; }
}
