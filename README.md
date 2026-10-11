# akramfaisal.org portfolio

Built with [Astro](https://astro.build). Every page is made of small section files, so you can add, remove or reorder a section by editing one line.

## Run it

```sh
npm install        # once
npm run dev        # live preview at http://localhost:4321
npm run build      # outputs the finished site to dist/
```

## Deploy (Cloudflare, straight from GitHub)

`wrangler.jsonc` tells Cloudflare to serve the `dist/` folder, so the same setup works from the dashboard and from `npx wrangler`.

**Automatic deploys on every push:** in the Cloudflare dashboard go to *Workers & Pages → Create → Import a repository*, pick `kreee00/akram-portfolio`, and use:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

Then add `akramfaisal.org` under the project's *Settings → Domains & Routes*.

**From your computer:**

```sh
npx wrangler login        # once
npm run deploy            # builds, then runs wrangler deploy
npm run cf:preview        # builds and previews exactly as Cloudflare will serve it
```

Old links such as `/library.html` redirect to `/library`, and unknown URLs show the 404 page.

## How it's organised

| Folder | What's in it |
|---|---|
| `src/pages/` | One file per page. Each is just a list of sections. |
| `src/sections/` | One file per section (Hero, About, Skills, Bookshelf ...). |
| `src/components/` | Building blocks shared by sections (Section, Book, BookCover, ProjectItem ...). |
| `src/layouts/Base.astro` | The `<head>`, header and footer around every page. |
| `src/data/` | **The content you edit most**: projects, leadership, books, articles, references, site settings and menu. |
| `src/assets/covers/` | **Book covers.** Drop images here. |
| `src/assets/headshot.jpg` | Your photo (portrait, about 800 x 1000 px). Until it exists the site shows an "AF" monogram. |
| `src/styles/global.css` | Design. |
| `public/scripts/main.js` | Theme toggle and the email buttons. |

## Add, remove or reorder sections

Open the page, e.g. `src/pages/index.astro`:

```astro
<Base>
  <Hero />
  <About />
  <Skills />          <!-- delete this line to hide Skills -->
  <ShelfPreview limit={4} />
</Base>
```

To make a new section, create `src/sections/Awards.astro`:

```astro
---
import Section from "../components/Section.astro";
---
<Section label="Awards" note="Optional line under the label">
  <p>Anything you like.</p>
</Section>
```

Then import it in a page (`import Awards from "../sections/Awards.astro";`) and add `<Awards />` where you want it. The same section can be used on several pages.

**New page:** copy `src/pages/projects.astro` to `src/pages/talks.astro`, change the sections, and add `{ label: "Talks", href: "talks.html" }` to `nav` in `src/data/site.js`.

## Everyday edits (all in `src/data/`)

- **Project** (`projects.js`): copy a `{ ... },` block. `featured: true` also shows it on the home page. `category` sets its group on the Projects page.
- **Leadership role** (`leadership.js`): `featured: true` shows it on the home page. `points` are the bullets on the Experience page.
- **Book** (`books.js`): `status: "reading"` or `"read"`. Paste your Almanac review link into `review`. Delete the three `example: true` entries first.

## Book covers

### Fetch them automatically

Add each book to `src/data/books.js` with its `title`, `author` and, ideally, its `isbn`, then run:

```sh
npm run covers            # download covers for books that don't have one yet
npm run covers -- --dry   # just list what it would look up
npm run covers -- --force # re-download all of them
```

It tries Open Library (free, no key) by ISBN first, then by title and author. If you set a `GOOGLE_BOOKS_API_KEY` environment variable (a free key from Google Cloud with the "Books API" enabled), it also tries Google Books. Each saved cover is printed with what it matched. A title search can occasionally pick a different edition, so glance at the result and delete or replace any you don't like. Books it can't find keep their generated cover. Covers you already have are never overwritten unless you pass `--force`.

Run it on your computer and commit the downloaded images. The build doesn't go online for covers.

### Or add your own

1. Save the cover image into `src/assets/covers/`.
2. Either name it after the title (`Atomic Habits` becomes `atomic-habits.jpg`), or set `cover: "whatever.jpg"` on the book.
3. Rebuild. The image is resized and converted to webp automatically.

A book without a cover gets a generated cloth-bound cover: a deep book-cloth colour, gold-foil title and author, and one of three classic layouts. The colour comes from the title, so it stays the same on every build. To pick a colour yourself, add `color: "#1f3a5f"`. Books you're reading get a red ribbon bookmark.

## Blog posts

At build time the home page reads `https://blog.akramfaisal.org/rss.xml` and shows the newest three posts. No CORS setup is needed. If the feed can't be reached, it falls back to `src/data/articles.js`. New posts appear the next time the site is rebuilt. You can automate that with a Cloudflare Pages deploy hook triggered from the blog's deploy.

## Email address (hidden from scrapers)

The address is stored base64-encoded in `src/data/site.js` (`contact.emailB64`) and only decoded when someone clicks "Copy email" or "Write an email". To change it, run `btoa("new.address@example.com")` in a browser console, paste the result into `emailB64`, and update `display`.

## Résumé and experience text

The résumé is `src/sections/ResumeSheet.astro`. Work history is `src/sections/WorkHistory.astro`, and certifications and CTF results are lists at the top of their own section files.
