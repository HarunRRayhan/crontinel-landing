// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  build: {
    assetsDir: '_astro',
  },
  integrations: [mdx()],
  site: 'https://crontinel.com',
  vite: {
    css: {
      postcss: './postcss.config.mjs',
    },
  },
});
