import { defaultLocale, locales } from '../theme/i18n';
import config from '../data/config.json';

export interface SeoMetadata {
  title: string;
  description: string;
}

interface ResolveSeoMetadataInput {
  pathname: string;
  title?: string;
  description?: string;
}

const ROUTE_DEFAULTS: Record<string, SeoMetadata> = {
  '/': {
    title: 'Circuit Diagram Maker Online Tool',
    description: 'Create clean circuit diagrams online with smart wire routing, 40+ symbols, and free SVG or PNG export in your browser.'
  },
  '/editor/': {
    title: 'Circuit Diagram Editor',
    description: 'Open the circuit diagram editor to place components, route wires, label nets, and export polished schematics in your browser.'
  },
  '/logic-editor/': {
    title: 'Logic Circuit Editor',
    description: 'Design digital logic circuits with clear gate layouts, tidy signal paths, and export-ready diagrams in a focused browser editor.'
  },
  '/arduino-editor/': {
    title: 'Arduino Circuit Editor',
    description: 'Plan Arduino boards, sensors, and module wiring in a focused editor built for quick documentation and clean browser exports.'
  },
  '/pcb-editor/': {
    title: 'PCB Schematic Editor',
    description: 'Draft PCB schematics with board-focused symbols, clean connections, and export-ready layouts before moving into production.'
  },
  '/logic-gate-diagram-tool/': {
    title: 'Logic Gate Diagram Tool',
    description: 'Explore the logic gate diagram tool for fast gate planning, clear signal paths, and direct access to the dedicated logic editor.'
  },
  '/arduino-circuit-maker/': {
    title: 'Arduino Circuit Maker',
    description: 'Use the Arduino circuit maker to map boards, sensors, and module links before opening the dedicated Arduino editor.'
  },
  '/pcb-schematic-tool/': {
    title: 'PCB Schematic Tool',
    description: 'Use the PCB schematic tool to plan board circuits, organize symbols, and jump into the dedicated PCB editor.'
  },
  '/truth-table-to-logic-circuit/': {
    title: 'Truth Table To Logic Circuit',
    description: 'Turn logic requirements into gate-level diagrams with Truth Table to Logic Circuit workflows.'
  },
  '/schematic-to-breadboard/': {
    title: 'Schematic To Breadboard',
    description: 'Plan practical breadboard layouts from schematic intent with clearer wiring paths and faster prototype setup.'
  },
  '/docs/': {
    title: 'Circuit Diagram Docs',
    description: 'Read circuit diagram docs covering shortcuts, wire routing, exports, and practical workflows for faster schematic work.'
  },
  '/components/': {
    title: 'Circuit Component Library',
    description: 'Browse resistors, capacitors, ICs, connectors, and more in the circuit component library for faster schematic drafting.'
  },
  '/blog/': {
    title: 'Circuit Diagram Blog',
    description: 'Read circuit diagram guides, symbol explainers, and practical tutorials for clearer schematics and faster design reviews.'
  },
  '/about-us/': {
    title: 'About Circuit Diagram Maker',
    description: 'Learn what Circuit Diagram Maker is building, why the tool exists, and how the team approaches accessible schematic design.'
  },
  '/contact-us/': {
    title: 'Contact Support',
    description: 'Contact the Circuit Diagram Maker team for help with the editor, feature feedback, or questions about the platform.'
  },
  '/terms/': {
    title: 'Terms of Service',
    description: 'Review the terms for using Circuit Diagram Maker, including licenses, acceptable use, and general service limitations.'
  },
  '/privacy/': {
    title: 'Privacy Policy',
    description: 'Read how Circuit Diagram Maker handles basic usage data, privacy choices, and the policies that apply to the site.'
  },
  '/sitemap/': {
    title: 'HTML Sitemap',
    description: 'Browse the HTML sitemap to find key pages, tools, guides, and editor routes across Circuit Diagram Maker.'
  },
  '/404': {
    title: 'Page Not Found',
    description: 'The page you requested could not be found. Use this page to jump back to the editor, docs, or homepage.'
  }
};

