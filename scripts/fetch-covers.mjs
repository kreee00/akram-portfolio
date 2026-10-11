/*
  Downloads book covers for src/data/books.js into src/assets/covers/.

    npm run covers            fetch covers for books that don't have one yet
    npm run covers -- --force re-download every cover (overwrites)
    npm run covers -- --dry   only show what would be fetched

  Lookup order for each book:
    1. Open Library cover by ISBN
    2. Open Library search by ISBN (finds covers from other editions)
    3. Open Library search by title + author
    4. Google Books, only if GOOGLE_BOOKS_API_KEY is set (free key from
       console.cloud.google.com, "Books API")

  Skipped: books with cover: set, books marked example: true, and books
  with autoCover: false. Title searches can pick the wrong edition, so
  check the "matched" line in the output and replace or delete any cover
  you don't like. Downloaded files are yours to keep and commit.
*/
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { books } from "../src/data/books.js";
import { slugify } from "../src/lib/format.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIR = path.join(ROOT, "src/assets/covers");
const FORCE = process.argv.includes("--force");
const DRY = process.argv.includes("--dry");
const GKEY = process.env.GOOGLE_BOOKS_API_KEY;
const HEADERS = { "User-Agent": "akramfaisal.org cover fetcher (https://akramfaisal.org)" };

const cleanIsbn = (v) => String(v || "").replace(/[^0-9Xx]/g, "").toUpperCase();

async function get(url) {
  const res = await fetch(url, { headers: HEADERS, redirect: "follow", signal: AbortSignal.timeout(20000) });
  return res.ok ? res : null;
}

/* Downloads an image and rejects blanks and placeholders. */
async function image(url) {
  const res = await get(url);
  if (!res) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  try {
    const { width, height } = await sharp(buf).metadata();
    if (!width || width < 90 || height < 120) return null;
    return buf;
  } catch {
    return null;
  }
}

async function olSearch(params) {
  const q = new URLSearchParams({ ...params, fields: "title,author_name,cover_i", limit: "5" });
  const res = await get(`https://openlibrary.org/search.json?${q}`);
  if (!res) return null;
  const doc = (await res.json()).docs?.find((d) => d.cover_i);
  if (!doc) return null;
  const buf = await image(`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`);
  return buf && { buf, source: "Open Library", matched: `${doc.title} / ${(doc.author_name || []).join(", ")}` };
}

async function google(book, isbn) {
  if (!GKEY) return null;
  const q = isbn ? `isbn:${isbn}` : `intitle:${book.title}${book.author ? ` inauthor:${book.author}` : ""}`;
  const res = await get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=5&key=${GKEY}`);
  if (!res) return null;
  const item = (await res.json()).items?.find((i) => i.volumeInfo?.imageLinks);
  if (!item) return null;
  const links = item.volumeInfo.imageLinks;
  const url = (links.extraLarge || links.large || links.medium || links.thumbnail)
    .replace(/^http:/, "https:").replace(/&edge=curl/, "") + "&fife=w800";
  const buf = await image(url);
  return buf && { buf, source: "Google Books", matched: `${item.volumeInfo.title} / ${(item.volumeInfo.authors || []).join(", ")}` };
}

async function findOnline(book) {
  const isbn = cleanIsbn(book.isbn);
  if (isbn) {
    const buf = await image(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`);
    if (buf) return { buf, source: "Open Library", matched: `ISBN ${isbn}` };
    const byIsbn = await olSearch({ isbn });
    if (byIsbn) return byIsbn;
  }
  const byTitle = await olSearch(book.author ? { title: book.title, author: book.author } : { title: book.title })
    || (book.author ? await olSearch({ title: book.title }) : null);
  if (byTitle) return byTitle;
  return (await google(book, isbn)) || (isbn ? await google(book, "") : null);
}

await mkdir(DIR, { recursive: true });
const existing = new Set((await readdir(DIR)).map((f) => f.toLowerCase().replace(/\.[^.]+$/, "")));

let got = 0, missed = 0, skipped = 0;
for (const book of books) {
  const slug = slugify(book.title);
  const label = `"${book.title}"`;
  if (book.example || book.autoCover === false || book.cover) { skipped++; continue; }
  if (!FORCE && existing.has(slug)) { console.log(`  have     ${label}`); skipped++; continue; }
  if (DRY) { console.log(`  would    ${label}${book.isbn ? ` (ISBN ${book.isbn})` : ""}`); continue; }

  try {
    const hit = await findOnline(book);
    if (!hit) { console.log(`  MISSING  ${label}: no cover found, it will use a generated cover`); missed++; continue; }
    await writeFile(path.join(DIR, `${slug}.jpg`), await sharp(hit.buf).jpeg({ quality: 88 }).toBuffer());
    console.log(`  saved    ${label} -> ${slug}.jpg  [${hit.source}; matched ${hit.matched}]`);
    got++;
  } catch (e) {
    console.log(`  ERROR    ${label}: ${e.message}`);
    missed++;
  }
}
console.log(`\n${got} downloaded, ${missed} not found, ${skipped} skipped.${GKEY ? "" : " (Set GOOGLE_BOOKS_API_KEY to also search Google Books.)"}`);
