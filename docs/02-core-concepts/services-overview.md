# Services Overview

## Introduction

The IKEA Buyback Portal uses **service-based architecture** where all business logic, data access, and state management are handled by singleton services. This follows the **Single Responsibility Principle** - each service has one clear purpose.

## Core Services

All core services are located in `src/app/core/services/` and are provided at root level (`providedIn: 'root'`), making them singletons throughout the application.

### Service Categories

| Category | Services | Purpose |
|----------|----------|---------|
| **Localization** | LocaleService | Market/language management |
| **Data Storage** | DatastoreService | localStorage/sessionStorage |
| **Utilities** | UtilityService | Common helper functions |
| **API** | APIService | API endpoint registry |
| **UI State** | LoaderService | Loading state management |

## LocaleService

### Purpose

Manages market and language detection from URL, provides locale-specific configurations, and handles locale changes.

### Location

```
src/app/core/services/locale.service.ts
```

### Key Features

- **Signal-based reactive state**
- **URL-based locale detection**
- **Automatic RTL/LTR handling**
- **Type-safe locale management**
- **Currency configuration**
- **Translation loading**

### API

```typescript
export class LocaleService {
  // Read-only signals
  readonly currentMarket: Signal<SupportedMarket>;
  readonly currentLanguage: Signal<SupportedLanguage>;
  readonly localeConfig: Signal<LocaleConfig>;
  readonly translations: Signal<Translation>;

  // Computed values
  readonly isRTL: Signal<boolean>;
  readonly currencyConfig: Signal<CurrencyConfig>;

  // Methods
  changeLanguage(newLanguage: SupportedLanguage): void;
  changeMarket(newMarket: SupportedMarket): void;
  getCurrentLocaleKey(): string;
}
```

### Usage Examples

#### Get Current Locale

```typescript
import { Component, computed } from '@angular/core';
import { LocaleService } from '../../../../core/services/locale.service';

export class MyComponent {
  market = computed(() => this.locale.currentMarket());
  language = computed(() => this.locale.currentLanguage());
  isRTL = computed(() => this.locale.isRTL());

  constructor(private locale: LocaleService) {}

  logLocale(): void {
    console.log('Market:', this.market());      // 'sa' or 'bh'
    console.log('Language:', this.language());  // 'en' or 'ar'
    console.log('Is RTL:', this.isRTL());      // true/false
  }
}
```

#### Get Translations

```typescript
export class ProductSearchComponent {
  translations = computed(() => this.locale.translations());

  constructor(private locale: LocaleService) {}

  getSearchPlaceholder(): string {
    return this.translations().productDiscovery.searchPlaceholder;
  }
}
```

```html
<input [placeholder]="translations().productDiscovery.searchPlaceholder" />
```

#### Get Currency Config

```typescript
export class PriceDisplayComponent {
  currency = computed(() => this.locale.currencyConfig());

  constructor(private locale: LocaleService) {}

  formatPrice(amount: number): string {
    const config = this.currency();
    return `${amount} ${config.symbol}`;  // "100 ر.س" or "50 د.ب"
  }
}
```

#### Change Language

```typescript
export class LanguageSwitcherComponent {
  constructor(private locale: LocaleService) {}

  switchToArabic(): void {
    this.locale.changeLanguage('ar');
    // Page reloads with Arabic URL
  }

  switchToEnglish(): void {
    this.locale.changeLanguage('en');
    // Page reloads with English URL
  }
}
```

### Implementation Details

#### URL Detection

```typescript
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
```

#### Direction Management

```typescript
private updateDocumentDirection(): void {
  const lang = this._language();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
}
```

## DatastoreService

### Purpose

Provides type-safe access to localStorage and sessionStorage with convenience methods for common operations.

### Key Features

- **Type-safe getters/setters**
- **Automatic JSON serialization**
- **Error handling**
- **Domain-specific helpers**
- **Session vs Persistent storage**

### API

```typescript
export class DatastoreService {
  // Generic methods
  setItem<T>(key: string, value: T, useSessionStorage?: boolean): void;
  getItem<T>(key: string, useSessionStorage?: boolean): T | null;
  removeItem(key: string, useSessionStorage?: boolean): void;
  clear(useSessionStorage?: boolean): void;
  hasItem(key: string, useSessionStorage?: boolean): boolean;

  // Domain-specific methods
  getBuybackList<T>(): T[];
  setBuybackList<T>(items: T[]): void;
  clearBuybackList(): void;

  isFamilyMember(): boolean;
  setFamilyMemberStatus(isMember: boolean): void;

  getSelectedStore(): string | null;
  setSelectedStore(storeId: string): void;
}
```

