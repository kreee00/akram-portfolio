/*
  BLOG ARTICLES (fallback). Used only when the blog's RSS feed can't be
  read at build time. Newest first.
*/

export const articles = [
  {
    title: "My No-Nonsense Guide to Setting Up SEEDLab Ubuntu on VMware",
    url: "https://blog.akramfaisal.org/posts/seedubuntu-lab-installation",
    date: "2026-01-28",
    summary: "Installing the SEED Labs security education environment on VMware instead of VirtualBox, step by step.",
  },
  {
    title: "Automating the Unfixable: How I Tamed a Critical Polkitd Memory Leak",
    url: "https://blog.akramfaisal.org/posts/polkitd-memory-management",
    date: "2025-12-09",
    summary: "A production server kept leaking memory through polkitd. This is how I automated the mitigation.",
  },
  {
    title: "picoCTF: Hidden in Plainsight Writeup",
    url: "https://blog.akramfaisal.org/posts/picoctf-hidden-in-plainsight-writeup",
    date: "2025-10-28",
    summary: "A forensics challenge writeup: finding the hidden payload and extracting the flag.",
  },
];
