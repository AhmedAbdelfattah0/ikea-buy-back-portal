# Dependency Injection

## Overview

Dependency Injection (DI) is a fundamental design pattern in Angular that enables loose coupling, testability, and maintainability. The IKEA Buyback Portal leverages Angular's DI system throughout the application.

## What is Dependency Injection?

**Definition**: A design pattern where a class receives its dependencies from external sources rather than creating them itself.

### Without DI (Tight Coupling)

```typescript
// ❌ BAD - Hard to test, tightly coupled
export class ProductListComponent {
  private productService: ProductService;

  constructor() {
    // Component creates its own dependency
    this.productService = new ProductService(
      new HttpClient(),
      new APIService()
    );
  }
}
```

**Problems**:
- Hard to test (can't mock ProductService)
- Tightly coupled to ProductService implementation
- Must know all dependencies of ProductService
- Can't swap implementations

### With DI (Loose Coupling)

```typescript
// ✅ GOOD - Easy to test, loosely coupled
export class ProductListComponent {
  constructor(private productService: ProductService) {
    // Angular injects the dependency
  }
}
```

**Benefits**:
- Easy to test (can inject mocks)
- Loosely coupled
- Don't need to know transitive dependencies
- Can swap implementations easily

## Injectable Services

### Providing Services at Root

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // ← Singleton, available app-wide
})
export class LocaleService {
  // Service implementation
}
```

**Characteristics**:
- **Singleton** - Only one instance created
- **Tree-shakable** - Removed if not used
- **Available everywhere** - Can inject in any component/service
- **Recommended** - Use for most services

### Component-Level Providers

```typescript
@Component({
  selector: 'app-my-component',
  providers: [MySpecificService]  // ← New instance per component
})
export class MyComponent {
  constructor(private service: MySpecificService) {}
}
```

**Characteristics**:
- **New instance** - Each component gets its own instance
- **Scoped** - Only available to component and children
- **Use sparingly** - Most services should be root-level

## Injection Methods

### 1. Constructor Injection (Traditional)

```typescript
export class ProductSearchComponent {
  constructor(
    private productService: ProductService,
    private locale: LocaleService,
    private router: Router
  ) {}
}
```

**When to use**:
- Most components and services
- When you need dependencies in constructor
- Standard Angular pattern

### 2. inject() Function (Modern)

```typescript
import { inject } from '@angular/core';

export class ProductSearchComponent {
  private productService = inject(ProductService);
  private locale = inject(LocaleService);
  private router = inject(Router);

  // Can use immediately
  translations = computed(() => this.locale.translations());
}
```

**When to use**:
- Angular 14+
- When you want to use dependencies immediately
- Functional composition
- Creating derived signals

**Advantages**:
- More concise
- Can use in property initializers
- Better TypeScript inference
- Easier to compose

### 3. Optional Dependencies

```typescript
import { Optional } from '@angular/core';

export class MyComponent {
  constructor(
    @Optional() private analyticsService?: AnalyticsService
  ) {
    if (this.analyticsService) {
      this.analyticsService.track('component_loaded');
    }
  }
}
```

**When to use**:
- Dependency might not be available
- Feature flags or conditional features
- Graceful degradation

## Service Dependencies

### Service Injecting Service

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(
    private http: HttpClient,
    private api: APIService,
    private locale: LocaleService
  ) {}

  getProducts(): Observable<Product[]> {
    const market = this.locale.currentMarket();
    return this.http.get<Product[]>(
      `${this.api.products}?market=${market}`
    );
  }
}
```

### Avoiding Circular Dependencies

```typescript
// ❌ BAD - Circular dependency
// service-a.ts
@Injectable({ providedIn: 'root' })
export class ServiceA {
  constructor(private serviceB: ServiceB) {}
}

// service-b.ts
@Injectable({ providedIn: 'root' })
export class ServiceB {
  constructor(private serviceA: ServiceA) {}  // Circular!
}

// ✅ GOOD - Extract shared logic to third service
// service-a.ts
@Injectable({ providedIn: 'root' })
export class ServiceA {
  constructor(private shared: SharedService) {}
}

// service-b.ts
@Injectable({ providedIn: 'root' })
export class ServiceB {
  constructor(private shared: SharedService) {}
}

// shared.service.ts
@Injectable({ providedIn: 'root' })
export class SharedService {
  // Shared logic
}
```