### Usage Examples

#### Generic Storage

```typescript
import { DatastoreService } from '../../../../core/services/datastore.service';

export class UserPreferencesComponent {
  constructor(private datastore: DatastoreService) {}

  savePreferences(prefs: UserPreferences): void {
    this.datastore.setItem('user_preferences', prefs);
  }

  loadPreferences(): UserPreferences | null {
    return this.datastore.getItem<UserPreferences>('user_preferences');
  }

  clearPreferences(): void {
    this.datastore.removeItem('user_preferences');
  }
}
```

#### Buyback List Management

```typescript
export class BuybackListService {
  constructor(private datastore: DatastoreService) {}

  getItems(): BuybackItem[] {
    return this.datastore.getBuybackList<BuybackItem>();
  }

  addItem(item: BuybackItem): void {
    const items = this.getItems();
    items.push(item);
    this.datastore.setBuybackList(items);
  }

  removeItem(itemId: string): void {
    const items = this.getItems().filter(item => item.id !== itemId);
    this.datastore.setBuybackList(items);
  }

  clearAll(): void {
    this.datastore.clearBuybackList();
  }
}
```

#### Family Member Status

```typescript
export class FamilyMemberComponent {
  isMember = signal<boolean>(false);

  constructor(private datastore: DatastoreService) {
    this.loadStatus();
  }

  loadStatus(): void {
    this.isMember.set(this.datastore.isFamilyMember());
  }

  toggleStatus(): void {
    const newStatus = !this.isMember();
    this.isMember.set(newStatus);
    this.datastore.setFamilyMemberStatus(newStatus);
  }
}
```

#### Session Storage

```typescript
export class TemporaryDataComponent {
  constructor(private datastore: DatastoreService) {}

  saveTemporary(data: any): void {
    // Use session storage (cleared when tab closes)
    this.datastore.setItem('temp_data', data, true);
  }

  loadTemporary(): any {
    return this.datastore.getItem('temp_data', true);
  }
}
```

## UtilityService

### Purpose

Provides common utility functions for formatting, validation, string manipulation, and other helper operations.

### Key Features

- **Currency formatting**
- **Date formatting**
- **Number formatting**
- **String utilities**
- **Debounce/throttle**
- **ID generation**
- **Validation helpers**

### API

```typescript
export class UtilityService {
  // Formatting
  formatCurrency(amount: number, currency: string): string;
  formatDate(date: Date | string, format?: string): string;
  formatNumber(num: number, decimals?: number): string;

  // String utilities
  truncate(text: string, maxLength: number, suffix?: string): string;
  slugify(text: string): string;
  capitalize(text: string): string;

  // Validation
  isValidEmail(email: string): boolean;
  isValidUrl(url: string): boolean;
  isEmpty(value: any): boolean;

  // Utilities
  generateId(prefix?: string): string;
  debounce(func: Function, wait: number): Function;
  deepClone<T>(obj: T): T;

  // SKAPA price component helper
  splitPriceForSkapa(price: number): {
    integerValue: string;
    decimalValue: string;
    decimalSign: string;
    currencyLabel: string;
  };

  // Language (legacy from existing pattern)
  getLanguageConstants(): any;
}
```

### Usage Examples

#### Currency Formatting

```typescript
export class PriceComponent {
  constructor(private utility: UtilityService) {}

  formatPrice(amount: number): string {
    return this.utility.formatCurrency(amount, 'SAR');
    // Returns: "1,234.50 ر.س"
  }
}
```

#### Date Formatting

```typescript
export class OrderComponent {
  constructor(private utility: UtilityService) {}

  formatOrderDate(date: Date): string {
    return this.utility.formatDate(date, 'DD/MM/YYYY');
    // Returns: "25/01/2026"
  }
}
```

#### String Utilities

```typescript
export class ProductDescriptionComponent {
  constructor(private utility: UtilityService) {}

  getShortDescription(fullText: string): string {
    return this.utility.truncate(fullText, 100, '...');
    // Returns: "First 100 characters..."
  }

  createSlug(productName: string): string {
    return this.utility.slugify(productName);
    // "BILLY Bookcase" → "billy-bookcase"
  }
}
```

#### Validation

```typescript
export class EmailInputComponent {
  constructor(private utility: UtilityService) {}

  validateEmail(email: string): boolean {
    return this.utility.isValidEmail(email);
  }

  onEmailChange(email: string): void {
    if (this.validateEmail(email)) {
      console.log('Valid email');
    } else {
      console.log('Invalid email');
    }
  }
}
```

