// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const locales = [
  'en', 'hi', 'es', 'ru', 'fr', 'de', 'it', 'pt', 
  'bn', 'ja', 'ko', 'ms', 'pl', 'id', 'ar', 'bg', 'tr', 'sv', 'ur'
];
const defaultLocale = 'en';
const sitemapLocales = Object.fromEntries(locales.map(l => [l, l]));

function sitemapCopyPlugin() {
  return {
    name: 'sitemap-copy-plugin',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        try {
          const distPath = fileURLToPath(dir);
          const indexFile = path.join(distPath, 'sitemap-index.xml');
          const sitemapFile = path.join(distPath, 'sitemap.xml');
          if (fs.existsSync(indexFile)) {
            fs.copyFileSync(indexFile, sitemapFile);
          }
        } catch (e) {
          console.warn('Could not copy sitemap-index.xml to sitemap.xml:', e);
        }
      }
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.circuitdiagrammaker.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale,
        locales: sitemapLocales
      },
      filter: (page) => {
        return !page.includes('/404') && !page.includes('/schematic-to-breadboard');
      },
      serialize(item) {
        if (item.links && item.links.length > 0) {
          const hasXDefault = item.links.some(l => l.lang === 'x-default');
          if (!hasXDefault) {
            const enLink = item.links.find(l => l.lang === 'en') || { url: item.url, lang: 'en' };
            item.links.unshift({
              url: enLink.url,
              lang: 'x-default'
            });
          }
        }
        return item;
      }
    }),
    sitemapCopyPlugin(),
    mdx()
  ],
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
