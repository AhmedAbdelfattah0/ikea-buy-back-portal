import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { routes } from './app.routes';
import { httpHeadersInterceptor } from './core/interceptors/http-headers.interceptor';
import { errorHandlingInterceptor } from './core/interceptors/error-handling.interceptor';

/**
 * Get Base HREF from URL
 * Extracts market and language from URL path and sets as base href
 * Format: /{market}/{lang}/
 * Example: /sa/en/, /bh/ar/
 */
export function getBaseHref(): string {
  const pathSegments = window.location.pathname.split('/').filter(s => s);

  // Extract market and language from URL
  // Expected format: /{market}/{lang}/{route}
  const market = pathSegments[0] || 'sa';  // Default to 'sa'
  const language = pathSegments[1] || 'en'; // Default to 'en'

  // Validate market and language
  const validMarkets = ['sa', 'bh'];
  const validLanguages = ['en', 'ar'];

  const finalMarket = validMarkets.includes(market) ? market : 'sa';
  const finalLanguage = validLanguages.includes(language) ? language : 'en';

  // Set RTL direction for Arabic
  if (finalLanguage === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
  }

  // Return base href with trailing slash
  return `/${finalMarket}/${finalLanguage}/`;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        httpHeadersInterceptor,
        errorHandlingInterceptor
      ])
    ),
    { provide: APP_BASE_HREF, useFactory: getBaseHref }
  ]
};
