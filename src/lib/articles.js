/* Reads the newest posts from the blog's RSS feed when the site is built.
   Falls back to src/data/articles.js if the feed can't be reached. */
import { blog } from "../data/site.js";
import { articles as fallback } from "../data/articles.js";

function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}\b[^>]*>([\s\S]*?)</${name}>`, "i"));
  if (!m) return "";
  return m[1].replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1").trim();
}
function decode(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&");
}

let cached;
export async function getArticles() {
  if (cached) return cached;
  cached = fallback;
  if (!blog.rss) return cached;
  try {
    const res = await fetch(blog.rss, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = [...xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/gi)].map(([node]) => {
      const href = node.match(/<link\b[^>]*href="([^"]+)"/i);
      let summary = decode(decode(tag(node, "description") || tag(node, "summary"))).replace(/<[^>]+>/g, "").trim();
      if (summary.length > 160) summary = summary.slice(0, 157).replace(/\s+\S*$/, "") + "...";
      return {
        title: decode(tag(node, "title")),
        url: href ? href[1] : tag(node, "link"),
        date: tag(node, "pubDate") || tag(node, "published") || tag(node, "updated"),
        summary,
      };
    }).filter((a) => a.title && a.url);
    if (items.length) cached = items;
  } catch (e) {
    console.warn(`[articles] couldn't read ${blog.rss} (${e.message}); using src/data/articles.js`);
  }
  return cached;
}
