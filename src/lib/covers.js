/* Finds a book's cover image in src/assets/covers/, or designs a
   cloth-bound cover for it when there is none. */
import { slugify } from "./format.js";

const files = import.meta.glob("../assets/covers/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}", {
  eager: true,
  import: "default",
});

const covers = new Map();
for (const [path, img] of Object.entries(files)) {
  const file = path.split("/").pop().toLowerCase();
  covers.set(file, img);
  covers.set(file.replace(/\.[^.]+$/, ""), img);
}

/* Returns an imported image, a remote URL string, or null. */
export function findCover(book) {
  if (book.cover) {
    if (/^https?:\/\//.test(book.cover)) return book.cover;
    const key = book.cover.toLowerCase();
    const hit = covers.get(key) || covers.get(key.replace(/\.[^.]+$/, ""));
    if (!hit) console.warn(`[books] cover "${book.cover}" for "${book.title}" not found in src/assets/covers/`);
    return hit || null;
  }
  return covers.get(slugify(book.title)) || null;
}

/* Book-cloth colours that all carry light foil lettering. */
const CLOTHS = [
  "#7a2e2e", // oxblood
  "#1f3a5f", // navy
  "#2f4f3a", // bottle green
  "#6f5414", // mustard
  "#4a2f4f", // plum
  "#1d4f4c", // teal
  "#5a3b28", // tan leather
  "#3b3f46", // slate
  "#8a3b25", // rust
  "#2b4a6b", // steel blue
  "#5b2a3d", // claret
  "#3d4a22", // olive
];

function hash(s) {
  let h = 2166136261;
  for (const ch of String(s)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/* Same title -> same colour and layout on every build. */
export function generatedCover(book) {
  const h = hash(book.title + "|" + (book.author || ""));
  return {
    color: book.color || CLOTHS[h % CLOTHS.length],
    variant: (h >>> 8) % 3,
  };
}
