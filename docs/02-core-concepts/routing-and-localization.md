# Routing and Localization

## Overview

The IKEA Buyback Portal uses a **URL-based localization** strategy where the market and language are encoded in the URL path. This approach provides SEO benefits, shareable links, and explicit locale selection.

## URL Structure

All URLs follow this pattern:

```
/{market}/{lang}/{route}
```

### Examples

```
https://example.com/sa/en/buy-back-quote
https://example.com/sa/ar/buy-back-quote
https://example.com/bh/en/buy-back-quote
https://example.com/bh/ar/buy-back-quote
```

**Note**: This is a single-page application - all URLs lead to the same `buy-back-quote` route, with views managed by component state.

### URL Components

| Component | Description | Values | Example |
|-----------|-------------|--------|---------|
| `market` | Market/country code | `sa`, `bh` | `sa` |
| `lang` | Language code | `en`, `ar` | `en` |
| `route` | Application route | `search`, `categories`, etc. | `search` |

## Supported Locales

| Market | Language | URL Path | Direction | Currency |
|--------|----------|----------|-----------|----------|
| Saudi Arabia | English | `/sa/en/` | LTR | SAR (ر.س) |
| Saudi Arabia | Arabic | `/sa/ar/` | RTL | SAR (ر.س) |
| Bahrain | English | `/bh/en/` | LTR | BHD (د.ب) |
| Bahrain | Arabic | `/bh/ar/` | RTL | BHD (د.ب) |

## How It Works

### 1. APP_BASE_HREF Configuration

The application uses Angular's `APP_BASE_HREF` to handle the locale prefix.

```typescript
// src/app/app.config.ts

export function getBaseHref(): string {
  const pathSegments = window.location.pathname.split('/').filter(s => s);

  // Extract market and language from URL
  const market = pathSegments[0] || 'sa';
  const language = pathSegments[1] || 'en';

  // Validate
  const validMarkets = ['sa', 'bh'];
  const validLanguages = ['en', 'ar'];

  const finalMarket = validMarkets.includes(market) ? market : 'sa';
  const finalLanguage = validLanguages.includes(language) ? language : 'en';

  // Set RTL for Arabic
  if (finalLanguage === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
  }

  return `/${finalMarket}/${finalLanguage}/`;
}

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    { provide: APP_BASE_HREF, useFactory: getBaseHref }
  ]
};
```

### 2. Route Definitions (Without Locale Prefix)

This is a **single-page application** with one main route. Routes are defined **without** the market/lang prefix since APP_BASE_HREF handles it.

```typescript
// src/app/app.routes.ts

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'buy-back-quote',
    pathMatch: 'full'
  },
  {
    path: 'buy-back-quote',
    loadComponent: () =>
      import('./features/buyback-list/pages/buyback-list/buyback-list.component')
        .then(m => m.BuybackListComponent),
    title: 'Buy back estimator tool - IKEA Buyback Portal'
  },
  {
    path: '**',
    redirectTo: 'buy-back-quote'
  }
];
```

**Note**: The entire application is contained in the `BuybackListComponent`, which manages three views (Browse, Estimation, Confirmation) via component state, not routing.

### 3. LocaleService Integration

The `LocaleService` detects and manages the current locale from the URL.

```typescript
// src/app/core/services/locale.service.ts

export class LocaleService {
  private _market = signal<SupportedMarket>('sa');
  private _language = signal<SupportedLanguage>('en');

  constructor() {
    this.initializeFromURL();
  }

  private initializeFromURL(): void {
    const pathSegments = window.location.pathname.split('/').filter(s => s);

    if (pathSegments.length >= 2) {
      const market = pathSegments[0];
      const language = pathSegments[1];

      if (this.isValidMarket(market) && this.isValidLanguage(language)) {
        this._market.set(market as SupportedMarket);
        this._language.set(language as SupportedLanguage);
        this.updateDocumentDirection();
      }
    }
  }
}
```

## Navigation Examples

### In Components

**Note**: This is a single-page application. All navigation is handled via component state, not routing.

