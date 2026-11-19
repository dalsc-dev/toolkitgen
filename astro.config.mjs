// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://toolkitgen.com',
  output: 'static',
  trailingSlash: 'never',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  build: {
    format: 'file'
  },
  integrations: [preact()],
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'clean-banned-glyphs',
        transform(code) {
          if (code.includes('\u2192')) {
            return { code: code.replace(/\u2192/g, '->'), map: null };
          }
          return null;
        }
      }
    ]
  }
});