#### ID Generation

```typescript
export class QuotationService {
  constructor(private utility: UtilityService) {}

  generateQuotationNumber(): string {
    return this.utility.generateId('BB');
    // Returns: "BB-1234567890123"
  }
}
```

#### Debounce

```typescript
export class SearchComponent {
  private debouncedSearch: Function;

  constructor(private utility: UtilityService) {
    this.debouncedSearch = this.utility.debounce(
      this.performSearch.bind(this),
      300
    );
  }

  onSearchInput(query: string): void {
    this.debouncedSearch(query);  // Only calls after 300ms of no input
  }

  private performSearch(query: string): void {
    console.log('Searching for:', query);
  }
}
```

#### SKAPA Price Component

`splitPriceForSkapa()` splits a numeric price into the parts expected by IKEA's `<skapa-price>` web component. It reads the current market currency and locale-aware decimal separator automatically.

```typescript
export class BuybackSidebarComponent extends BaseComponent {
  constructor(private utility: UtilityService) {
    super();
  }

  getPriceParts(price: number) {
    return this.utility.splitPriceForSkapa(price);
    // SAR example → { integerValue: '150', decimalValue: '50', decimalSign: '.', currencyLabel: 'ر.س' }
    // BHD example → { integerValue: '25',  decimalValue: '00', decimalSign: '.', currencyLabel: 'د.ب' }
  }
}
```

```html
<skapa-price
  size="small"
  currency-position="leading"
  currency-spacing="thin"
  [integerValue]="getPriceParts(item.price).integerValue"
  [decimalValue]="getPriceParts(item.price).decimalValue"
  [decimalSign]="getPriceParts(item.price).decimalSign"
  [currencyLabel]="getPriceParts(item.price).currencyLabel">
</skapa-price>
```

> See [SKAPA Integration — Price](../04-ui-components/skapa-integration.md) for full `<skapa-price>` usage details.

## APIService

### Purpose

Centralized registry of all API endpoints. Provides type-safe access to API URLs with proper base URL handling.

### Key Features

- **Environment-aware base URL**
- **Centralized endpoint management**
- **Type-safe URL construction**
- **Easy endpoint addition**

### API

```typescript
export class APIService {
  // Base configuration
  private baseUrl: string;
  private endpoints: ApiEndpoints;

  // Public endpoint URLs
  readonly products: string;
  readonly categories: string;
  readonly offers: string;
  readonly submissions: string;

  // Utility methods
  getUrl(path: string): string;
}
```

### Usage Examples

#### In HTTP Service

```typescript
import { HttpClient } from '@angular/common/http';
import { APIService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(
    private http: HttpClient,
    private api: APIService
  ) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api.products);
    // Calls: https://api.ikea.sa/api/buyback/products
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.api.products}/${id}`);
    // Calls: https://api.ikea.sa/api/buyback/products/12345
  }
}
```

#### Custom Endpoints

```typescript
export class CustomService {
  constructor(
    private http: HttpClient,
    private api: APIService
  ) {}

  getCustomData(): Observable<any> {
    const customUrl = this.api.getUrl('/custom/endpoint');
    return this.http.get(customUrl);
  }
}
```

### Adding New Endpoints

#### 1. Update Environment Interface

```typescript
// src/environments/environment.model.ts
export interface ApiEndpoints {
  products: string;
  categories: string;
  offers: string;
  submissions: string;
  stores: string;  // ← New endpoint
}
```

#### 2. Update Environment Files

```typescript
// src/environments/environment.ts
apiEndpoints: {
  products: '/api/buyback/products',
  categories: '/api/buyback/categories',
  offers: '/api/buyback/offers',
  submissions: '/api/buyback/submissions',
  stores: '/api/stores'  // ← New endpoint
}
```

#### 3. Update APIService

```typescript
// src/app/core/services/api.service.ts
export class APIService {
  // ... existing
  public readonly stores = this.getUrl(this.endpoints.stores);  // ← New
}
```

#### 4. Use in Service

```typescript
export class StoreService {
  constructor(
    private http: HttpClient,
    private api: APIService
  ) {}

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.api.stores);
  }
}
```

## LoaderService

### Purpose

Manages loading states for SKAPA skeleton loaders throughout the application.

**IMPORTANT**: This service is for **skeleton loaders**, NOT spinners. SKAPA uses skeleton screens during content loading.

### Key Features

- **Signal-based state**
- **Global loading state**
- **Component-specific loading states**
- **Multiple concurrent loaders**

### API

```typescript
export class LoaderService {
  // Global loading state
  readonly isLoading: Signal<boolean>;

