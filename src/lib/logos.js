/* Finds an organisation's logo in src/assets/logos/, or returns the
   initials to show on a placeholder when there is none. */
import { slugify } from "./format.js";
import { orgs } from "../data/orgs.js";

const files = import.meta.glob("../assets/logos/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}", {
  eager: true,
  import: "default",
});

const logos = new Map();
for (const [path, img] of Object.entries(files)) {
  const file = path.split("/").pop().toLowerCase();
  logos.set(file, img);
  logos.set(file.replace(/\.[^.]+$/, ""), img);
}

const initials = (name) =>
  name.replace(/\(.*?\)|,.*$/g, "").split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 3).map((w) => w[0]).join("") || "?";

/* Returns { img, short, name }. img is an imported image or null. */
export function findLogo(name) {
  const org = orgs.find((o) => o.name === name) || { name };
  let img = null;
  if (org.logo) {
    const key = org.logo.toLowerCase();
    img = logos.get(key) || logos.get(key.replace(/\.[^.]+$/, "")) || null;
    if (!img) console.warn(`[orgs] logo "${org.logo}" for "${name}" not found in src/assets/logos/`);
  } else {
    img = logos.get(slugify(name)) || null;
  }
  return { img, short: org.short || initials(name), name };
}
