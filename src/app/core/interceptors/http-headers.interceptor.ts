import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocaleService } from '../services/locale.service';

/**
 * HTTP Headers Interceptor
 *
 * Adds common headers to all HTTP requests:
 * - Content-Type: application/json
 * - Accept-Language: Current locale (en-SA, ar-SA, etc.)
 * - X-Market: Current market (sa, bh)
 */
export const httpHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  const localeService = inject(LocaleService);

  const market = localeService.currentMarket();
  const language = localeService.currentLanguage();

  // Construct Accept-Language header (e.g., "en-SA", "ar-BH")
  const locale = `${language}-${market.toUpperCase()}`;

  // Clone request and add headers
  const clonedRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept-Language': locale,
      'X-Market': market
    }
  });

  return next(clonedRequest);
};
