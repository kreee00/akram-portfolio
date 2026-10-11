/*
  KHUTUB KHANAH (BOOKSHELF)

  status   -> "reading" or "read"
  year     -> year you finished it ("" if still reading)
  review   -> link to your review on the blog, or ""
  language -> "EN", "BM", "AR" ...
  isbn     -> OPTIONAL but recommended: lets `npm run covers` find the
              exact edition online, e.g. "978-0735211292" (dashes are fine).
  cover    -> OPTIONAL. Covers live in src/assets/covers/.
              Three ways to get one:
                1. Run `npm run covers`. It downloads covers from Open
                   Library for every book that doesn't have one yet
                   (by ISBN, or by title + author if there's no ISBN).
                2. Name your own image after the title and it's picked up
                   automatically, e.g. "Atomic Habits" -> atomic-habits.jpg
                3. Or set cover: "any-file-name.png" here.
              jpg, jpeg, png, webp and avif all work, at any size: the
              build shrinks them. With no cover, the book gets a cloth-bound
              cover in a colour picked from its title (the same colour on
              every build).
  color    -> OPTIONAL. Force the generated cover's colour, e.g. "#7a2e2e".
  autoCover-> OPTIONAL. Set to false so `npm run covers` leaves this book
              alone (it keeps the generated cover).
  example  -> true marks a placeholder entry (shown greyed out).
*/

export const books = [
  {
    title: "The Story Of My Life",
    author: "Helen Keller",
    status: "reading",
    year: "",
    topic: "Memoir",
    language: "EN",
    review: "",
  },
  {
    title: "Islam Dan Pluralisme Agama: Memperkukuh Tauhid Pada Zaman Kekeliruan",
    author: "Khalif Muammar A. Harris",
    status: "read",
    year: "",
    topic: "Islamic thought",
    language: "BM",
    review: "",
  },
  {
    title: "Megalothymia Politik Ketuanan Melayu",
    author: "Firdaus Zainal",
    status: "read",
    year: "",
    topic: "Politics",
    language: "BM",
    review: "",
  },
];
