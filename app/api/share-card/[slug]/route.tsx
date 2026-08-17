import { ImageResponse } from "next/og";
import { getStoryBySlug } from "@/lib/news";
import { canProxyPublisherImage } from "@/lib/image-policy";

export const revalidate = 3600;
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{12,180}$/.test(slug)) return new Response("Invalid story", { status: 400 });
  const story = await getStoryBySlug(slug); if (!story) return new Response("Story not found", { status: 404 });
  const url = new URL(request.url); const instagram = url.searchParams.get("format") === "instagram";
  const width = instagram ? 1080 : 1200; const height = instagram ? 1350 : 630;
  const publisherImage = canProxyPublisherImage(story.image) ? `${url.origin}/api/image?url=${encodeURIComponent(story.image!)}` : undefined;
  const headline = story.headline.length > 170 ? `${story.headline.slice(0, 167)}…` : story.headline;
  const fontSize = instagram ? (headline.length > 105 ? 56 : 68) : (headline.length > 105 ? 45 : 56);
  const imagePanel = publisherImage ? <div style={{ display: "flex", position: "relative", width: instagram ? "100%" : "43%", height: instagram ? "50%" : "100%", overflow: "hidden", background: "#e9ede7" }}><img src={publisherImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/><div style={{ position: "absolute", inset: 0, background: instagram ? "linear-gradient(180deg,transparent 50%,rgba(17,21,16,.72))" : "linear-gradient(90deg,transparent 55%,rgba(17,21,16,.28))" }}/></div> : <div style={{ display: "flex", width: instagram ? "100%" : "38%", height: instagram ? "34%" : "100%", background: "linear-gradient(135deg,#b9ed32,#edf7d4 52%,#111510)", alignItems: "center", justifyContent: "center", fontSize: instagram ? 150 : 120, fontWeight: 800, color: "#111510" }}>QT</div>;
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: instagram ? "column" : "row", background: "#111510", color: "white", fontFamily: "Arial, sans-serif" }}>{imagePanel}<div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", padding: instagram ? "58px 64px 54px" : "55px 58px 46px" }}><div style={{ display: "flex", color: "#b9ed32", fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>{story.category.toUpperCase()} · {story.source.toUpperCase()}</div><div style={{ display: "flex", fontSize, fontWeight: 750, lineHeight: 1.08, letterSpacing: -2 }}>{headline}</div><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #3a4238", paddingTop: 22 }}><div style={{ display: "flex", fontSize: 24, fontWeight: 750 }}>Quantify Terminal <span style={{ color: "#9da69a", fontWeight: 500, marginLeft: 10 }}>Newsroom</span></div><div style={{ display: "flex", color: "#9da69a", fontSize: 15, letterSpacing: 1 }}>MARKETS · RESEARCH · INTELLIGENCE</div></div></div></div>, { width, height, headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
