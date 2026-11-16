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

function formatXml(xml) {
  let formatted = '';
  let indent = 0;
  // Normalize line endings and strip existing whitespace between tags
  const str = xml.replace(/\r?\n/g, '').replace(/>\s+</g, '><');
  // Split on tag boundaries while keeping the delimiters
  const tokens = str.split(/(<[^>]+>)/);
  for (const token of tokens) {
    if (!token.trim()) continue;
    if (token.startsWith('</')) {
      // Closing tag — dedent before writing
      indent = Math.max(0, indent - 1);
      formatted += '  '.repeat(indent) + token + '\n';
    } else if (token.startsWith('<?') || token.endsWith('/>')) {
      // Processing instruction or self-closing tag — no indent change
      formatted += '  '.repeat(indent) + token + '\n';
    } else if (token.startsWith('<')) {
      // Opening tag — write then indent children
      formatted += '  '.repeat(indent) + token + '\n';
      indent++;
    } else {
      // Text content — inline with current indent
      formatted += '  '.repeat(indent) + token + '\n';
    }
  }
  return formatted.trim();
}

function sitemapCopyPlugin() {
  return {
    name: 'sitemap-copy-plugin',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        try {
          const distPath = fileURLToPath(dir);

          // Pretty-print all sitemap XML files
          const files = fs.readdirSync(distPath).filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));
          for (const file of files) {
            const filePath = path.join(distPath, file);
            const raw = fs.readFileSync(filePath, 'utf-8');
            const pretty = formatXml(raw);
            fs.writeFileSync(filePath, pretty, 'utf-8');
            console.log(`[sitemap-copy-plugin] Formatted ${file}`);
          }

          // Copy sitemap-index.xml → sitemap.xml (re-read formatted version)
          const indexFile = path.join(distPath, 'sitemap-index.xml');
          const sitemapFile = path.join(distPath, 'sitemap.xml');
          if (fs.existsSync(indexFile)) {
            fs.copyFileSync(indexFile, sitemapFile);
          }
        } catch (e) {
          console.warn('Could not process sitemaps:', e);
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
        if (page.includes('/404') || page.includes('/schematic-to-breadboard')) {
          return false;
        }
        if (/\/(editor|arduino-editor|logic-editor|pcb-editor)\/?$/.test(page)) {
          return false;
        }
        if (/\/blog\/\d+\/?$/.test(page)) {
          return false;
        }
        return true;
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
