# State Management

## Overview

The IKEA Buyback Portal uses **Angular Signals** as the primary state management solution. This provides reactive, performant, and type-safe state management without the complexity of third-party libraries like NgRx or Akita.

## Why Angular Signals?

### Advantages

1. **Built-in** - No external dependencies
2. **Simple** - Easy to learn and use
3. **Performant** - Fine-grained reactivity
4. **Type-safe** - Full TypeScript support
5. **Reactive** - Automatic change detection
6. **Composable** - Computed values and effects

### Comparison with Other Solutions

| Feature | Signals | NgRx | Akita | BehaviorSubject |
|---------|---------|------|-------|-----------------|
| Learning Curve | Low | High | Medium | Medium |
| Boilerplate | Minimal | High | Medium | Low |
| DevTools | Built-in | Yes | Yes | No |
| Bundle Size | 0 KB | ~50 KB | ~20 KB | 0 KB |
| Reactivity | Fine-grained | Coarse | Coarse | Coarse |
| Type Safety | Excellent | Good | Good | Good |

## Signal Basics

### Creating Signals

```typescript
import { signal } from '@angular/core';

export class ProductListComponent {
  // Writable signal with initial value
  products = signal<Product[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);
  selectedId = signal<string | null>(null);
}
```

### Reading Signal Values

```typescript
// In TypeScript - call signal as function
const products = this.products();
const query = this.searchQuery();
const loading = this.isLoading();

// In templates - call signal as function
```

```html
<p>Found {{ products().length }} products</p>
<p>Searching for: {{ searchQuery() }}</p>

@if (isLoading()) {
  <skapa-skeleton variant="card"></skapa-skeleton>
}
```

### Updating Signals

```typescript
// set() - Replace entire value
this.searchQuery.set('sofa');
this.isLoading.set(true);
this.products.set([product1, product2, product3]);

// update() - Update based on current value
this.products.update(products => [...products, newProduct]);
this.selectedId.update(id => id === '123' ? null : '123');

// For arrays
this.products.update(products =>
  products.filter(p => p.id !== productId)
);

this.products.update(products =>
  products.map(p => p.id === productId ? updatedProduct : p)
);
```

## Computed Signals

### Basic Computed Values

```typescript
import { computed } from '@angular/core';

export class ProductListComponent {
  products = signal<Product[]>([]);
  searchQuery = signal<string>('');

  // Computed - automatically updates when dependencies change
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(query)
    );
  });

  productCount = computed(() => this.filteredProducts().length);

  hasProducts = computed(() => this.productCount() > 0);
}
```

```html
<p>Found {{ productCount() }} products</p>

@if (hasProducts()) {
  @for (product of filteredProducts(); track product.id) {
    <app-product-card [product]="product"></app-product-card>
  }
} @else {
  <p>No products found</p>
}
```

### Complex Computed Values

```typescript
export class BuybackListComponent {
  items = signal<BuybackItem[]>([]);
  isFamilyMember = signal<boolean>(false);

  // Computed subtotal
  subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price, 0)
  );

  // Computed discount
  discount = computed(() => {
    const subtotal = this.subtotal();
    return this.isFamilyMember() ? subtotal * 0.1 : 0;
  });

  // Computed total (depends on other computed values)
  total = computed(() => this.subtotal() - this.discount());

  // Computed formatted total
  formattedTotal = computed(() => {
    const total = this.total();
    const currency = this.locale.currencyConfig();
    return `${total.toFixed(currency.decimalPlaces)} ${currency.symbol}`;
  });

  constructor(private locale: LocaleService) {}
}
```

### Computed with Multiple Dependencies

