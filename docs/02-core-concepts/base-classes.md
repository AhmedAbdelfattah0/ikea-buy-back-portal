# Base Classes

## Overview

The IKEA Buyback Portal uses **base classes** to provide common functionality to all components and models. This follows the **DRY (Don't Repeat Yourself)** principle and ensures consistency across the application.

## BaseComponent

### Purpose

`BaseComponent` provides:
- **Automatic subscription cleanup** via `ngUnSubscribe` Subject
- **Centralized SKAPA imports** (when implemented)
- **Common component functionality**

### Location

```
src/app/shared/base-classes/base.component.ts
```

### Implementation

```typescript
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class BaseComponent implements OnDestroy {
  /**
   * Subject used to automatically unsubscribe from observables
   * when the component is destroyed.
   *
   * Usage in derived components:
   * someObservable$
   *   .pipe(takeUntil(this.ngUnSubscribe))
   *   .subscribe(data => { ... });
   */
  protected ngUnSubscribe = new Subject<void>();

  /**
   * Automatically called when component is destroyed.
   * Completes all active subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
```

### Key Features

#### 1. Automatic Subscription Cleanup

Prevents memory leaks by automatically unsubscribing from all observables when the component is destroyed.

```typescript
import { takeUntil } from 'rxjs/operators';

export class ProductSearchComponent extends BaseComponent {
  constructor(private productService: ProductService) {
    super();
  }

  loadProducts(): void {
    this.productService.searchProducts('sofa')
      .pipe(takeUntil(this.ngUnSubscribe))  // ← Automatic cleanup
      .subscribe({
        next: (products) => {
          this.products.set(products);
        },
        error: (error) => {
          console.error(error);
        }
      });
  }
}
```

#### 2. Injectable Decorator

`@Injectable()` allows BaseComponent to be extended and use dependency injection.

#### 3. OnDestroy Implementation

Ensures proper cleanup lifecycle is followed.

## BaseModel

### Purpose

`BaseModel` provides:
- **Access to common services** (UtilityService, DatastoreService)
- **Subscription cleanup** for models
- **Common business logic methods**

### Location

```
src/app/shared/base-classes/base.model.ts
```

### Implementation

```typescript
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { UtilityService } from '../../core/services/utility.service';
import { DatastoreService } from '../../core/services/datastore.service';

@Injectable()
export class BaseModel implements OnDestroy {
  /**
   * Subject for automatic subscription cleanup
   */
  protected ngUnSubscribe = new Subject<void>();

  /**
   * All models have access to utility and datastore services
   */
  constructor(
    public utility: UtilityService,
    public datastore: DatastoreService
  ) {}

  /**
   * Get language constants (example method)
   * Can be used by derived models
   */
  public getLang(): Observable<any> {
    return of(this.utility.getLanguageConstants());
  }

  /**
   * Cleanup subscriptions when model is destroyed
   */
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
```

### Key Features

#### 1. Service Access

All models automatically have access to:
- **UtilityService** - For formatting, validation, common utilities
- **DatastoreService** - For localStorage/sessionStorage access

```typescript
export class ProductModel extends BaseModel {
  constructor(utility: UtilityService, datastore: DatastoreService) {
    super(utility, datastore);
  }

  formatPrice(price: number): string {
    return this.utility.formatCurrency(price, 'SAR');
  }

  saveToStorage(product: Product): void {
    this.datastore.setItem('selectedProduct', product);
  }
}
```

#### 2. Subscription Cleanup

Models can also have observables that need cleanup:

```typescript
export class BuybackListModel extends BaseModel {
  private itemsSubject = new BehaviorSubject<BuybackItem[]>([]);

  loadItems(): void {
    this.datastore.getBuybackList<BuybackItem>()
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(items => this.itemsSubject.next(items));
  }
}
```

#### 3. Common Business Logic

Methods like `getLang()` can be shared across all models.

## Usage Patterns

### Component Pattern

#### 1. Basic Component

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../shared/base-classes/base.component';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss'
})
export class ProductSearchComponent extends BaseComponent {
  constructor() {
    super();  // Always call super()
  }
}
```

#### 2. Component with Services

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../shared/base-classes/base.component';
import { ProductService } from '../../services/product.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent extends BaseComponent {
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);

  constructor(
    private productService: ProductService,
    private locale: LocaleService
  ) {
    super();  // Must call super()
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoading.set(true);

    this.productService.getProducts()
      .pipe(takeUntil(this.ngUnSubscribe))  // ← BaseComponent cleanup
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.isLoading.set(false);
        }
      });
  }
}
```

