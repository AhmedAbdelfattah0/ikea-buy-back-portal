# Environment Configuration

## Overview

The IKEA Buyback Portal supports multiple environments across different markets. Each combination of market (SA, BH) and stage (Local, QA, Production) has its own configuration file.

## Environment Files

### File Structure

```
src/environments/
├── environment.ts              # Local development
├── environment.sa-qa.ts        # Saudi Arabia - QA
├── environment.sa-prod.ts      # Saudi Arabia - Production
├── environment.bh-qa.ts        # Bahrain - QA
├── environment.bh-prod.ts      # Bahrain - Production
└── environment.model.ts        # TypeScript interface
```

### Environment Matrix

| Market | Stage | File | API Base URL |
|--------|-------|------|--------------|
| Local | Development | `environment.ts` | `http://localhost:3000` |
| Saudi Arabia | QA | `environment.sa-qa.ts` | `https://qa-api.ikea.sa` |
| Saudi Arabia | Production | `environment.sa-prod.ts` | `https://api.ikea.sa` |
| Bahrain | QA | `environment.bh-qa.ts` | `https://qa-api.ikea.bh` |
| Bahrain | Production | `environment.bh-prod.ts` | `https://api.ikea.bh` |

## Environment Interface

All environment files implement the same interface for type safety.

```typescript
// src/environments/environment.model.ts

export interface ApiEndpoints {
  products: string;
  categories: string;
  productDetails: string;
  offers: string;
  submissions: string;
  stores: string;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  position: 'before' | 'after';
  decimalPlaces: number;
}

export interface FeatureFlags {
  enableAnalytics: boolean;
  enableCategoryBrowse: boolean;
  enableFamilyMemberDiscount: boolean;
  enableMultipleSubmissions: boolean;
}

export interface Environment {
  production: boolean;
  market: 'sa' | 'bh';
  apiBaseUrl: string;
  apiEndpoints: ApiEndpoints;
  supportedLanguages: string[];
  defaultLanguage: string;
  currency: CurrencyConfig;
  featureFlags: FeatureFlags;
  analyticsId?: string;
  sentryDsn?: string;
}
```

## Environment Files

### Local Development

```typescript
// src/environments/environment.ts

import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  market: 'sa',
  apiBaseUrl: 'http://localhost:3000',
  apiEndpoints: {
    products: '/api/buyback/products',
    categories: '/api/buyback/categories',
    productDetails: '/api/buyback/products/:id',
    offers: '/api/buyback/offers',
    submissions: '/api/buyback/submissions',
    stores: '/api/stores'
  },
  supportedLanguages: ['en', 'ar'],
  defaultLanguage: 'en',
  currency: {
    code: 'SAR',
    symbol: 'ر.س',
    position: 'after',
    decimalPlaces: 2
  },
  featureFlags: {
    enableAnalytics: false,
    enableCategoryBrowse: true,
    enableFamilyMemberDiscount: true,
    enableMultipleSubmissions: true
  }
};
```

### Saudi Arabia - QA

```typescript
// src/environments/environment.sa-qa.ts

import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  market: 'sa',
  apiBaseUrl: 'https://qa-api.ikea.sa',
  apiEndpoints: {
    products: '/api/buyback/products',
    categories: '/api/buyback/categories',
    productDetails: '/api/buyback/products/:id',
    offers: '/api/buyback/offers',
    submissions: '/api/buyback/submissions',
    stores: '/api/stores'
  },
  supportedLanguages: ['en', 'ar'],
  defaultLanguage: 'en',
  currency: {
    code: 'SAR',
    symbol: 'ر.س',
    position: 'after',
    decimalPlaces: 2
  },
  featureFlags: {
    enableAnalytics: true,
    enableCategoryBrowse: true,
    enableFamilyMemberDiscount: true,
    enableMultipleSubmissions: true
  },
  analyticsId: 'UA-XXXXXXXX-X',
  sentryDsn: 'https://xxxxx@sentry.io/xxxxx'
};
```

### Saudi Arabia - Production

```typescript
// src/environments/environment.sa-prod.ts

import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  market: 'sa',
  apiBaseUrl: 'https://api.ikea.sa',
  apiEndpoints: {
    products: '/api/buyback/products',
    categories: '/api/buyback/categories',
    productDetails: '/api/buyback/products/:id',
    offers: '/api/buyback/offers',
    submissions: '/api/buyback/submissions',
    stores: '/api/stores'
  },
  supportedLanguages: ['en', 'ar'],
  defaultLanguage: 'en',
  currency: {
    code: 'SAR',
    symbol: 'ر.س',
    position: 'after',
    decimalPlaces: 2
  },
  featureFlags: {
    enableAnalytics: true,
    enableCategoryBrowse: true,
    enableFamilyMemberDiscount: true,
    enableMultipleSubmissions: false  // Disabled in prod initially
  },
  analyticsId: 'UA-XXXXXXXX-Y',
  sentryDsn: 'https://xxxxx@sentry.io/yyyyy'
};
```

