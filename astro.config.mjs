import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";
import db from "@astrojs/db";
import auth from "auth-astro";
import react from "@astrojs/react";

import webVitals from "@astrojs/web-vitals";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), db(), auth(), react(), webVitals()],
  output: "server",
  adapter: netlify(),
  experimental: {
    actions: true
  }
});