#### 3. Component with Multiple Subscriptions

```typescript
export class BuybackListComponent extends BaseComponent {
  items = signal<BuybackItem[]>([]);
  total = signal<number>(0);

  constructor(
    private buybackService: BuybackListService,
    private offerService: OfferCalculationService
  ) {
    super();
  }

  ngOnInit(): void {
    // Subscription 1
    this.buybackService.getItems()
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(items => this.items.set(items));

    // Subscription 2
    this.offerService.calculateTotal()
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(total => this.total.set(total));

    // Both automatically cleaned up on destroy!
  }
}
```

### Model Pattern

#### 1. Basic Model

```typescript
import { Injectable } from '@angular/core';
import { BaseModel } from '../../../shared/base-classes/base.model';
import { UtilityService } from '../../../core/services/utility.service';
import { DatastoreService } from '../../../core/services/datastore.service';

@Injectable({
  providedIn: 'root'
})
export class ProductModel extends BaseModel {
  constructor(
    utility: UtilityService,
    datastore: DatastoreService
  ) {
    super(utility, datastore);  // Must call super()
  }

  validateProduct(product: Product): boolean {
    if (!product.name || product.name.length < 2) {
      return false;
    }
    return true;
  }

  formatProductForDisplay(product: Product): DisplayProduct {
    return {
      ...product,
      formattedPrice: this.utility.formatCurrency(product.price, 'SAR'),
      formattedDate: this.utility.formatDate(product.createdAt)
    };
  }
}
```

#### 2. Model with Storage

```typescript
export class BuybackListModel extends BaseModel {
  private readonly STORAGE_KEY = 'buyback_list';

  getStoredItems(): BuybackItem[] {
    return this.datastore.getItem<BuybackItem[]>(this.STORAGE_KEY) || [];
  }

  saveItems(items: BuybackItem[]): void {
    this.datastore.setItem(this.STORAGE_KEY, items);
  }

  calculateTotal(items: BuybackItem[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
  }

  formatTotal(total: number, currency: string): string {
    return this.utility.formatCurrency(total, currency);
  }
}
```

#### 3. Model with Validation

```typescript
export class SubmissionModel extends BaseModel {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateSubmission(data: SubmissionData): ValidationResult {
    const errors: string[] = [];

    if (!this.validateEmail(data.email)) {
      errors.push('Invalid email address');
    }

    if (!data.storeLocation) {
      errors.push('Store location is required');
    }

    if (!data.items || data.items.length === 0) {
      errors.push('No items in buyback list');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  generateQuotationNumber(): string {
    return this.utility.generateId('BB');  // e.g., "BB-1234567890"
  }
}
```

## Component + Model Pattern

Combine components and models for clean separation:

```typescript
// product-search.model.ts
@Injectable({
  providedIn: 'root'
})
export class ProductSearchModel extends BaseModel {
  validateSearchQuery(query: string): boolean {
    return query.trim().length >= 2;
  }

  transformResults(results: Product[]): DisplayProduct[] {
    return results.map(product => ({
      ...product,
      displayPrice: this.utility.formatCurrency(product.price, 'SAR'),
      displayDate: this.utility.formatDate(product.createdAt)
    }));
  }
}

// product-search.component.ts
export class ProductSearchComponent extends BaseComponent {
  searchQuery = signal<string>('');
  products = signal<DisplayProduct[]>([]);

  constructor(
    private productService: ProductService,
    private searchModel: ProductSearchModel  // ← Inject model
  ) {
    super();
  }

  onSearch(): void {
    const query = this.searchQuery();

    // Use model for validation
    if (!this.searchModel.validateSearchQuery(query)) {
      return;
    }

    this.productService.searchProducts(query)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(results => {
        // Use model for transformation
        const displayProducts = this.searchModel.transformResults(results);
        this.products.set(displayProducts);
      });
  }
}
```

## Benefits

### 1. DRY Principle

Write subscription cleanup once, use everywhere:

```typescript
// Without BaseComponent (repeated in every component)
export class Component1 {
  private destroy$ = new Subject<void>();
  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
}

export class Component2 {
  private destroy$ = new Subject<void>();
  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
}

// With BaseComponent (write once, use everywhere)
export class Component1 extends BaseComponent { }
export class Component2 extends BaseComponent { }
```