```typescript
// Navigation is done via component signals, not router
export class BuybackListComponent {
  showEstimation = signal<boolean>(false);
  showConfirmation = signal<boolean>(false);

  // Show estimation view
  onContinueToOffer() {
    this.showEstimation.set(true);
  }

  // Show confirmation view
  onSubmissionSuccess(confirmationNum: string) {
    this.confirmationNumber.set(confirmationNum);
    this.showEstimation.set(false);
    this.showConfirmation.set(true);
  }

  // Reset to browse view
  onEstimateAnother() {
    this.showConfirmation.set(false);
    this.showEstimation.set(false);
  }
}
```

### Accessing the Application

```html
<!-- Single entry point -->
<a href="/sa/en/buy-back-quote">Start Buyback (English)</a>
<a href="/sa/ar/buy-back-quote">بدء إعادة الشراء (Arabic)</a>
```

## Changing Locale

### Change Language

```typescript
import { LocaleService } from './core/services/locale.service';

export class LanguageSelectorComponent {
  constructor(private locale: LocaleService) {}

  switchToArabic() {
    this.locale.changeLanguage('ar');
    // Reloads page with: /sa/ar/current-route
  }

  switchToEnglish() {
    this.locale.changeLanguage('en');
    // Reloads page with: /sa/en/current-route
  }
}
```

### Change Market

```typescript
switchToBahrain() {
  this.locale.changeMarket('bh');
  // Reloads page with: /bh/en/current-route
}

switchToSaudiArabia() {
  this.locale.changeMarket('sa');
  // Reloads page with: /sa/en/current-route
}
```

### Implementation Details

```typescript
// src/app/core/services/locale.service.ts

public changeLanguage(newLanguage: SupportedLanguage): void {
  const currentMarket = this._market();
  const currentPath = window.location.pathname;

  // Remove current market/lang prefix
  const pathWithoutLocale = currentPath.split('/').slice(3).join('/');

  // Construct new URL
  const newUrl = `/${currentMarket}/${newLanguage}/${pathWithoutLocale}`;

  // Reload with new locale
  window.location.href = newUrl;
}

public changeMarket(newMarket: SupportedMarket): void {
  const currentLanguage = this._language();
  const currentPath = window.location.pathname;

  const pathWithoutLocale = currentPath.split('/').slice(3).join('/');
  const newUrl = `/${newMarket}/${currentLanguage}/${pathWithoutLocale}`;

  window.location.href = newUrl;
}
```

## RTL Support

### Automatic Direction Setting

When the URL contains `/ar/`, the application automatically:

1. Sets `dir="rtl"` on `<html>` element
2. Sets `lang="ar"` on `<html>` element
3. Loads Arabic translations
4. Applies RTL-specific styles

```typescript
// Automatically done in getBaseHref()
if (finalLanguage === 'ar') {
  document.documentElement.setAttribute('dir', 'rtl');
  document.documentElement.setAttribute('lang', 'ar');
}
```

### RTL Styles

```scss
// src/assets/global/_rtl.scss

[dir='rtl'] {
  // Font family for Arabic
  body {
    font-family: $font-stack-arabic;
  }

  // Reverse margins
  .ms-2 {
    margin-right: $spacing-base;
    margin-left: 0;
  }

  // Flip icons
  .icon-arrow-right {
    transform: scaleX(-1);
  }
}
```

### Using RTL in Components

```typescript
import { LocaleService } from './core/services/locale.service';

export class MyComponent {
  isRTL = computed(() => this.locale.isRTL());

  constructor(private locale: LocaleService) {}
}
```

```html
<div [class.rtl-layout]="isRTL()">
  <!-- Content adapts to RTL -->
</div>
```

## Locale Detection Order

1. **URL Path** (Primary): Extract from `/{market}/{lang}/`
2. **Validation**: Check if market and language are supported
3. **Fallback**: Default to `sa/en` if invalid

