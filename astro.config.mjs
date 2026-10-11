// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://akramfaisal.org",
  // Build experience.html, projects.html ... so existing links keep working.
  build: { format: "file" },
});
