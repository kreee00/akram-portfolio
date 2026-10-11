/*
  Downloads organisation logos for src/data/orgs.js into src/assets/logos/.

    npm run logos            fetch logos for orgs that don't have one yet
    npm run logos -- --force re-download every logo (overwrites)
    npm run logos -- --dry   only show what would be fetched

  Lookup order for each org:
    1. The logo on its Wikipedia page, if the org has wikipedia: set
       (usually the sharpest, official version)
    2. The icons the website itself declares (apple-touch-icon, icon, mask-icon),
       largest first
    3. /apple-touch-icon.png on the website
    4. Google's favicon service at 256px

  Skipped: orgs with neither a domain nor a wikipedia page, orgs with logo:
  set, and orgs with autoLogo: false. Website icons can be small or
  simplified, so check each saved file and replace any you don't like with an
  official logo of the same name. Orgs without a logo show their initials.
*/
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { orgs } from "../src/data/orgs.js";
import { slugify } from "../src/lib/format.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIR = path.join(ROOT, "src/assets/logos");
const FORCE = process.argv.includes("--force");
const DRY = process.argv.includes("--dry");
const HEADERS = { "User-Agent": "Mozilla/5.0 (akramfaisal.org logo fetcher; +https://akramfaisal.org)" };
const MIN = 48; /* smaller icons look blurry, so they are rejected */

async function get(url) {
  try {
    const res = await fetch(url, { headers: HEADERS, redirect: "follow", signal: AbortSignal.timeout(15000) });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

/* Downloads an image and returns it with its size, or null if it is too small or not an image. */
async function image(url) {
  const res = await get(url);
  if (!res) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  try {
    const meta = await sharp(buf, { density: 300 }).metadata();
    const size = meta.format === "svg" ? 512 : Math.min(meta.width || 0, meta.height || 0);
    if (size < MIN) return null;
    return { buf, size, url };
  } catch {
    return null; /* .ico and other formats sharp can't read */
  }
}

/* Reads <link rel="...icon..." href sizes> tags from the homepage. */
async function declaredIcons(base) {
  const res = await get(base);
  if (!res) return [];
  const html = await res.text();
  const pageUrl = res.url || base;
  const icons = [];
  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    const rel = (tag.match(/\brel=["']?([^"'>]+)/i) || [])[1] || "";
    if (!/icon/i.test(rel)) continue;
    const href = (tag.match(/\bhref=["']?([^"'\s>]+)/i) || [])[1];
    if (!href) continue;
    const sizes = (tag.match(/\bsizes=["']?(\d+)x\d+/i) || [])[1];
    const score = /svg/i.test(href) ? 1000 : Number(sizes) || (/apple/i.test(rel) ? 180 : 32);
    try { icons.push({ url: new URL(href, pageUrl).href, score }); } catch {}
  }
  return icons.sort((a, b) => b.score - a.score);
}

/* The lead image of a Wikipedia article, which for organisations is normally the logo. */
async function wikipedia(title) {
  const res = await get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`);
  if (!res) return null;
  const page = await res.json();
  const src = page.originalimage?.source || page.thumbnail?.source;
  const hit = src && await image(src);
  return hit && { ...hit, source: `Wikipedia (${page.title})` };
}

async function findOnline(org) {
  if (org.wikipedia) {
    const wiki = await wikipedia(org.wikipedia);
    if (wiki) return wiki;
  }
  const domain = org.domain;
  if (!domain) return null;
  for (const base of [`https://${domain}/`, `https://www.${domain}/`, `http://${domain}/`]) {
    for (const icon of await declaredIcons(base)) {
      const hit = await image(icon.url);
      if (hit) return { ...hit, source: "website icon" };
    }
    const touch = await image(new URL("/apple-touch-icon.png", base).href);
    if (touch) return { ...touch, source: "apple-touch-icon" };
  }
  const g = await image(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`);
  return g && { ...g, source: "Google favicon service" };
}

await mkdir(DIR, { recursive: true });
const existing = new Set((await readdir(DIR)).map((f) => f.toLowerCase().replace(/\.[^.]+$/, "")));

let got = 0, missed = 0, skipped = 0;
for (const org of orgs) {
  const slug = slugify(org.name);
  const label = `"${org.name}"`;
  const where = [org.wikipedia && "Wikipedia", org.domain].filter(Boolean).join(" or ");
  if (!where || org.logo || org.autoLogo === false) { console.log(`  skip     ${label}${where ? "" : " (no domain, shows initials)"}`); skipped++; continue; }
  if (!FORCE && existing.has(slug)) { console.log(`  have     ${label}`); skipped++; continue; }
  if (DRY) { console.log(`  would    ${label} from ${where}`); continue; }

  try {
    const hit = await findOnline(org);
    if (!hit) { console.log(`  MISSING  ${label}: nothing usable on ${where}, it will show initials`); missed++; continue; }
    /* Trim empty or white borders so the mark fills its box, then fit it in 256px. */
    const trimmed = await sharp(hit.buf, { density: 300 }).trim({ threshold: 10 }).toBuffer().catch(() => hit.buf);
    const png = await sharp(trimmed)
      .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png().toBuffer();
    await writeFile(path.join(DIR, `${slug}.png`), png);
    console.log(`  saved    ${label} -> ${slug}.png  [${hit.source}; ${hit.size}px; ${hit.url}]`);
    got++;
  } catch (e) {
    console.log(`  ERROR    ${label}: ${e.message}`);
    missed++;
  }
}
console.log(`\n${got} downloaded, ${missed} not found, ${skipped} skipped.`);