## Models with Dependencies

### BaseModel Pattern

```typescript
@Injectable()
export class BaseModel {
  constructor(
    public utility: UtilityService,
    public datastore: DatastoreService
  ) {}
}
```

### Feature Model Extending BaseModel

```typescript
@Injectable({ providedIn: 'root' })
export class ProductModel extends BaseModel {
  constructor(
    utility: UtilityService,
    datastore: DatastoreService,
    private locale: LocaleService  // Additional dependency
  ) {
    super(utility, datastore);
  }

  formatPrice(price: number): string {
    const currency = this.locale.currencyConfig();
    return this.utility.formatCurrency(price, currency.code);
  }
}
```

## Injection Tokens

### String Tokens (InjectionToken)

```typescript
import { InjectionToken } from '@angular/core';

// Define token
export const API_BASE_URL = new InjectionToken<string>('API Base URL');

// Provide value
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_BASE_URL, useValue: 'https://api.ikea.sa' }
  ]
};

// Inject
export class APIService {
  constructor(@Inject(API_BASE_URL) private baseUrl: string) {
    console.log('Base URL:', this.baseUrl);
  }
}
```

### Factory Providers

```typescript
// Factory function
export function createApiService(
  http: HttpClient,
  baseUrl: string
): APIService {
  return new APIService(http, baseUrl);
}

// Provide with factory
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APIService,
      useFactory: createApiService,
      deps: [HttpClient, API_BASE_URL]
    }
  ]
};
```

### APP_BASE_HREF Example

```typescript
// src/app/app.config.ts
import { APP_BASE_HREF } from '@angular/common';

export function getBaseHref(): string {
  const pathSegments = window.location.pathname.split('/').filter(s => s);
  const market = pathSegments[0] || 'sa';
  const language = pathSegments[1] || 'en';

  // Validate and set direction
  const validMarkets = ['sa', 'bh'];
  const validLanguages = ['en', 'ar'];

  const finalMarket = validMarkets.includes(market) ? market : 'sa';
  const finalLanguage = validLanguages.includes(language) ? language : 'en';

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
    { provide: APP_BASE_HREF, useFactory: getBaseHref }
  ]
};
```

## Multi-Providers

### HTTP Interceptors

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true  // ← Multiple interceptors
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true
    }
  ]
};
```

## Testing with DI

### Mocking Dependencies

```typescript
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  let apiMock: jasmine.SpyObj<APIService>;

  beforeEach(() => {
    // Create mocks
    httpMock = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    apiMock = jasmine.createSpyObj('APIService', ['products']);

    // Configure TestBed
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: HttpClient, useValue: httpMock },
        { provide: APIService, useValue: apiMock }
      ]
    });

    service = TestBed.inject(ProductService);
  });

  it('should fetch products', () => {
    const mockProducts = [{ id: '1', name: 'Test' }];
    httpMock.get.and.returnValue(of(mockProducts));

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
  });
});
```

### Component Testing

```typescript
describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);

    TestBed.configureTestingModule({
      imports: [ProductListComponent],  // Standalone component
      providers: [
        { provide: ProductService, useValue: mockProductService }
      ]
    });

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should load products on init', () => {
    const mockProducts = [{ id: '1', name: 'Test' }];
    mockProductService.getProducts.and.returnValue(of(mockProducts));

    component.ngOnInit();

    expect(component.products()).toEqual(mockProducts);
  });
});
```

## Hierarchical Injectors

### Root Injector

```typescript
// Provided in root - singleton
@Injectable({ providedIn: 'root' })
export class GlobalService {}
```

### Component Injector

```typescript
// Provided in component - new instance per component
@Component({
  providers: [LocalService]
})
export class MyComponent {
  constructor(private local: LocalService) {}
}
```

### Injector Hierarchy

```
AppComponent
├── provides: [RootService]
│
├── FeatureComponent
│   ├── provides: [FeatureService]
│   │
│   └── ChildComponent
│       ├── provides: [ChildService]
│       └── can inject: ChildService, FeatureService, RootService
```

**Resolution**:
1. Look in component's providers
2. Look in parent component's providers
3. Continue up to root
4. Error if not found

## Common DI Patterns

### 1. Service Locator (Anti-Pattern)

```typescript
// ❌ BAD - Service locator pattern
export class MyComponent {
  constructor(private injector: Injector) {
    const service = this.injector.get(MyService);
  }
}

