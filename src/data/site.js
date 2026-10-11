/*
  SITE-WIDE SETTINGS: name, menu, contact, social links, blog.
  Everything here appears on every page (header and footer).
*/

export const site = {
  name: "Akram Faisal",
  fullName: "Mohamad Akram bin Mohd Faisal",
  description: "Akram Faisal, cybersecurity and DevOps engineer from Perak, Malaysia. Final-year Computer Science at UTP.",
};

/* Main menu. Order here = order in the header.
   To add a page: create src/pages/<name>.astro and add a line here. */
export const nav = [
  { label: "Home", href: "./" },
  { label: "Experience", href: "experience.html" },
  { label: "Projects", href: "projects.html" },
  { label: "Khutub Khanah", href: "library.html" },
  { label: "Résumé", href: "resume.html" },
];

/* The real email address is stored base64-encoded so scrapers that read
   the page text never see it. The page shows "display"; the Copy and
   Write buttons decode the real address only when a person clicks.
   To change it, run btoa("new.address@example.com") in a browser
   console and paste the result into emailB64. */
export const contact = {
  display: "akram.mfaisal81 [at] gmail.com",
  emailB64: "YWtyYW0ubWZhaXNhbDgxQGdtYWlsLmNvbQ==",
  headline: "Hiring for security, GRC or DevOps? Let’s talk.",
  note: "Based in Perak, working remotely with teams in Kuala Lumpur. Fluent in English and Bahasa Melayu.",
};

export const socials = [
  { label: "GitHub", handle: "kreee00", url: "https://github.com/kreee00" },
  { label: "LinkedIn", handle: "akram-mohdfaisal", url: "https://www.linkedin.com/in/akram-mohdfaisal" },
  { label: "Almanac (blog)", handle: "blog.akramfaisal.org", url: "https://blog.akramfaisal.org" },
  { label: "Website", handle: "akramfaisal.org", url: "https://akramfaisal.org" },
];

/* The home page reads the blog's rss.xml when the site is built and shows
   the newest posts. If the feed can't be reached, the list in
   src/data/articles.js is used instead. */
export const blog = {
  name: "Almanac",
  url: "https://blog.akramfaisal.org",
  archive: "https://blog.akramfaisal.org/posts",
  rss: "https://blog.akramfaisal.org/rss.xml",
};
