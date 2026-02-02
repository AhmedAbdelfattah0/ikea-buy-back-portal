# SOLID Principles Implementation

This document explains how SOLID principles are applied throughout the IKEA Buyback Portal.

## Overview of SOLID

**SOLID** is an acronym for five design principles that make software designs more understandable, flexible, and maintainable:

- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

## Single Responsibility Principle (SRP)

> A class should have one, and only one, reason to change.

### Implementation in Our Project

#### ✅ Services - Each Has One Responsibility

```typescript
// ❌ BAD - Service doing too much
class BuybackService {
  getProducts() { }
  calculateOffer() { }
  submitBuyback() { }
  formatCurrency() { }
  translateText() { }
}

// ✅ GOOD - Separated responsibilities
class ProductService {
  getProducts() { }
}

class OfferCalculationService {
  calculateOffer() { }
}

class SubmissionService {
  submitBuyback() { }
}

class UtilityService {
  formatCurrency() { }
  translateText() { }
}
```

#### Our Service Structure

| Service | Single Responsibility |
|---------|----------------------|
| `LocaleService` | Manage market and language settings |
| `DatastoreService` | Handle localStorage/sessionStorage operations |
| `UtilityService` | Provide common utility functions |
| `APIService` | Centralize API endpoint definitions |
| `LoaderService` | Manage loading states |

#### ✅ Components - UI Only

```typescript
// src/app/features/product-discovery/pages/search/search.component.ts
@Component({
  selector: 'app-search',
  // ...
})
export class SearchComponent extends BaseComponent {
  // ✅ Component only handles UI and user interactions
  // ✅ Business logic delegated to services
  // ✅ Data transformations delegated to models

  constructor(
    private productService: ProductService,
    private searchModel: SearchModel
  ) {
    super();
  }

  onSearch(query: string): void {
    // Delegate to service
    this.productService.searchProducts(query);
  }
}
```

#### ✅ Models - Business Logic Only

```typescript
// Business logic separated from component
export class SearchModel extends BaseModel {
  // ✅ Contains business rules
  // ✅ Data transformations
  // ✅ Validation logic

  validateSearchQuery(query: string): boolean {
    return query.length >= 2;
  }

  transformResults(results: Product[]): DisplayProduct[] {
    // Business logic for transforming data
    return results.map(/* ... */);
  }
}
```

## Open/Closed Principle (OCP)

> Software entities should be open for extension but closed for modification.

### Implementation in Our Project

#### ✅ Base Classes for Extension

```typescript
// src/app/shared/base-classes/base.component.ts
@Injectable()
export class BaseComponent implements OnDestroy {
  protected ngUnSubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

// ✅ Components extend BaseComponent without modifying it
export class SearchComponent extends BaseComponent {
  // Adds new functionality without changing BaseComponent
}

export class BuybackListComponent extends BaseComponent {
  // Different component, same base, no modifications needed
}
```

#### ✅ Environment Configuration - Add Markets Without Code Changes

```typescript
// Adding new market (e.g., UAE) - no code modification needed
// Just add new environment file
// src/environments/environment.uae-prod.ts
export const environment: Environment = {
  production: true,
  market: 'uae',
  // ...
};

// Add translations
// src/app/shared/constants/translations/en-uae.constants.ts
export const EN_UAE_TRANSLATIONS: Translation = { /* ... */ };

// Update locale validation (only addition, not modification)
export const SUPPORTED_MARKETS = ['sa', 'bh', 'uae'] as const;
```

#### ✅ Service Abstraction

```typescript
// Interface defines contract
interface IProductService {
  getProducts(): Observable<Product[]>;
}

// ✅ Can swap implementations without changing consumers
class MockProductService implements IProductService {
  getProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS);
  }
}

class RealProductService implements IProductService {
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api.products);
  }
}

// Component depends on interface, not implementation
constructor(private productService: IProductService) { }
```

## Liskov Substitution Principle (LSP)

> Objects of a superclass should be replaceable with objects of a subclass without breaking the application.

### Implementation in Our Project

