import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['fr', 'en', 'pt'] as const;
export const defaultLocale = 'fr' as const;

export type Locale = (typeof locales)[number];

// Locale detection based on user location (for middleware)
export const localeDetection = {
  'US': 'en', // États-Unis -> Anglais
  'GB': 'en', // Royaume-Uni -> Anglais
  'CA': 'en', // Canada -> Anglais (par défaut, pourrait être fr pour Québec)
  'BR': 'pt', // Brésil -> Portugais
  'PT': 'pt', // Portugal -> Portugais
  'FR': 'fr', // France -> Français
  'BE': 'fr', // Belgique -> Français
  'CH': 'fr', // Suisse -> Français
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a locale is provided and is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
