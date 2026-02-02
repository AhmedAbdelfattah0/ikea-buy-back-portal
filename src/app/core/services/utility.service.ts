import { Injectable, inject } from '@angular/core';
import { LocaleService } from './locale.service';
import { Translation } from '../../shared/interfaces/translation.interface';
import { CurrencyConfig } from '../../shared/interfaces/locale-config.interface';

/**
 * Utility Service
 *
 * Provides common utility functions used throughout the application
 * - Language and translation helpers
 * - Currency formatting
 * - Date formatting
 * - String manipulation
 *
 * Usage:
 * ```typescript
 * constructor(private utility: UtilityService) {
 *   const translations = this.utility.getLanguageConstants();
 *   const formatted = this.utility.formatCurrency(100);
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private localeService = inject(LocaleService);

  /**
   * Get current language translations
   */
  public getLanguageConstants(): Translation {
    return this.localeService.translations();
  }

  /**
   * Get current text direction (ltr or rtl)
   */
  public getDirection(): string {
    return this.localeService.direction();
  }

  /**
   * Check if current language is RTL
   */
  public isRTL(): boolean {
    return this.localeService.isRTL();
  }

  /**
   * Get current market code (sa, bh, etc.)
   */
  public getCurrentMarket(): string {
    return this.localeService.currentMarket();
  }

  /**
   * Get current language code (en, ar)
   */
  public getCurrentLanguage(): string {
    return this.localeService.currentLanguage();
  }

  /**
   * Get current currency info
   */
  public getCurrency(): CurrencyConfig {
    return this.localeService.getCurrency();
  }

  /**
   * Format currency amount
   */
  public formatCurrency(amount: number): string {
    return this.localeService.formatCurrency(amount);
  }

  /**
   * Format number with locale-specific separators
   */
  public formatNumber(value: number, decimals: number = 0): string {
    return value.toLocaleString(this.getLocale(), {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  /**
   * Get locale string for Intl APIs (e.g., 'en-SA', 'ar-SA')
   */
  private getLocale(): string {
    const lang = this.getCurrentLanguage();
    const market = this.getCurrentMarket();
    return `${lang}-${market.toUpperCase()}`;
  }

  /**
   * Format date
   */
  public formatDate(date: Date | string, format: string = 'short'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const options: Intl.DateTimeFormatOptions =
      format === 'short'
        ? { year: 'numeric', month: '2-digit', day: '2-digit' }
        : { year: 'numeric', month: 'long', day: 'numeric' };

    return dateObj.toLocaleDateString(this.getLocale(), options);
  }

  /**
   * Format date and time
   */
  public formatDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    return dateObj.toLocaleString(this.getLocale(), {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Debounce function
   */
  public debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: any;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle function
   */
  public throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Generate unique ID
   */
  public generateId(prefix: string = 'id'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Truncate string
   */
  public truncate(text: string, length: number, suffix: string = '...'): string {
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + suffix;
  }

  /**
   * Capitalize first letter
   */
  public capitalizeFirst(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Deep clone object
   */
  public deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Check if object is empty
   */
  public isEmpty(obj: any): boolean {
    if (obj === null || obj === undefined) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    if (typeof obj === 'string') return obj.trim().length === 0;
    return false;
  }

  /**
   * Safe parse JSON
   */
  public safeJsonParse<T>(json: string, fallback: T): T {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  }

  /**
   * Scroll to top of page
   */
  public scrollToTop(smooth: boolean = true): void {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  /**
   * Scroll to element
   */
  public scrollToElement(elementId: string, smooth: boolean = true): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'start'
      });
    }
  }

  /**
   * Split price into parts for SKAPA price component
   * @param price - The price amount to split
   * @returns Object with integerValue, decimalValue, decimalSign, and currencyLabel
   *
   * @example
   * const parts = this.utility.splitPriceForSkapa(150.50);
   * // Returns: { integerValue: '150', decimalValue: '50', decimalSign: '.', currencyLabel: 'SAR' }
   */
  public splitPriceForSkapa(price: number): {
    integerValue: string;
    decimalValue: string;
    decimalSign: string;
    currencyLabel: string;
  } {
    const currency = this.getCurrency();
    const locale = this.getLocale();

    // Format the price to ensure proper decimal handling
    const formattedPrice = price.toFixed(2);
    const [integerPart, decimalPart] = formattedPrice.split('.');

    // Get the decimal separator for the current locale
    const decimalSign = (1.1).toLocaleString(locale).charAt(1);

    return {
      integerValue: integerPart,
      decimalValue: decimalPart || '00',
      decimalSign: decimalSign,
      currencyLabel: currency.symbol
    };
  }
}
