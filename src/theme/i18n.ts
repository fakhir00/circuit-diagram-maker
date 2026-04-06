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

// Merge dictionaries
const dictionaries = {
  common: commonKeys as Record<string, any>,
  home: homeKeys as Record<string, any>,
  faq: faqKeys as Record<string, any>
};

export function useTranslations(locale: string) {
  return function t(key: string): any {
    // Determine which namespace this key probably lives in (faq is special)
    if (key === 'faq') {
       return dictionaries.faq[locale] || dictionaries.faq[defaultLocale] || [];
    }

    // Combine flat string keys
    const mergedLocaleDict = {
      ...(dictionaries.common[locale] || {}),
      ...(dictionaries.home[locale] || {})
    };
    
    // Fallback to English
    const mergedEnDict = {
      ...(dictionaries.common[defaultLocale] || {}),
      ...(dictionaries.home[defaultLocale] || {})
    };

    return mergedLocaleDict[key] || mergedEnDict[key] || key;
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