### Bahrain - QA

```typescript
// src/environments/environment.bh-qa.ts

import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  market: 'bh',
  apiBaseUrl: 'https://qa-api.ikea.bh',
  apiEndpoints: {
    products: '/api/buyback/products',
    categories: '/api/buyback/categories',
    productDetails: '/api/buyback/products/:id',
    offers: '/api/buyback/offers',
    submissions: '/api/buyback/submissions',
    stores: '/api/stores'
  },
  supportedLanguages: ['en', 'ar'],
  defaultLanguage: 'en',
  currency: {
    code: 'BHD',
    symbol: 'د.ب',
    position: 'after',
    decimalPlaces: 3  // Bahrain Dinar uses 3 decimal places
  },
  featureFlags: {
    enableAnalytics: true,
    enableCategoryBrowse: true,
    enableFamilyMemberDiscount: true,
    enableMultipleSubmissions: true
  },
  analyticsId: 'UA-XXXXXXXX-Z',
  sentryDsn: 'https://xxxxx@sentry.io/zzzzz'
};
```

### Bahrain - Production

```typescript
// src/environments/environment.bh-prod.ts

import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  market: 'bh',
  apiBaseUrl: 'https://api.ikea.bh',
  apiEndpoints: {
    products: '/api/buyback/products',
    categories: '/api/buyback/categories',
    productDetails: '/api/buyback/products/:id',
    offers: '/api/buyback/offers',
    submissions: '/api/buyback/submissions',
    stores: '/api/stores'
  },
  supportedLanguages: ['en', 'ar'],
  defaultLanguage: 'en',
  currency: {
    code: 'BHD',
    symbol: 'د.ب',
    position: 'after',
    decimalPlaces: 3
  },
  featureFlags: {
    enableAnalytics: true,
    enableCategoryBrowse: true,
    enableFamilyMemberDiscount: true,
    enableMultipleSubmissions: false
  },
  analyticsId: 'UA-XXXXXXXX-W',
  sentryDsn: 'https://xxxxx@sentry.io/wwwww'
};
```

## Using Environment Variables

### In Services

```typescript
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private baseUrl = environment.apiBaseUrl;
  private endpoints = environment.apiEndpoints;

  public readonly products = this.getUrl(this.endpoints.products);
  public readonly categories = this.getUrl(this.endpoints.categories);

  private getUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
```

### In Components

```typescript
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

export class AppComponent {
  isProduction = environment.production;
  market = environment.market;

  ngOnInit(): void {
    if (this.isProduction) {
      console.log('Running in production mode');
    } else {
      console.log('Running in development mode');
    }
  }
}
```

### Currency Formatting

```typescript
import { environment } from '../../../environments/environment';

export class PriceComponent {
  formatPrice(amount: number): string {
    const { symbol, position, decimalPlaces } = environment.currency;
    const formatted = amount.toFixed(decimalPlaces);

    return position === 'before'
      ? `${symbol} ${formatted}`
      : `${formatted} ${symbol}`;
  }
}
```

### Feature Flags

```typescript
import { environment } from '../../../environments/environment';

export class OfferComponent {
  showFamilyDiscount = environment.featureFlags.enableFamilyMemberDiscount;

  ngOnInit(): void {
    if (this.showFamilyDiscount) {
      this.loadFamilyMemberStatus();
    }
  }
}
```

```html
@if (showFamilyDiscount) {
  <div class="family-discount">
    <app-family-member-toggle></app-family-member-toggle>
  </div>
}
```

### Analytics Integration

```typescript
import { environment } from '../../../environments/environment';

export class AnalyticsService {
  constructor() {
    if (environment.featureFlags.enableAnalytics && environment.analyticsId) {
      this.initializeAnalytics(environment.analyticsId);
    }
  }

  private initializeAnalytics(trackingId: string): void {
    // Initialize Google Analytics or other analytics
  }
}
```

## Build Configurations

### angular.json Configuration

```json
{
  "projects": {
    "buyback-portal": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.sa-prod.ts"
                }
              ],
              "outputHashing": "all"
            },
            "sa-qa": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.sa-qa.ts"
                }
              ]
            },
            "sa-prod": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.sa-prod.ts"
                }
              ],
              "outputHashing": "all"
            },
            "bh-qa": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.bh-qa.ts"
                }
              ]
            },
            "bh-prod": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.bh-prod.ts"
                }
              ],
              "outputHashing": "all"
            }
          }
        },
        "serve": {
          "configurations": {
            "sa-qa": {
              "buildTarget": "buyback-portal:build:sa-qa"
            },
            "sa-prod": {
              "buildTarget": "buyback-portal:build:sa-prod"
            },
            "bh-qa": {
              "buildTarget": "buyback-portal:build:bh-qa"
            },
            "bh-prod": {
              "buildTarget": "buyback-portal:build:bh-prod"
            }
          }
        }
      }
    }
  }
}
```