  // Methods
  show(): void;
  hide(): void;
  setLoading(key: string, isLoading: boolean): void;
  isLoadingFor(key: string): boolean;
}
```

### Usage Examples

#### Global Loading

```typescript
export class AppComponent {
  isLoading = computed(() => this.loader.isLoading());

  constructor(private loader: LoaderService) {}
}
```

```html
@if (isLoading()) {
  <skapa-skeleton variant="card"></skapa-skeleton>
} @else {
  <div class="content">Loaded content</div>
}
```

#### Component-Specific Loading

```typescript
export class ProductListComponent {
  constructor(private loader: LoaderService) {}

  loadProducts(): void {
    this.loader.setLoading('products', true);

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loader.setLoading('products', false);
      },
      error: () => {
        this.loader.setLoading('products', false);
      }
    });
  }

  isProductsLoading(): boolean {
    return this.loader.isLoadingFor('products');
  }
}
```

```html
@if (isProductsLoading()) {
  <skapa-skeleton variant="list" items="5"></skapa-skeleton>
} @else {
  @for (product of products(); track product.id) {
    <app-product-card [product]="product"></app-product-card>
  }
}
```

#### Multiple Loaders

```typescript
export class DashboardComponent {
  constructor(private loader: LoaderService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadOffers();
  }

  loadProducts(): void {
    this.loader.setLoading('products', true);
    // ... load products
    this.loader.setLoading('products', false);
  }

  loadCategories(): void {
    this.loader.setLoading('categories', true);
    // ... load categories
    this.loader.setLoading('categories', false);
  }

  loadOffers(): void {
    this.loader.setLoading('offers', true);
    // ... load offers
    this.loader.setLoading('offers', false);
  }
}
```

```html
<div class="dashboard">
  <section class="products">
    @if (loader.isLoadingFor('products')) {
      <skapa-skeleton variant="card"></skapa-skeleton>
    } @else {
      <!-- Products content -->
    }
  </section>

  <section class="categories">
    @if (loader.isLoadingFor('categories')) {
      <skapa-skeleton variant="list" items="3"></skapa-skeleton>
    } @else {
      <!-- Categories content -->
    }
  </section>

  <section class="offers">
    @if (loader.isLoadingFor('offers')) {
      <skapa-skeleton variant="text" rows="2"></skapa-skeleton>
    } @else {
      <!-- Offers content -->
    }
  </section>
</div>
```

## Service Injection Patterns

### Constructor Injection (Recommended)

```typescript
export class MyComponent {
  constructor(
    private locale: LocaleService,
    private datastore: DatastoreService,
    private utility: UtilityService
  ) {}
}
```

### inject() Function (Angular 21)

```typescript
import { inject } from '@angular/core';

export class MyComponent {
  private locale = inject(LocaleService);
  private datastore = inject(DatastoreService);
  private utility = inject(UtilityService);
}
```

### In Models

```typescript
export class ProductModel extends BaseModel {
  constructor(
    utility: UtilityService,      // From BaseModel
    datastore: DatastoreService,  // From BaseModel
    private locale: LocaleService  // Additional service
  ) {
    super(utility, datastore);
  }
}
```

## Best Practices

### ✅ Do's

1. **Use services for all business logic** - Keep components lean
2. **Inject services via constructor** - Clear dependencies
3. **Use readonly for public APIs** - Prevent external modification
4. **Provide at root level** - Singleton services
5. **Keep services focused** - Single Responsibility Principle
6. **Use signals for reactive state** - Modern Angular patterns

### ❌ Don'ts

1. **Don't put business logic in components** - Use services
2. **Don't create multiple instances** - Use `providedIn: 'root'`
3. **Don't expose private state** - Use readonly signals
4. **Don't create god services** - Keep responsibilities separate
5. **Don't bypass DatastoreService** - Use it for all storage
6. **Don't use spinners** - Use SKAPA skeleton loaders instead

## Testing Services

```typescript
describe('LocaleService', () => {
  let service: LocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocaleService);
  });

  it('should detect locale from URL', () => {
    // Mock window.location.pathname
    expect(service.currentMarket()).toBe('sa');
    expect(service.currentLanguage()).toBe('en');
  });

  it('should provide translations', () => {
    const translations = service.translations();
    expect(translations).toBeDefined();
    expect(translations.common.appTitle).toBeTruthy();
  });
});
```

---

**Next**: [Environment Configuration](./environment-configuration.md)
