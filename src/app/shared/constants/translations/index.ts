import { Translation } from '../../interfaces/translation.interface';
import { EN_SA_TRANSLATIONS } from './en-sa.constants';
import { AR_SA_TRANSLATIONS } from './ar-sa.constants';
import { EN_BH_TRANSLATIONS } from './en-bh.constants';
import { AR_BH_TRANSLATIONS } from './ar-bh.constants';

/**
 * Translation Map
 * Maps locale keys to their respective translation objects
 */
const TRANSLATION_MAP: Record<string, Translation> = {
  'en-sa': EN_SA_TRANSLATIONS,
  'ar-sa': AR_SA_TRANSLATIONS,
  'en-bh': EN_BH_TRANSLATIONS,
  'ar-bh': AR_BH_TRANSLATIONS
};

/**
 * Get Translations
 * Returns the translation object for a given market and language
 *
 * @param market - Market code (sa, bh)
 * @param language - Language code (en, ar)
 * @returns Translation object
 */
export function getTranslations(market: string, language: string): Translation {
  const key = `${language}-${market}`;
  return TRANSLATION_MAP[key] || EN_SA_TRANSLATIONS; // Fallback to English Saudi
}

/**
 * Get Translation by Locale Key
 * Returns the translation object for a given locale key (e.g., 'en-sa')
 *
 * @param localeKey - Locale key (e.g., 'en-sa', 'ar-bh')
 * @returns Translation object
 */
export function getTranslationsByLocale(localeKey: string): Translation {
  return TRANSLATION_MAP[localeKey] || EN_SA_TRANSLATIONS;
}

/**
 * Get Supported Locales
 * Returns an array of all supported locale keys
 *
 * @returns Array of locale keys
 */
export function getSupportedLocales(): string[] {
  return Object.keys(TRANSLATION_MAP);
}

/**
 * Check if Locale is Supported
 * Checks if a given locale key is supported
 *
 * @param localeKey - Locale key to check
 * @returns True if locale is supported, false otherwise
 */
export function isLocaleSupported(localeKey: string): boolean {
  return localeKey in TRANSLATION_MAP;
}

// Export translation constants for direct usage if needed
export { EN_SA_TRANSLATIONS, AR_SA_TRANSLATIONS, EN_BH_TRANSLATIONS, AR_BH_TRANSLATIONS };
