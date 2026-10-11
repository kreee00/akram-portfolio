const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return String(d.getUTCDate()).padStart(2, "0") + " " + MONTHS[d.getUTCMonth()] + " " + d.getUTCFullYear();
}

export function isoDate(v) {
  const d = new Date(v);
  return isNaN(d) ? v : d.toISOString().slice(0, 10);
}

/* "Atomic Habits" -> "atomic-habits". Keeps non-Latin letters (Arabic, Jawi ...). */
export function slugify(s) {
  return String(s || "")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
