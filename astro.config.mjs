// @ts-check
import { defineConfig } from 'astro/config';

// Deployed as a GitHub Pages user site (quocnghia32.github.io), so base stays '/'.
export default defineConfig({
  site: 'https://quocnghia32.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