#### ✅ All Components Extending BaseComponent Work Identically

```typescript
// Any component extending BaseComponent can be used interchangeably
// for subscription cleanup functionality

function cleanupSubscriptions(component: BaseComponent): void {
  component.ngOnDestroy(); // Works for any BaseComponent subclass
}

// ✅ Works with SearchComponent
const search = new SearchComponent();
cleanupSubscriptions(search);

// ✅ Works with BuybackListComponent
const buybackList = new BuybackListComponent();
cleanupSubscriptions(buybackList);

// ✅ Both behave the same way regarding cleanup
```

#### ✅ Service Substitution

```typescript
// LocaleService can be swapped with MockLocaleService
class MockLocaleService extends LocaleService {
  // Override methods but maintain contract
  override getCurrentMarket(): string {
    return 'sa'; // Always return SA for testing
  }
}

// Component works with either
@Component({
  providers: [
    { provide: LocaleService, useClass: MockLocaleService } // Swap for testing
  ]
})
export class TestComponent {
  constructor(private locale: LocaleService) {
    // Works with both LocaleService and MockLocaleService
    const market = this.locale.getCurrentMarket();
  }
}
```

#### ❌ Violation Example (Avoided)

```typescript
// ❌ BAD - Subclass changes behavior unexpectedly
class EnhancedProductService extends ProductService {
  override getProducts(): Observable<Product[]> {
    throw new Error('Not implemented'); // Breaks LSP!
  }
}

// ✅ GOOD - Subclass maintains expected behavior
class CachedProductService extends ProductService {
  override getProducts(): Observable<Product[]> {
    // Adds caching but still returns products as expected
    return this.cache.get() || super.getProducts();
  }
}
```

## Interface Segregation Principle (ISP)

> Clients should not be forced to depend on interfaces they don't use.

### Implementation in Our Project

#### ✅ Specific Interfaces for Each Domain

```typescript
// src/app/shared/interfaces/

// ✅ Separate, focused interfaces

// LocaleConfig - only locale-related properties
export interface LocaleConfig {
  market: 'sa' | 'bh';
  language: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
  currency: CurrencyConfig;
}

// Translation - only translation structure
export interface Translation {
  common: CommonTranslations;
  productDiscovery: ProductDiscoveryTranslations;
  // ...
}

// Environment - only environment config
export interface Environment {
  production: boolean;
  apiBaseUrl: string;
  apiEndpoints: ApiEndpoints;
  // ...
}

// ❌ BAD - Fat interface forcing unused dependencies
interface MegaConfig {
  market: string;
  language: string;
  translations: Translation;
  apiEndpoints: ApiEndpoints;
  themeSettings: ThemeConfig;
  analyticsConfig: AnalyticsConfig;
  // Components forced to depend on everything!
}
```

#### ✅ Component Inputs - Only What's Needed

```typescript
// ✅ Component receives only what it needs
@Component({
  selector: 'app-product-card'
})
export class ProductCardComponent {
  @Input() product!: Product; // Only product data
  @Input() showCondition: boolean = false; // Only condition flag

  // Not forced to accept entire product service, offers, etc.
}

// Usage
<app-product-card
  [product]="item"
  [showCondition]="true">
</app-product-card>
```

#### ✅ Service Methods - Focused Responsibilities

```typescript
// src/app/core/services/datastore.service.ts

// ✅ Specific helper methods instead of one giant interface
export class DatastoreService {
  // Buyback-specific
  getBuybackList<T>(): T[]
  setBuybackList<T>(items: T[]): void
  clearBuybackList(): void

  // Family member specific
  isFamilyMember(): boolean
  setFamilyMemberStatus(isMember: boolean): void

  // Store specific
  getSelectedStore(): string | null
  setSelectedStore(storeId: string): void

  // Generic methods
  setItem<T>(key: string, value: T): void
  getItem<T>(key: string): T | null
}

// Clients use only what they need
class BuybackListService {
  constructor(private datastore: DatastoreService) {}

  loadList() {
    // Only uses buyback-specific methods
    return this.datastore.getBuybackList();
  }
}
```