### 2. Consistency

All components follow the same pattern for cleanup.

### 3. Reduced Boilerplate

Less code in every component/model.

### 4. Centralized Functionality

Add new common functionality in one place:

```typescript
// Add to BaseComponent
export class BaseComponent implements OnDestroy {
  // ... existing code

  protected trackById(index: number, item: any): any {
    return item.id || index;
  }
}

// Now all components can use it
@for (product of products(); track trackById($index, product)) {
  <app-product-card [product]="product" />
}
```

## Common Pitfalls

### ❌ Forgetting to Call super()

```typescript
// ❌ WRONG
export class MyComponent extends BaseComponent {
  constructor(private service: MyService) {
    // Missing super()!
  }
}

// ✅ CORRECT
export class MyComponent extends BaseComponent {
  constructor(private service: MyService) {
    super();  // Must call super()
  }
}
```

### ❌ Not Using takeUntil

```typescript
// ❌ WRONG - Memory leak!
export class MyComponent extends BaseComponent {
  ngOnInit() {
    this.service.getData().subscribe(data => {
      // This subscription never gets cleaned up!
    });
  }
}

// ✅ CORRECT
export class MyComponent extends BaseComponent {
  ngOnInit() {
    this.service.getData()
      .pipe(takeUntil(this.ngUnSubscribe))  // ← Cleanup
      .subscribe(data => { });
  }
}
```

### ❌ Overriding ngOnDestroy Without Calling super

```typescript
// ❌ WRONG
export class MyComponent extends BaseComponent {
  ngOnDestroy() {
    // Custom cleanup
    this.myCleanup();
    // Forgot to call super.ngOnDestroy()!
  }
}

// ✅ CORRECT
export class MyComponent extends BaseComponent {
  override ngOnDestroy() {
    this.myCleanup();
    super.ngOnDestroy();  // Must call super
  }
}
```

## Advanced Usage

### Custom Base Component for Features

Create feature-specific base components:

```typescript
// src/app/features/product-discovery/base/product-base.component.ts
export abstract class ProductBaseComponent extends BaseComponent {
  translations = computed(() => this.locale.translations().productDiscovery);

  constructor(
    protected locale: LocaleService,
    protected loader: LoaderService
  ) {
    super();
  }

  protected showLoader(): void {
    this.loader.show();
  }

  protected hideLoader(): void {
    this.loader.hide();
  }
}

// Feature components extend ProductBaseComponent
export class SearchComponent extends ProductBaseComponent {
  constructor(
    locale: LocaleService,
    loader: LoaderService,
    private productService: ProductService
  ) {
    super(locale, loader);
  }

  // Automatic access to translations, showLoader, hideLoader
}
```

### Shared Signals in Base Class

```typescript
export class BaseComponent implements OnDestroy {
  protected ngUnSubscribe = new Subject<void>();

  // Shared loading state
  protected isLoading = signal<boolean>(false);

  // Shared error state
  protected error = signal<string | null>(null);

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

// Now all components have loading and error states
export class MyComponent extends BaseComponent {
  loadData() {
    this.isLoading.set(true);
    this.error.set(null);

    this.service.getData()
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe({
        next: (data) => this.isLoading.set(false),
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
        }
      });
  }
}
```

## Best Practices

### ✅ Do's

1. **Always extend BaseComponent** for all components
2. **Always call super()** in constructor
3. **Use takeUntil(this.ngUnSubscribe)** for all subscriptions
4. **Extend BaseModel** for all business logic models
5. **Keep base classes simple** - Only common functionality
6. **Document additions** to base classes

### ❌ Don'ts

1. **Don't add feature-specific code** to base classes
2. **Don't forget to call super()** in constructor
3. **Don't override ngOnDestroy** without calling super
4. **Don't skip takeUntil** on subscriptions
5. **Don't create multiple base components** for the same purpose

## Testing with Base Classes

```typescript
describe('ProductSearchComponent', () => {
  let component: ProductSearchComponent;

  beforeEach(() => {
    component = new ProductSearchComponent(/* dependencies */);
  });

  afterEach(() => {
    // BaseComponent cleanup is automatic
    component.ngOnDestroy();
  });

  it('should cleanup subscriptions on destroy', () => {
    const spy = spyOn(component['ngUnSubscribe'], 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
```

---

**Next**: [Services Overview](./services-overview.md)