```typescript
export class OfferCalculationComponent {
  items = signal<BuybackItem[]>([]);
  isFamilyMember = signal<boolean>(false);
  selectedStore = signal<Store | null>(null);
  promoCode = signal<string>('');

  // Depends on items, isFamilyMember, selectedStore, promoCode
  finalOffer = computed(() => {
    const items = this.items();
    const isMember = this.isFamilyMember();
    const store = this.selectedStore();
    const promo = this.promoCode();

    let total = items.reduce((sum, item) => sum + item.price, 0);

    // Family member discount
    if (isMember) {
      total *= 0.9;
    }

    // Store-specific discount
    if (store?.hasPromo) {
      total *= 0.95;
    }

    // Promo code discount
    if (promo === 'SAVE10') {
      total *= 0.9;
    }

    return total;
  });
}
```

## Effects

### Basic Effects

```typescript
import { effect } from '@angular/core';

export class BuybackListComponent {
  items = signal<BuybackItem[]>([]);

  constructor(private datastore: DatastoreService) {
    // Effect runs when items changes
    effect(() => {
      const items = this.items();

      // Save to localStorage whenever items change
      this.datastore.setBuybackList(items);

      console.log(`Saved ${items.length} items to storage`);
    });
  }
}
```

### Effects with Cleanup

```typescript
export class SearchComponent {
  searchQuery = signal<string>('');

  constructor() {
    effect((onCleanup) => {
      const query = this.searchQuery();

      // Set up timeout
      const timeoutId = setTimeout(() => {
        console.log('Searching for:', query);
        this.performSearch(query);
      }, 300);

      // Cleanup function
      onCleanup(() => {
        clearTimeout(timeoutId);
      });
    });
  }
}
```

### Conditional Effects

```typescript
export class AnalyticsComponent {
  constructor() {
    effect(() => {
      if (environment.featureFlags.enableAnalytics) {
        const event = this.currentEvent();
        this.trackEvent(event);
      }
    });
  }
}
```

## State Layers

### 1. Component State (Local)

State used only within a single component.

```typescript
export class SearchComponent {
  // Local state - only used in this component
  private searchQuery = signal<string>('');
  private isSearching = signal<boolean>(false);
  private searchResults = signal<Product[]>([]);

  // Computed from local state
  hasResults = computed(() => this.searchResults().length > 0);
}
```

### 2. Service State (Shared)

State shared across multiple components via services.

```typescript
@Injectable({ providedIn: 'root' })
export class BuybackListService {
  // Shared state - accessible from any component
  private _items = signal<BuybackItem[]>([]);

  // Expose as readonly
  readonly items = this._items.asReadonly();

  // Computed from shared state
  readonly itemCount = computed(() => this._items().length);
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price, 0)
  );

  // Methods to update shared state
  addItem(item: BuybackItem): void {
    this._items.update(items => [...items, item]);
  }

  removeItem(itemId: string): void {
    this._items.update(items => items.filter(i => i.id !== itemId));
  }

  clear(): void {
    this._items.set([]);
  }
}
```

```typescript
// Component A
export class ProductSelectionComponent {
  constructor(private buybackList: BuybackListService) {}

  selectProduct(product: Product): void {
    this.buybackList.addItem({
      id: product.id,
      product,
      condition: 'LIKE_NEW',
      price: product.estimatedPrice
    });
  }
}

// Component B
export class BuybackListComponent {
  items = computed(() => this.buybackList.items());
  total = computed(() => this.buybackList.total());

  constructor(private buybackList: BuybackListService) {}

  removeItem(itemId: string): void {
    this.buybackList.removeItem(itemId);
  }
}
```

### 3. Global State (Application-Wide)

State that affects the entire application.

```typescript
// Managed by LocaleService
export class LocaleService {
  private _market = signal<SupportedMarket>('sa');
  private _language = signal<SupportedLanguage>('en');

  readonly currentMarket = this._market.asReadonly();
  readonly currentLanguage = this._language.asReadonly();

  readonly translations = computed(() =>
    getTranslations(this._market(), this._language())
  );
}

// Used throughout app
export class AnyComponent {
  translations = computed(() => this.locale.translations());

  constructor(private locale: LocaleService) {}
}
```

## State Patterns

### Loading State Pattern

