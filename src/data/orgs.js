/*
  ORGANISATIONS: companies, university and clubs that get a logo.

  name     -> must match the name used elsewhere (experience, education,
              and org in src/data/leadership.js)
  short    -> initials shown on the placeholder until a logo exists
  domain   -> the organisation's website, e.g. "utp.edu.my". `npm run logos`
              looks for the logo there. Leave "" if there is no website.
  wikipedia-> OPTIONAL. Wikipedia article title; its logo is tried first
              (sharper than website icons), e.g. "Universiti Teknologi Petronas".
  logo     -> OPTIONAL. Use a specific file in src/assets/logos/,
              e.g. "my-logo.png" (or another org's file to share a logo).
  autoLogo -> OPTIONAL. Set to false so `npm run logos` leaves this one alone.

  Logos live in src/assets/logos/, named after the org, e.g.
  "Universiti Teknologi PETRONAS" -> universiti-teknologi-petronas.png.
  Drop your own file there with that name and it is used instead.
*/

export const orgs = [
  { name: "ERS Energy Sdn Bhd", short: "ERS", domain: "ers.my" },
  { name: "Universiti Teknologi PETRONAS", short: "UTP", domain: "utp.edu.my", wikipedia: "Universiti Teknologi Petronas" },
  { name: "Axiata ULDP", short: "AX", domain: "axiata.com" },
  { name: "Dewan Belia Perak", short: "DBP", domain: "dewanbelia.perak.my" },
  { name: "Parti Generasi Progresif (PGP) Perak", short: "PGP", domain: "" },
  { name: "CYBERHAX UTP", short: "CH", domain: "" },
  { name: "Student Representative Council, UTP", short: "SRC", domain: "" },
  { name: "INTERWOVEN", short: "IW", domain: "" },
];