```typescript
private initializeFromURL(): void {
  const pathSegments = window.location.pathname.split('/').filter(s => s);

  if (pathSegments.length >= 2) {
    const market = pathSegments[0];
    const language = pathSegments[1];

    // Validate
    if (this.isValidMarket(market) && this.isValidLanguage(language)) {
      this._market.set(market as SupportedMarket);
      this._language.set(language as SupportedLanguage);
      return;
    }
  }

  // Fallback
  this._market.set('sa');
  this._language.set('en');
}
```

## Adding New Locales

### 1. Add Market to Configuration

```typescript
// src/app/shared/interfaces/locale-config.interface.ts

export const SUPPORTED_MARKETS = ['sa', 'bh', 'uae'] as const;
export type SupportedMarket = (typeof SUPPORTED_MARKETS)[number];

export const CURRENCY_CONFIGS: Record<SupportedMarket, CurrencyConfig> = {
  sa: { code: 'SAR', symbol: 'ر.س', position: 'after' },
  bh: { code: 'BHD', symbol: 'د.ب', position: 'after' },
  uae: { code: 'AED', symbol: 'د.إ', position: 'after' }  // New
};
```

### 2. Add Translation Files

```typescript
// src/app/shared/constants/translations/en-uae.constants.ts
export const EN_UAE_TRANSLATIONS: Translation = {
  // ... translations
  offer: {
    currency: 'AED'  // Market-specific
  }
};

// src/app/shared/constants/translations/ar-uae.constants.ts
export const AR_UAE_TRANSLATIONS: Translation = {
  // ... Arabic translations for UAE
};
```

### 3. Update Translation Loader

```typescript
// src/app/shared/constants/translations/index.ts

import { EN_UAE_TRANSLATIONS } from './en-uae.constants';
import { AR_UAE_TRANSLATIONS } from './ar-uae.constants';

const TRANSLATION_MAP: Record<string, Translation> = {
  'en-sa': EN_SA_TRANSLATIONS,
  'ar-sa': AR_SA_TRANSLATIONS,
  'en-bh': EN_BH_TRANSLATIONS,
  'ar-bh': AR_BH_TRANSLATIONS,
  'en-uae': EN_UAE_TRANSLATIONS,  // New
  'ar-uae': AR_UAE_TRANSLATIONS   // New
};
```

### 4. Add Environment Files

```typescript
// src/environments/environment.uae-prod.ts
export const environment: Environment = {
  production: true,
  market: 'uae',
  apiBaseUrl: 'https://api.ikea.ae',
  currency: { code: 'AED', symbol: 'د.إ' }
  // ...
};
```

### 5. Update Validation

```typescript
// src/app/app.config.ts

export function getBaseHref(): string {
  const validMarkets = ['sa', 'bh', 'uae'];  // Add 'uae'
  // ...
}
```

That's it! No code changes needed, just configuration.

## Best Practices

### ✅ Do's

1. **Always use Router for navigation** - Don't construct URLs manually
2. **Use LocaleService for locale info** - Single source of truth
3. **Test all locales** - Ensure functionality works in all markets/languages
4. **Preserve locale on navigation** - RouterLink handles this automatically
5. **Handle RTL properly** - Use logical properties (margin-inline-start)

### ❌ Don'ts

1. **Don't hardcode locale in URLs** - Use router navigation
2. **Don't store locale in localStorage** - URL is the source of truth
3. **Don't mix LTR/RTL manually** - Let the system handle it
4. **Don't forget fallbacks** - Always handle invalid locales
5. **Don't skip RTL testing** - Test Arabic thoroughly

## Troubleshooting

### Issue: Routes not working

**Problem**: Navigating to `/search` shows 404

**Solution**: Check APP_BASE_HREF is configured. Access via `/sa/en/search`

### Issue: Wrong locale detected

**Problem**: Showing English instead of Arabic

**Solution**: Verify URL has correct format `/sa/ar/route`

### Issue: RTL not applying

**Problem**: Arabic text showing LTR

**Solution**: Check `dir` attribute on `<html>` element. Clear browser cache.

### Issue: Locale changes not persisting

**Problem**: Language reverts after reload

**Solution**: Locale comes from URL. Ensure URL is updated correctly.

---

**Next**: [Translation System](./translation-system.md)
