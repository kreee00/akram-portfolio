/*
  PROJECTS
  category -> groups projects on the Projects page (a new name makes a new group)
  featured -> also shown on the home page (pick about 3)
  facts    -> small label/value pairs on the right
  details  -> extra rows on the Projects page
  link     -> "" if there is no public link
*/

export const projects = [
  {
    id: "dockvault",
    title: "DockVault+",
    kind: "Final year project · In development",
    category: "Software",
    featured: true,
    summary: "A command-line tool for backing up Docker volumes, written in Go, with ML-assisted security scanning of the data it handles. It runs natively on Windows and Linux without WSL2.",
    details: [
      ["Design", "Direct Go execution with native Windows and Linux support, so it needs no WSL2."],
      ["Outcome", "Installation guide written and pitched for production use at ERS Energy."],
    ],
    facts: [["Stack", "Go, Docker"], ["Status", "In development"]],
    link: "",
  },
  {
    id: "oral-odyssey",
    title: "Oral Odyssey",
    kind: "Health innovation · 2026",
    category: "Software",
    featured: true,
    summary: "A bilingual, retro arcade-style web app that teaches dental health through games, built with a Ministry of Health (KKM) dental team.",
    details: [
      ["Format", "Installable progressive web app in Bahasa Malaysia and English."],
      ["Outcome", "Entered in a Perak state innovation competition, October 2026."],
    ],
    facts: [["Role", "Platform developer"], ["Type", "PWA"]],
    link: "",
  },
  {
    id: "studyos",
    title: "StudyOS",
    kind: "Personal tool",
    category: "Software",
    featured: false,
    summary: "A study app I built for my cloud computing and CECL courses.",
    details: [["Hosting", "Deployed on Vercel behind Cloudflare."]],
    facts: [["Stack", "Vite, React"], ["Type", "Web app"]],
    link: "https://studyos.akramfaisal.org",
  },
  {
    id: "labs",
    title: "Interactive study labs",
    kind: "Coursework",
    category: "Software",
    featured: false,
    summary: "Single-file HTML labs for information security management and cloud courses, with interactive exercises and automated smoke tests that confirm every component still works.",
    details: [],
    facts: [["Stack", "HTML, JavaScript"], ["Type", "Learning tool"]],
    link: "",
  },
  {
    id: "odoo",
    title: "Self-hosted Odoo blueprint",
    kind: "ERS Energy · Architecture",
    category: "Infrastructure",
    featured: false,
    summary: "An SRE-style plan for running Odoo Community Edition on company infrastructure.",
    details: [
      ["Platform", "Proxmox hosts running Docker services."],
      ["Resilience", "3-2-1 backups: three copies, two media, one off-site."],
      ["Monitoring", "Prometheus metrics, Grafana dashboards and Alertmanager alerts."],
    ],
    facts: [["Stack", "Proxmox, Docker, Prometheus, Grafana"], ["Type", "Design document"]],
    link: "",
  },
  {
    id: "workshop",
    title: "Youth cybersecurity workshop",
    kind: "Outreach",
    category: "Teaching",
    featured: true,
    summary: "An introduction to cybersecurity for secondary school students. I planned the modules, built the challenges and ran the infrastructure.",
    details: [
      ["Modules", "Cryptography and OSINT challenges."],
      ["Platform", "CTFd in Docker on a Linode VPS."],
    ],
    facts: [["Stack", "CTFd, Docker, Linode"], ["Role", "Organiser"]],
    link: "",
  },
  {
    id: "forensics",
    title: "Memory forensics workshop",
    kind: "CYBERHAX UTP",
    category: "Teaching",
    featured: false,
    summary: "A hands-on session on analysing memory dumps with Volatility3, the same skill set I use in blue-team CTFs.",
    details: [],
    facts: [["Tool", "Volatility3"], ["Role", "Instructor"]],
    link: "",
  },
];
