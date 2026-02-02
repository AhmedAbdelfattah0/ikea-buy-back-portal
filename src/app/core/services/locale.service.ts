import { Injectable, signal, computed } from '@angular/core';
import { LocaleConfig, CURRENCY_CONFIGS, SUPPORTED_MARKETS, SUPPORTED_LANGUAGES, SupportedMarket, SupportedLanguage } from '../../shared/interfaces/locale-config.interface';
import { Translation } from '../../shared/interfaces/translation.interface';
import { getTranslations } from '../../shared/constants/translations';

/**
 * Locale Service
 *
 * Manages market and language settings for the application
 * Extracts locale from URL path (/{market}/{lang}/)
 * Provides translations and currency information
 *
 * Usage:
 * ```typescript
 * constructor(private localeService: LocaleService) {
 *   const market = this.localeService.currentMarket();
 *   const language = this.localeService.currentLanguage();
 *   const translations = this.localeService.translations();
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  // Signals for reactive locale state
  private _market = signal<SupportedMarket>('sa');
  private _language = signal<SupportedLanguage>('en');

  // Computed signals
  public readonly currentMarket = this._market.asReadonly();
  public readonly currentLanguage = this._language.asReadonly();

  public readonly localeConfig = computed<LocaleConfig>(() => {
    const market = this._market();
    const language = this._language();
    return {
      market,
      language,
      direction: language === 'ar' ? 'rtl' : 'ltr',
      currency: CURRENCY_CONFIGS[market]
    };
  });

  public readonly translations = computed<Translation>(() => {
    return getTranslations(this._market(), this._language());
  });

  public readonly direction = computed(() => {
    return this._language() === 'ar' ? 'rtl' : 'ltr';
  });

  public readonly isRTL = computed(() => {
    return this.direction() === 'rtl';
  });

  constructor() {
    this.initializeFromURL();
  }

  /**
   * Initialize locale from URL path
   * Extracts market and language from path (e.g., /sa/en/)
   */
  private initializeFromURL(): void {
    const pathSegments = window.location.pathname.split('/').filter(s => s);

    if (pathSegments.length >= 2) {
      const market = pathSegments[0];
      const language = pathSegments[1];

      if (this.isValidMarket(market) && this.isValidLanguage(language)) {
        this._market.set(market as SupportedMarket);
        this._language.set(language as SupportedLanguage);
        this.updateDocumentDirection();
        return;
      }
    }

    // Fallback to defaults
    this._market.set('sa');
    this._language.set('en');
  }

  /**
   * Validate if market code is supported
   */
  public isValidMarket(market: string): boolean {
    return SUPPORTED_MARKETS.includes(market as SupportedMarket);
  }

  /**
   * Validate if language code is supported
   */
  public isValidLanguage(language: string): boolean {
    return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
  }

  /**
   * Update document direction attribute
   */
  private updateDocumentDirection(): void {
    const dir = this.direction();
    const lang = this._language();

    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }

  /**
   * Get locale key (e.g., 'en-sa')
   */
  public getLocaleKey(): string {
    return `${this._language()}-${this._market()}`;
  }

  /**
   * Get currency for current market
   */
  public getCurrency() {
    return this.localeConfig().currency;
  }

  /**
   * Format currency amount
   */
  public formatCurrency(amount: number): string {
    const currency = this.getCurrency();
    const formattedAmount = amount.toFixed(2);

    if (currency.position === 'before') {
      return `${currency.symbol} ${formattedAmount}`;
    } else {
      return `${formattedAmount} ${currency.symbol}`;
    }
  }

  /**
   * Change language (requires page reload to update URL)
   */
  public changeLanguage(newLanguage: SupportedLanguage): void {
    if (!this.isValidLanguage(newLanguage)) {
      console.warn(`Invalid language: ${newLanguage}`);
      return;
    }

    const currentMarket = this._market();
    const currentPath = window.location.pathname;

    // Remove current market/lang prefix
    const pathWithoutLocale = currentPath.split('/').slice(3).join('/');

    // Construct new URL with new language
    const newUrl = `/${currentMarket}/${newLanguage}/${pathWithoutLocale}`;

    // Reload page with new URL
    window.location.href = newUrl;
  }

  /**
   * Change market (requires page reload to update URL)
   */
  public changeMarket(newMarket: SupportedMarket): void {
    if (!this.isValidMarket(newMarket)) {
      console.warn(`Invalid market: ${newMarket}`);
      return;
    }

    const currentLanguage = this._language();
    const currentPath = window.location.pathname;

    // Remove current market/lang prefix
    const pathWithoutLocale = currentPath.split('/').slice(3).join('/');

    // Construct new URL with new market
    const newUrl = `/${newMarket}/${currentLanguage}/${pathWithoutLocale}`;

    // Reload page with new URL
    window.location.href = newUrl;
  }
}
