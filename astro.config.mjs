// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed as a GitHub Pages user site (quocnghia32.github.io), so base stays '/'.
export default defineConfig({
  site: 'https://quocnghia32.github.io',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) })],
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