### Build Commands

```bash
# Local development (default)
npm start
# or
ng serve

# Saudi Arabia - QA
ng build --configuration=sa-qa
ng serve --configuration=sa-qa

# Saudi Arabia - Production
ng build --configuration=sa-prod

# Bahrain - QA
ng build --configuration=bh-qa
ng serve --configuration=bh-qa

# Bahrain - Production
ng build --configuration=bh-prod
```

## Adding New Markets

### Step 1: Create Environment File

```typescript
// src/environments/environment.uae-prod.ts
import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  market: 'uae',
  apiBaseUrl: 'https://api.ikea.ae',
  apiEndpoints: {
    products: '/api/buyback/products',
    categories: '/api/buyback/categories',
    productDetails: '/api/buyback/products/:id',
    offers: '/api/buyback/offers',
    submissions: '/api/buyback/submissions',
    stores: '/api/stores'
  },
  supportedLanguages: ['en', 'ar'],
  defaultLanguage: 'en',
  currency: {
    code: 'AED',
    symbol: 'د.إ',
    position: 'after',
    decimalPlaces: 2
  },
  featureFlags: {
    enableAnalytics: true,
    enableCategoryBrowse: true,
    enableFamilyMemberDiscount: true,
    enableMultipleSubmissions: false
  },
  analyticsId: 'UA-XXXXXXXX-UAE',
  sentryDsn: 'https://xxxxx@sentry.io/uae'
};
```

### Step 2: Update TypeScript Interface (if needed)

```typescript
// src/environments/environment.model.ts
export interface Environment {
  // ...
  market: 'sa' | 'bh' | 'uae';  // Add 'uae'
  // ...
}
```

### Step 3: Update angular.json

```json
{
  "configurations": {
    "uae-prod": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.uae-prod.ts"
        }
      ],
      "outputHashing": "all"
    }
  }
}
```

### Step 4: Update Locale Configuration

```typescript
// src/app/shared/interfaces/locale-config.interface.ts
export const SUPPORTED_MARKETS = ['sa', 'bh', 'uae'] as const;
```

### Step 5: Add Translations

Create `en-uae.constants.ts` and `ar-uae.constants.ts` with market-specific translations.

### Step 6: Build for New Market

```bash
ng build --configuration=uae-prod
```

## Environment-Specific Features

### Development Only Features

```typescript
if (!environment.production) {
  // Enable development tools
  console.log('Development mode active');

  // Mock data
  this.useMockData = true;

  // Debug logging
  this.enableDebugLogging = true;
}
```

### Production Only Features

```typescript
if (environment.production) {
  // Enable error tracking
  initializeSentry(environment.sentryDsn);

  // Enable analytics
  initializeAnalytics(environment.analyticsId);

  // Disable console logs
  console.log = () => {};
}
```

### Market-Specific Logic

```typescript
switch (environment.market) {
  case 'sa':
    // Saudi-specific logic
    this.taxRate = 0.15;  // 15% VAT
    break;

  case 'bh':
    // Bahrain-specific logic
    this.taxRate = 0.05;  // 5% VAT
    break;

  case 'uae':
    // UAE-specific logic
    this.taxRate = 0.05;  // 5% VAT
    break;
}
```

## Best Practices

### ✅ Do's

1. **Use environment for all config** - API URLs, feature flags, credentials
2. **Keep interface updated** - Ensure all files match the interface
3. **Document new fields** - Add comments for non-obvious config
4. **Use feature flags** - Enable/disable features per environment
5. **Test all environments** - Verify builds for each configuration
6. **Keep secrets out of code** - Use environment variables or secret managers

### ❌ Don'ts

1. **Don't hardcode URLs** - Always use environment.apiBaseUrl
2. **Don't commit secrets** - Use placeholders or separate secret files
3. **Don't skip validation** - Ensure environment files are complete
4. **Don't duplicate config** - Use the interface to ensure consistency
5. **Don't mix concerns** - Keep environment-specific and business logic separate

## Troubleshooting

### Issue: Wrong environment loaded

**Problem**: Production config loading in development

**Solution**:
1. Check `angular.json` file replacements
2. Verify build configuration name
3. Clear `.angular` cache folder
4. Rebuild the project

### Issue: TypeScript errors on new environment

**Problem**: "Property 'xyz' does not exist on type 'Environment'"

**Solution**:
1. Add the property to `environment.model.ts` interface
2. Add to all environment files
3. Rebuild

### Issue: API calls failing

**Problem**: 404 errors on API calls

**Solution**:
1. Check `environment.apiBaseUrl` is correct
2. Verify `environment.apiEndpoints` paths match backend
3. Check network tab for actual URLs being called
4. Ensure CORS is configured on backend

---

**Next**: [Routing and Localization](./routing-and-localization.md)
