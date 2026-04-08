export const locales = [
  'en', 'hi', 'es', 'ru', 'fr', 'de', 'it', 'pt', 
  'bn', 'ja', 'ko', 'ms', 'pl', 'id', 'ar', 'bg', 'tr', 'sv'
];

export const defaultLocale = 'en';

export function getLocaleFromUrl(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && locales.includes(parts[0])) {
    return parts[0];
  }
  return defaultLocale;
}

import commonKeys from '../data/i18n/common.json';
import homeKeys from '../data/i18n/home.json';
import faqKeys from '../data/i18n/faq.json';
import editorKeys from '../data/i18n/editor.json';
import toolsKeys from '../data/i18n/tools.json';
import aboutKeys from '../data/i18n/about.json';
import contactKeys from '../data/i18n/contact.json';
import legalKeys from '../data/i18n/legal.json';
import docsKeys from '../data/i18n/docs.json';
import componentsPageKeys from '../data/i18n/components-page.json';
import showcaseKeys from '../data/i18n/showcase.json';

// Merge dictionaries
const dictionaries = {
  common: commonKeys as Record<string, any>,
  home: homeKeys as Record<string, any>,
  faq: faqKeys as Record<string, any>,
  editor: editorKeys as Record<string, any>,
  tools: toolsKeys as Record<string, any>,
  about: aboutKeys as Record<string, any>,
  contact: contactKeys as Record<string, any>,
  legal: legalKeys as Record<string, any>,
  docs: docsKeys as Record<string, any>,
  componentsPage: componentsPageKeys as Record<string, any>,
  showcase: showcaseKeys as Record<string, any>
};

function getTranslationValue(locale: string, key: string): any {
  for (const dict of Object.values(dictionaries)) {
    const localeDict = dict[locale] || {};
    if (Object.prototype.hasOwnProperty.call(localeDict, key)) {
      return localeDict[key];
    }
  }

  return undefined;
}

export function useTranslations(locale: string) {
  return function t(key: string): any {
    if (key === 'faq') {
       return dictionaries.faq[locale] || dictionaries.faq[defaultLocale] || [];
    }

    const localizedValue = getTranslationValue(locale, key);
    if (localizedValue !== undefined) {
      return localizedValue;
    }

    const defaultValue = getTranslationValue(defaultLocale, key);
    if (defaultValue !== undefined) {
      return defaultValue;
    }

    return key;
  };
}

export function getLocalizedPath(path: string, locale: string): string {
  // Ensure the base path starts with a slash
  const basePath = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) {
    return basePath;
  }
  // Strip any existing locale
  const withoutLocale = basePath.split('/').filter(p => !locales.includes(p)).join('/');
  return `/${locale}/${withoutLocale}`.replace(/\/+/g, '/');
}