```typescript
export class DataLoadingComponent {
  // Loading state
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  data = signal<Data | null>(null);

  // Computed status
  status = computed<'idle' | 'loading' | 'success' | 'error'>(() => {
    if (this.isLoading()) return 'loading';
    if (this.error()) return 'error';
    if (this.data()) return 'success';
    return 'idle';
  });

  loadData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.service.getData()
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe({
        next: (data) => {
          this.data.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
        }
      });
  }
}
```

```html
@switch (status()) {
  @case ('loading') {
    <skapa-skeleton variant="card"></skapa-skeleton>
  }
  @case ('error') {
    <div class="error">{{ error() }}</div>
  }
  @case ('success') {
    <div class="data">{{ data()?.value }}</div>
  }
  @case ('idle') {
    <p>Click to load data</p>
  }
}
```

### Pagination State Pattern

```typescript
export class PaginatedListComponent {
  // Pagination state
  currentPage = signal<number>(1);
  pageSize = signal<number>(20);
  totalItems = signal<number>(0);
  items = signal<Product[]>([]);

  // Computed pagination
  totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.pageSize())
  );

  hasNextPage = computed(() =>
    this.currentPage() < this.totalPages()
  );

  hasPreviousPage = computed(() =>
    this.currentPage() > 1
  );

  startIndex = computed(() =>
    (this.currentPage() - 1) * this.pageSize()
  );

  endIndex = computed(() =>
    Math.min(
      this.startIndex() + this.pageSize(),
      this.totalItems()
    )
  );

  // Actions
  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage.update(page => page + 1);
      this.loadPage();
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.currentPage.update(page => page - 1);
      this.loadPage();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadPage();
    }
  }

  private loadPage(): void {
    // Load data for current page
  }
}
```

### Form State Pattern

```typescript
export class FormComponent {
  // Form state
  formData = signal<UserForm>({
    email: '',
    storeLocation: '',
    agreeToTerms: false
  });

  // Validation errors
  errors = signal<Partial<Record<keyof UserForm, string>>>({});

  // Computed validity
  isEmailValid = computed(() => {
    const email = this.formData().email;
    return this.utility.isValidEmail(email);
  });

  isStoreValid = computed(() => {
    return this.formData().storeLocation.length > 0;
  });

  isTermsAccepted = computed(() => {
    return this.formData().agreeToTerms;
  });

  isFormValid = computed(() =>
    this.isEmailValid() &&
    this.isStoreValid() &&
    this.isTermsAccepted()
  );

  // Update methods
  updateEmail(email: string): void {
    this.formData.update(form => ({ ...form, email }));
    this.validateEmail();
  }

  updateStore(storeLocation: string): void {
    this.formData.update(form => ({ ...form, storeLocation }));
    this.validateStore();
  }

  toggleTerms(): void {
    this.formData.update(form => ({
      ...form,
      agreeToTerms: !form.agreeToTerms
    }));
  }

  private validateEmail(): void {
    if (!this.isEmailValid()) {
      this.errors.update(errors => ({
        ...errors,
        email: 'Please enter a valid email address'
      }));
    } else {
      this.errors.update(errors => {
        const { email, ...rest } = errors;
        return rest;
      });
    }
  }

  private validateStore(): void {
    if (!this.isStoreValid()) {
      this.errors.update(errors => ({
        ...errors,
        storeLocation: 'Please select a store'
      }));
    } else {
      this.errors.update(errors => {
        const { storeLocation, ...rest } = errors;
        return rest;
      });
    }
  }

  submit(): void {
    if (this.isFormValid()) {
      console.log('Submitting:', this.formData());
    }
  }

  constructor(private utility: UtilityService) {}
}
```

### Selection State Pattern

