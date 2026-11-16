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
  // Normalize line endings, then collapse ALL whitespace between tags (handles
  // both fresh minified output and already-formatted XML)
  let str = xml.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  str = str.replace(/>[\ \t\n\r]+</g, '><');

  let out = '';
  let depth = 0;
  const pad = (n) => '  '.repeat(n);
  const re = /(<[^>]+>)/g;
  let last = 0;
  let m;

  while ((m = re.exec(str)) !== null) {
    const text = str.slice(last, m.index).trim();
    if (text) out += pad(depth) + text + '\n';

    const tag = m[1];
    if (tag.startsWith('</')) {
      depth--;
      out += pad(depth) + tag + '\n';
    } else if (tag.startsWith('<?') || tag.endsWith('/>')) {
      out += pad(depth) + tag + '\n';
    } else {
      // Look ahead: if next content is plain text followed by a closing tag,
      // render the whole thing inline (e.g. <loc>https://...</loc>)
      const afterTag = str.slice(m.index + tag.length);
      const inlineMatch = afterTag.match(/^([^<]+)<\/([^>]+)>/);
      if (inlineMatch) {
        const inlineText = inlineMatch[1].trim();
        const closeTag = '</' + inlineMatch[2] + '>';
        out += pad(depth) + tag + inlineText + closeTag + '\n';
        re.lastIndex = m.index + tag.length + inlineMatch[0].length;
        last = re.lastIndex;
        continue;
      }
      out += pad(depth) + tag + '\n';
      depth++;
    }
    last = re.lastIndex;
  }

  const remaining = str.slice(last).trim();
  if (remaining) out += remaining + '\n';
  return out.trim();
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