// ✅ GOOD - Direct injection
export class MyComponent {
  constructor(private service: MyService) {}
}
```

### 2. Factory Pattern

```typescript
// Factory service
@Injectable({ providedIn: 'root' })
export class ProductFactory {
  constructor(
    private utility: UtilityService,
    private locale: LocaleService
  ) {}

  createProduct(data: ProductData): Product {
    return new Product(
      data,
      this.utility,
      this.locale
    );
  }
}

// Usage
export class ProductListComponent {
  constructor(private factory: ProductFactory) {}

  loadProduct(data: ProductData): void {
    const product = this.factory.createProduct(data);
  }
}
```

### 3. Strategy Pattern

```typescript
// Strategy interface
export interface PriceCalculationStrategy {
  calculate(price: number): number;
}

// Implementations
@Injectable()
export class FamilyMemberStrategy implements PriceCalculationStrategy {
  calculate(price: number): number {
    return price * 0.9;  // 10% discount
  }
}

@Injectable()
export class RegularStrategy implements PriceCalculationStrategy {
  calculate(price: number): number {
    return price;
  }
}

// Service using strategy
@Injectable({ providedIn: 'root' })
export class PriceService {
  private strategy!: PriceCalculationStrategy;

  constructor(private injector: Injector) {}

  setStrategy(isFamilyMember: boolean): void {
    this.strategy = isFamilyMember
      ? this.injector.get(FamilyMemberStrategy)
      : this.injector.get(RegularStrategy);
  }

  calculatePrice(basePrice: number): number {
    return this.strategy.calculate(basePrice);
  }
}
```

## Environment-Based Injection

### Development vs Production

```typescript
// Development service
@Injectable()
export class MockProductService {
  getProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS);
  }
}

// Production service
@Injectable()
export class RealProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }
}

// app.config.ts
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: ProductService,
      useClass: environment.production
        ? RealProductService
        : MockProductService
    }
  ]
};
```

## Best Practices

### ✅ Do's

1. **Use providedIn: 'root' for most services** - Singleton, tree-shakable
2. **Inject dependencies, don't create them** - Loose coupling
3. **Use interfaces for abstraction** - Dependency Inversion Principle
4. **Keep constructors simple** - Only assign dependencies
5. **Use inject() for modern code** - More concise
6. **Test with mocks** - Easy with DI
7. **Provide at the right level** - Root for singletons, component for scoped

### ❌ Don'ts

1. **Don't use new keyword for services** - Let Angular inject
2. **Don't create circular dependencies** - Extract shared logic
3. **Don't use Injector.get() unless necessary** - Direct injection preferred
4. **Don't put logic in constructors** - Use ngOnInit
5. **Don't over-provide** - Default to root level
6. **Don't forget @Injectable()** - Required for services
7. **Don't mix DI and manual instantiation** - Choose one pattern

## Troubleshooting

### Error: NullInjectorError

**Problem**: No provider for ServiceName

**Solutions**:
```typescript
// 1. Add @Injectable with providedIn
@Injectable({ providedIn: 'root' })
export class MyService {}

// 2. Or add to providers
export const appConfig: ApplicationConfig = {
  providers: [MyService]
};
```

### Error: Circular dependency

**Problem**: ServiceA → ServiceB → ServiceA

**Solution**: Extract shared logic to third service
```typescript
// Create SharedService
@Injectable({ providedIn: 'root' })
export class SharedService {}

// ServiceA uses SharedService
export class ServiceA {
  constructor(private shared: SharedService) {}
}

// ServiceB uses SharedService
export class ServiceB {
  constructor(private shared: SharedService) {}
}
```

### Warning: Multiple instances created

**Problem**: Service provided at component level when singleton expected

**Solution**: Use `providedIn: 'root'`
```typescript
// ❌ Creates new instance per component
@Component({
  providers: [MyService]
})

// ✅ Singleton
@Injectable({ providedIn: 'root' })
export class MyService {}
```

---

**Next**: [Translation System](../02-core-concepts/translation-system.md)
