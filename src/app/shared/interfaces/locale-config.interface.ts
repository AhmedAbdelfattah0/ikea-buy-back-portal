/**
 * Locale Configuration Interface
 * Defines the structure for market and language settings
 */
export interface LocaleConfig {
  market: 'sa' | 'bh';
  language: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
  currency: CurrencyConfig;
}

/**
 * Currency Configuration Interface
 */
export interface CurrencyConfig {
  code: string;
  symbol: string;
  position: 'before' | 'after'; // Position of symbol relative to amount
}

/**
 * Supported Markets
 */
export const SUPPORTED_MARKETS = ['sa', 'bh'] as const;
export type SupportedMarket = (typeof SUPPORTED_MARKETS)[number];

/**
 * Supported Languages
 */
export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Market-specific configurations
 */
export const MARKET_CONFIGS: Record<SupportedMarket, { name: string; defaultLanguage: SupportedLanguage }> = {
  sa: {
    name: 'Saudi Arabia',
    defaultLanguage: 'en'
  },
  bh: {
    name: 'Bahrain',
    defaultLanguage: 'en'
  }
};

/**
 * Currency configurations by market
 */
export const CURRENCY_CONFIGS: Record<SupportedMarket, CurrencyConfig> = {
  sa: {
    code: 'SAR',
    symbol: '﷼',
    position: 'after'
  },
  bh: {
    code: 'BHD',
    symbol: 'د.ب',
    position: 'after'
  }
};