```typescript
export class MultiSelectComponent {
  // All items
  items = signal<Product[]>([]);

  // Selected items
  selectedIds = signal<Set<string>>(new Set());

  // Computed
  selectedItems = computed(() => {
    const ids = this.selectedIds();
    return this.items().filter(item => ids.has(item.id));
  });

  selectedCount = computed(() => this.selectedIds().size);

  allSelected = computed(() =>
    this.items().length > 0 &&
    this.selectedIds().size === this.items().length
  );

  noneSelected = computed(() => this.selectedIds().size === 0);

  // Actions
  toggleItem(itemId: string): void {
    this.selectedIds.update(ids => {
      const newIds = new Set(ids);
      if (newIds.has(itemId)) {
        newIds.delete(itemId);
      } else {
        newIds.add(itemId);
      }
      return newIds;
    });
  }

  selectAll(): void {
    const allIds = new Set(this.items().map(item => item.id));
    this.selectedIds.set(allIds);
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  isSelected(itemId: string): boolean {
    return this.selectedIds().has(itemId);
  }
}
```

## State Persistence

### Sync with localStorage

```typescript
export class PersistedStateComponent {
  items = signal<BuybackItem[]>([]);

  constructor(private datastore: DatastoreService) {
    // Load from storage on init
    const stored = this.datastore.getBuybackList<BuybackItem>();
    this.items.set(stored);

    // Sync to storage on changes
    effect(() => {
      const items = this.items();
      this.datastore.setBuybackList(items);
    });
  }

  addItem(item: BuybackItem): void {
    this.items.update(items => [...items, item]);
    // Effect automatically saves to storage
  }
}
```

### Sync with URL Query Params

```typescript
export class SearchWithUrlComponent {
  searchQuery = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Load from URL on init
    const query = this.route.snapshot.queryParamMap.get('q') || '';
    this.searchQuery.set(query);

    // Sync to URL on changes
    effect(() => {
      const query = this.searchQuery();
      this.router.navigate([], {
        queryParams: { q: query },
        queryParamsHandling: 'merge'
      });
    });
  }
}
```

## Best Practices

### ✅ Do's

1. **Use signals for reactive state** - Better than observables for simple state
2. **Use computed for derived values** - Automatic updates
3. **Keep signals private in services** - Expose as readonly
4. **Use effects for side effects** - localStorage, analytics, logging
5. **Initialize signals with default values** - Avoid null/undefined when possible
6. **Use update() for transformations** - Preserve immutability
7. **Organize state by layer** - Component, service, global

### ❌ Don'ts

1. **Don't mutate signal values directly** - Use set/update
2. **Don't overuse effects** - Only for side effects
3. **Don't create deep signal structures** - Keep flat
4. **Don't expose writable signals** - Use readonly
5. **Don't use signals for everything** - Simple values can be regular variables
6. **Don't compute in templates** - Use computed signals
7. **Don't create circular dependencies** - A depends on B depends on A

## Debugging Signals

### Logging Signal Changes

```typescript
export class DebuggableComponent {
  counter = signal<number>(0);

  constructor() {
    effect(() => {
      console.log('Counter changed to:', this.counter());
    });
  }

  increment(): void {
    this.counter.update(n => n + 1);
    // Effect will log the new value
  }
}
```

### DevTools

Angular DevTools (Chrome extension) provides:
- Signal value inspection
- Dependency tracking
- Change detection profiling

## Migration from RxJS

### Before (RxJS BehaviorSubject)

```typescript
export class OldComponent {
  private itemsSubject = new BehaviorSubject<Item[]>([]);
  items$ = this.itemsSubject.asObservable();

  addItem(item: Item): void {
    const current = this.itemsSubject.value;
    this.itemsSubject.next([...current, item]);
  }
}
```

```html
<div *ngIf="items$ | async as items">
  <div *ngFor="let item of items">{{ item.name }}</div>
</div>
```

### After (Signals)

```typescript
export class NewComponent {
  items = signal<Item[]>([]);

  addItem(item: Item): void {
    this.items.update(items => [...items, item]);
  }
}
```

```html
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

**Benefits**:
- No async pipe needed
- Simpler syntax
- Better performance
- Type-safe without decorators

---

**Next**: [Dependency Injection](./dependency-injection.md)