const BLOG_ARTICLE_DEFAULTS: SeoMetadata = {
  title: 'Circuit Diagram Article',
  description: 'Read this circuit diagram article for practical steps, clearer symbols, and cleaner schematic workflows.'
};

const LOCALE_LABELS: Record<string, string> = {
  hi: 'Hindi',
  es: 'Spanish',
  ru: 'Russian',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  bn: 'Bengali',
  ja: 'Japanese',
  ko: 'Korean',
  ms: 'Malay',
  pl: 'Polish',
  id: 'Indonesian',
  ar: 'Arabic',
  bg: 'Bulgarian',
  tr: 'Turkish',
  sv: 'Swedish'
};

const TITLE_SUFFIX_LABELS: Record<string, string> = {
  '/': 'Home',
  '/editor/': 'Editor',
  '/logic-editor/': 'Logic',
  '/arduino-editor/': 'Editor',
  '/pcb-editor/': 'Editor',
  '/logic-gate-diagram-tool/': 'Tool',
  '/arduino-circuit-maker/': 'Tool',
  '/pcb-schematic-tool/': 'Tool',
  '/truth-table-to-logic-circuit/': 'Tool',
  '/schematic-to-breadboard/': 'Tool',
  '/docs/': 'Guide',
  '/components/': 'Library',
  '/blog/': 'Articles',
  '/about-us/': 'Team',
  '/contact-us/': 'Help',
  '/terms/': 'Legal',
  '/privacy/': 'Policy',
  '/sitemap/': 'Index',
  '/404': '404'
};