## Dependency Inversion Principle (DIP)

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

### Implementation in Our Project

#### ✅ Dependency Injection Throughout

```typescript
// ✅ Components depend on abstractions (services), not implementations

@Component({
  selector: 'app-search'
})
export class SearchComponent {
  // Depends on service abstraction, not concrete HTTP implementation
  constructor(
    private productService: ProductService, // Abstraction
    private locale: LocaleService,          // Abstraction
    private utility: UtilityService         // Abstraction
  ) {}
}

// Services can be swapped without changing component
providers: [
  { provide: ProductService, useClass: MockProductService } // Easy swap
]
```

#### ✅ Configuration Over Hardcoding

```typescript
// ❌ BAD - Hard-coded dependency
class ProductService {
  private apiUrl = 'https://api.ikea.sa/products'; // Hard-coded!

  getProducts() {
    return this.http.get(this.apiUrl);
  }
}

// ✅ GOOD - Depends on configuration abstraction
class ProductService {
  constructor(
    private http: HttpClient,
    private api: APIService  // Configuration abstraction
  ) {}

  getProducts() {
    return this.http.get(this.api.products); // Configurable
  }
}
```

#### ✅ Environment Abstraction

```typescript
// src/app/core/services/api.service.ts

// ✅ API service depends on environment config, not hard-coded URLs
@Injectable({
  providedIn: 'root'
})
export class APIService {
  private baseUrl = environment.apiBaseUrl;        // Abstraction
  private endpoints = environment.apiEndpoints;    // Abstraction

  public readonly products = this.getUrl(this.endpoints.products);
}

// Easy to swap environments
import { environment } from '../environments/environment.sa-prod';
import { environment } from '../environments/environment.bh-qa';
```

#### ✅ Mock Services for Testing

```typescript
// High-level component doesn't change when we swap implementations

// Production
providers: [
  ProductService,
  OfferCalculationService,
  SubmissionService
]

// Testing
providers: [
  { provide: ProductService, useClass: MockProductService },
  { provide: OfferCalculationService, useClass: MockOfferService },
  { provide: SubmissionService, useClass: MockSubmissionService }
]

// Component code remains unchanged!
```

## Benefits of SOLID in This Project

### 1. Maintainability
- Changes isolated to specific areas
- Easy to understand code purpose
- Clear responsibilities

### 2. Testability
- Services can be easily mocked
- Components test UI only
- Business logic tested separately

### 3. Scalability
- Add new features without modifying existing code
- Add new markets with configuration only
- Extend functionality via inheritance

### 4. Flexibility
- Swap implementations easily (mock ↔ real)
- Change business rules in one place
- Adapt to new requirements quickly

### 5. Team Collaboration
- Clear ownership of responsibilities
- Parallel development possible
- Less merge conflicts

## Code Review Checklist

When reviewing code, ensure:

- [ ] **SRP**: Does each class/function have only one responsibility?
- [ ] **OCP**: Can we extend behavior without modifying existing code?
- [ ] **LSP**: Do subclasses maintain parent behavior contracts?
- [ ] **ISP**: Are interfaces focused and minimal?
- [ ] **DIP**: Do we depend on abstractions, not concretions?

## Common Violations to Avoid

### ❌ God Objects

```typescript
// ❌ One service doing everything
class AppService {
  getProducts() {}
  calculateOffer() {}
  submitBuyback() {}
  translateText() {}
  formatDate() {}
  validateEmail() {}
}
```

### ❌ Tight Coupling

```typescript
// ❌ Component directly using HttpClient
class ProductComponent {
  constructor(private http: HttpClient) {}

  loadProducts() {
    this.http.get('https://api.example.com/products');
  }
}
```

### ❌ Inheritance for Code Reuse

```typescript
// ❌ Using inheritance just to share utility methods
class ProductComponent extends UtilityMethods {
  // Now forced to inherit all utility methods
}

// ✅ Use composition instead
class ProductComponent {
  constructor(private utility: UtilityService) {}
}
```

---

**Next**: [Component Architecture](./component-architecture.md)