function collapseWhitespace(value?: string): string {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function trimToLength(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  const cutoff = Math.max(0, maxLength - 3);
  let trimmed = value.slice(0, cutoff).trimEnd();
  const lastSpace = trimmed.lastIndexOf(' ');

  if (lastSpace >= Math.max(0, cutoff - 18)) {
    trimmed = trimmed.slice(0, lastSpace).trimEnd();
  }

  return `${trimmed}...`;
}

function getEscapedHtmlLength(value: string): number {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .length;
}

function trimTitleToLength(value: string, maxLength: number): string {
  if (getEscapedHtmlLength(value) <= maxLength) {
    return value;
  }

  let sliceLength = value.length;
  while (sliceLength > 0) {
    const candidate = trimToLength(value.slice(0, sliceLength), maxLength);
    if (getEscapedHtmlLength(candidate) <= maxLength) {
      return candidate;
    }
    sliceLength -= 1;
  }

  return value.slice(0, maxLength);
}

function normalizeTitleValue(value: string): string {
  return collapseWhitespace(value)
    .toLocaleLowerCase()
    .replace(/[|:;,\-–—]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function appendUniqueTitlePart(parts: string[], nextPart?: string) {
  const candidate = collapseWhitespace(nextPart);
  if (!candidate) {
    return;
  }

  const normalizedCandidate = normalizeTitleValue(candidate);
  const exists = parts.some((part) => normalizeTitleValue(part) === normalizedCandidate);

  if (!exists) {
    parts.push(candidate);
  }
}

function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] && locales.includes(segments[0]) ? segments[0] : defaultLocale;
}

function normalizePathname(pathname: string): string {
  const rawSegments = pathname.split('/').filter(Boolean);
  const segments = [...rawSegments];

  if (segments[0] && locales.includes(segments[0])) {
    segments.shift();
  }

  if (segments.length === 0) {
    return '/';
  }

  const joined = `/${segments.join('/')}`;

  if (joined === '/404') {
    return '/404';
  }

  return pathname.endsWith('/') ? `${joined}/` : `${joined}/`;
}

function getRouteDefaults(pathname: string): SeoMetadata {
  const normalizedPath = normalizePathname(pathname);

  if (ROUTE_DEFAULTS[normalizedPath]) {
    return ROUTE_DEFAULTS[normalizedPath];
  }

  if (normalizedPath.startsWith('/blog/')) {
    return BLOG_ARTICLE_DEFAULTS;
  }

  return ROUTE_DEFAULTS['/'];
}

function finalizeTitle(title: string | undefined, fallback: string, pathname: string): string {
  const maxTitleLength = 60;
  const minTitleLength = 30;
  const normalizedPath = normalizePathname(pathname);
  const baseTitle = collapseWhitespace(title) || fallback;
  const locale = getLocaleFromPathname(pathname);
  const localeCode = locale !== defaultLocale ? locale.toUpperCase() : '';
  const routeLabel = TITLE_SUFFIX_LABELS[normalizedPath] || '';
  const normalizedRouteDefault = normalizeTitleValue(collapseWhitespace(getRouteDefaults(pathname).title));
  const normalizedBase = normalizeTitleValue(baseTitle);
  const suffixParts: string[] = [];

  const isArticleRoute = normalizedPath.startsWith('/blog/') && normalizedPath !== '/blog/';

  if (!isArticleRoute && routeLabel) {
    const normalizedRouteLabel = normalizeTitleValue(routeLabel);
    const baseMatchesRouteDefault = normalizedBase === normalizedRouteDefault;
    const baseContainsRouteLabel = normalizedBase.includes(normalizedRouteLabel);

    if (baseMatchesRouteDefault || !baseContainsRouteLabel) {
      appendUniqueTitlePart(suffixParts, routeLabel);
    }
  }

  if (localeCode) {
    appendUniqueTitlePart(suffixParts, localeCode);
  }

  let suffix = suffixParts.length > 0 ? ` | ${suffixParts.join(' | ')}` : '';
  let availableBaseLength = Math.max(10, maxTitleLength - getEscapedHtmlLength(suffix));
  let composedTitle = `${trimTitleToLength(baseTitle, availableBaseLength)}${suffix}`;

  if (getEscapedHtmlLength(composedTitle) < minTitleLength) {
    const brandCandidate = getEscapedHtmlLength(composedTitle) <= maxTitleLength - 6 ? 'CDM' : config.site.name;
    appendUniqueTitlePart(suffixParts, brandCandidate);
    suffix = ` | ${suffixParts.join(' | ')}`;
    availableBaseLength = Math.max(10, maxTitleLength - getEscapedHtmlLength(suffix));
    composedTitle = `${trimTitleToLength(baseTitle, availableBaseLength)}${suffix}`;
  }

  if (getEscapedHtmlLength(composedTitle) < minTitleLength) {
    appendUniqueTitlePart(suffixParts, config.site.name);
    suffix = ` | ${suffixParts.join(' | ')}`;
    availableBaseLength = Math.max(10, maxTitleLength - getEscapedHtmlLength(suffix));
    composedTitle = `${trimTitleToLength(baseTitle, availableBaseLength)}${suffix}`;
  }

  return trimTitleToLength(composedTitle, maxTitleLength);
}

function appendLocaleSuffix(description: string, pathname: string): string {
  const locale = getLocaleFromPathname(pathname);

  if (!locale || locale === defaultLocale || !LOCALE_LABELS[locale]) {
    return description;
  }

  const suffix = ` ${LOCALE_LABELS[locale]} version.`;
  const combined = `${description}${suffix}`;

  if (combined.length <= 150) {
    return combined;
  }

  return `${trimToLength(description, 150 - suffix.length)}${suffix}`;
}

function finalizeDescription(description: string | undefined, fallback: string, pathname: string): string {
  const normalizedDescription = collapseWhitespace(description);
  const normalizedFallback = collapseWhitespace(fallback);

  if (!normalizedDescription) {
    return appendLocaleSuffix(normalizedFallback, pathname);
  }

  if (normalizedDescription.length < 70) {
    return appendLocaleSuffix(normalizedFallback, pathname);
  }

  if (normalizedDescription.length > 150) {
    const trimmed = trimToLength(normalizedDescription, 150);
    return appendLocaleSuffix(trimmed.length >= 70 ? trimmed : normalizedFallback, pathname);
  }

  return appendLocaleSuffix(normalizedDescription, pathname);
}

export function resolveSeoMetadata({ pathname, title, description }: ResolveSeoMetadataInput): SeoMetadata {
  const defaults = getRouteDefaults(pathname);

  return {
    title: finalizeTitle(title, defaults.title, pathname),
    description: finalizeDescription(description, defaults.description, pathname)
  };
}
