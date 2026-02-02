# Coding Standards

## Overview

This document defines the coding standards and conventions for the IKEA Buyback Portal. Following these standards ensures code consistency, readability, and maintainability.

## TypeScript Standards

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Component | `kebab-case.component.ts` | `product-card.component.ts` |
| Service | `kebab-case.service.ts` | `buyback-list.service.ts` |
| Model | `kebab-case.model.ts` | `product.model.ts` |
| Interface | `kebab-case.interface.ts` | `locale-config.interface.ts` |
| Constants | `kebab-case.constants.ts` | `app.constants.ts` |
| Pipe | `kebab-case.pipe.ts` | `currency-format.pipe.ts` |
| Directive | `kebab-case.directive.ts` | `rtl-support.directive.ts` |

### Class Naming

```typescript
// ✅ GOOD - PascalCase for classes
export class ProductListComponent { }
export class BuybackListService { }
export class ProductModel { }
export interface LocaleConfig { }

// ❌ BAD - Wrong casing
export class productListComponent { }
export class buyback_list_service { }
```

### Variable and Function Naming

```typescript
// ✅ GOOD - camelCase for variables and functions
const productList = signal<Product[]>([]);
const totalPrice = computed(() => calculateTotal());

function calculateOffer(items: BuybackItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ BAD - Wrong conventions
const ProductList = signal<Product[]>([]);  // Should be camelCase
const total_price = computed(() => {});      // Should be camelCase

function CalculateOffer() { }  // Should be camelCase
function calculate_offer() { }  // Should be camelCase
```

### Constants Naming

```typescript
// ✅ GOOD - SCREAMING_SNAKE_CASE for constants
export const MAX_BUYBACK_ITEMS = 50;
export const DEFAULT_CURRENCY = 'SAR';
export const API_TIMEOUT = 30000;

// ✅ GOOD - Namespaced constants
export namespace ProductCondition {
  export const LIKE_NEW = 'LIKE_NEW';
  export const VERY_GOOD = 'VERY_GOOD';
  export const WELL_USED = 'WELL_USED';
}

// ✅ GOOD - Enum
export enum SupportedMarket {
  SA = 'sa',
  BH = 'bh'
}

// ❌ BAD - Inconsistent naming
export const maxBuybackItems = 50;  // Should be uppercase
export const Max_Items = 50;         // Should be uppercase
```

### Type Annotations

```typescript
// ✅ GOOD - Always specify types
function calculateTotal(items: BuybackItem[]): number {
  return items.reduce((sum: number, item: BuybackItem) => sum + item.price, 0);
}

const products = signal<Product[]>([]);
const isLoading = signal<boolean>(false);

// ❌ BAD - Missing types
function calculateTotal(items) {  // Missing types
  return items.reduce((sum, item) => sum + item.price, 0);
}

const products = signal([]);  // Missing generic type
```

### Interfaces vs Types

```typescript
// ✅ GOOD - Use interfaces for object shapes
export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface BuybackItem extends Product {
  condition: ProductCondition;
  adjustedPrice: number;
}

// ✅ GOOD - Use types for unions, intersections, primitives
export type SupportedLanguage = 'en' | 'ar';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ✅ GOOD - Type intersection
export type DisplayProduct = Product & {
  formattedPrice: string;
  categoryName: string;
};
```

## Angular Component Standards

### Component Structure

```typescript
// ✅ GOOD - Organized structure
import { Component, OnInit, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../shared/base-classes/base.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent extends BaseComponent implements OnInit {
  // 1. Inputs
  @Input() showPrices: boolean = true;

  // 2. Outputs
  @Output() productSelected = new EventEmitter<Product>();

  // 3. Signals (state)
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);

  // 4. Computed values
  productCount = computed(() => this.products().length);
  hasProducts = computed(() => this.productCount() > 0);

  // 5. Constructor with DI
  constructor(
    private productService: ProductService,
    private locale: LocaleService
  ) {
    super();
  }

  // 6. Lifecycle hooks
  ngOnInit(): void {
    this.loadProducts();
  }

  // 7. Public methods
  onProductClick(product: Product): void {
    this.productSelected.emit(product);
  }

  // 8. Private methods
  private loadProducts(): void {
    this.isLoading.set(true);
    // Load logic
  }
}
```

### Component Decorators

```typescript
// ✅ GOOD - Standalone with proper configuration
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // For SKAPA
})

// ❌ BAD - Inline template/styles
@Component({
  selector: 'app-product-card',
  template: `<div>...</div>`,  // Should be in separate file
  styles: [`div { }`]            // Should be in separate file
})
```

### Component Selectors

```typescript
// ✅ GOOD - app prefix, kebab-case
selector: 'app-product-card'
selector: 'app-buyback-list'
selector: 'app-offer-summary'

// ❌ BAD - Wrong prefix or casing
selector: 'product-card'      // Missing app prefix
selector: 'appProductCard'    // Should be kebab-case
selector: 'app_product_card'  // Should use dashes
```

## Service Standards

### Service Structure

```typescript
// ✅ GOOD - Service structure
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BuybackListService {
  // 1. Private signals
  private _items = signal<BuybackItem[]>([]);

  // 2. Public readonly signals
  readonly items = this._items.asReadonly();

  // 3. Computed values
  readonly itemCount = computed(() => this._items().length);
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price, 0)
  );

  // 4. Constructor with DI
  constructor(
    private http: HttpClient,
    private api: APIService,
    private datastore: DatastoreService
  ) {
    this.loadFromStorage();
  }

  // 5. Public methods
  addItem(item: BuybackItem): void {
    this._items.update(items => [...items, item]);
    this.saveToStorage();
  }

  // 6. Private methods
  private saveToStorage(): void {
    this.datastore.setBuybackList(this._items());
  }

  private loadFromStorage(): void {
    const stored = this.datastore.getBuybackList<BuybackItem>();
    this._items.set(stored);
  }
}
```

### Service Naming

```typescript
// ✅ GOOD - Descriptive service names
BuybackListService
ProductSearchService
OfferCalculationService
SubmissionService

// ❌ BAD - Generic or unclear names
DataService
HelperService
UtilsService
```

## Signal Standards

### Signal Creation

```typescript
// ✅ GOOD - Typed signals with initial values
const products = signal<Product[]>([]);
const isLoading = signal<boolean>(false);
const selectedId = signal<string | null>(null);
const count = signal<number>(0);

// ❌ BAD - Missing types or initial values
const products = signal([]);  // Missing type
const isLoading = signal();   // Missing initial value
```

### Signal Updates

```typescript
// ✅ GOOD - Use set() and update() correctly
// set() - Replace entire value
this.products.set([product1, product2]);
this.isLoading.set(true);

// update() - Modify based on current value
this.products.update(products => [...products, newProduct]);
this.count.update(n => n + 1);

// ❌ BAD - Direct mutation
this.products().push(newProduct);  // Doesn't trigger updates!
this.count()++;                     // Doesn't work!
```

### Computed Signals

```typescript
// ✅ GOOD - Computed for derived values
const totalPrice = computed(() =>
  this.items().reduce((sum, item) => sum + item.price, 0)
);

const hasItems = computed(() => this.items().length > 0);

// ❌ BAD - Method instead of computed
getTotalPrice(): number {  // Should be computed
  return this.items().reduce((sum, item) => sum + item.price, 0);
}
```

## Template Standards

### Modern Control Flow

```html
<!-- ✅ GOOD - Modern @if, @for, @switch -->
@if (isLoading()) {
  <skapa-skeleton variant="card"></skapa-skeleton>
} @else if (products().length === 0) {
  <p>No products found</p>
} @else {
  @for (product of products(); track product.id) {
    <app-product-card [product]="product"></app-product-card>
  }
}

<!-- ❌ BAD - Old *ngIf, *ngFor -->
<div *ngIf="isLoading()">Loading...</div>
<div *ngFor="let product of products()">{{ product.name }}</div>
```

### Track By in Loops

```html
<!-- ✅ GOOD - Always use track -->
@for (product of products(); track product.id) {
  <app-product-card [product]="product"></app-product-card>
}

@for (item of items(); track $index) {
  <div>{{ item.name }}</div>
}

<!-- ❌ BAD - Missing track -->
@for (product of products()) {
  <app-product-card [product]="product"></app-product-card>
}
```

### Property Binding

```html
<!-- ✅ GOOD - Square brackets for properties -->
<app-product-card [product]="selectedProduct()" [showPrice]="true"></app-product-card>

<img [src]="product.imageUrl" [alt]="product.name" />

<!-- ✅ GOOD - Parentheses for events -->
<skapa-button (click)="onSubmit()">Submit</skapa-button>

<!-- ✅ GOOD - Two-way binding -->
<skapa-input-field [(value)]="searchQuery"></skapa-input-field>
```

## SCSS Standards

### File Organization

```scss
// ✅ GOOD - Imports at top, organized structure
@use '../../../../../assets/global/variables' as *;
@use '../../../../../assets/global/mixins' as *;

.product-card {
  // Container styles
  padding: $spacing-md;
  border: 1px solid $color-border;

  // Child elements
  &__image {
    width: 100%;
  }

  &__title {
    @include heading-3;
  }

  // States
  &:hover {
    @include box-shadow('md');
  }

  // Modifiers
  &--selected {
    border-color: $color-primary;
  }

  // Responsive
  @include responsive(tablet) {
    padding: $spacing-lg;
  }
}
```

### Class Naming (BEM)

```scss
// ✅ GOOD - BEM naming
.buyback-list { }              // Block
.buyback-list__item { }        // Element
.buyback-list__item--selected { }  // Modifier

// ❌ BAD - Inconsistent naming
.buybackList { }        // Should be kebab-case
.buyback-list-item { }  // Should use __
.buyback-list-selected { }  // Should use --
```

### Use Variables

```scss
// ✅ GOOD - Use design tokens
.card {
  padding: $spacing-md;
  background: $color-background;
  border-radius: $border-radius;
  box-shadow: $shadow-md;
}

// ❌ BAD - Hardcoded values
.card {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
```

## Comments and Documentation

### Code Comments

```typescript
// ✅ GOOD - Comments explain WHY, not WHAT
// Calculate adjusted price based on condition multiplier
// Family members receive 10% bonus on top of condition adjustment
calculateAdjustedPrice(basePrice: number, condition: ProductCondition): number {
  const multiplier = this.getConditionMultiplier(condition);
  return basePrice * multiplier;
}

// ❌ BAD - Comments state the obvious
// This function calculates the adjusted price
calculateAdjustedPrice(basePrice: number, condition: ProductCondition): number {
  return basePrice * multiplier;  // Multiply base price by multiplier
}
```

### JSDoc for Public APIs

```typescript
/**
 * Calculates the total buyback offer including discounts
 * @param items - List of buyback items with conditions
 * @param isFamilyMember - Whether user is IKEA Family member
 * @returns Calculated offer with subtotal, discount, and total
 */
calculateOffer(items: BuybackItem[], isFamilyMember: boolean): OfferCalculation {
  // Implementation
}
```

## Error Handling

### Try-Catch

```typescript
// ✅ GOOD - Proper error handling
saveToStorage(): void {
  try {
    this.datastore.setBuybackList(this._items());
  } catch (error) {
    console.error('Failed to save buyback list:', error);
    this.toaster.error('Failed to save. Please try again.');
  }
}

// ❌ BAD - Silent failures
saveToStorage(): void {
  this.datastore.setBuybackList(this._items());
  // No error handling!
}
```

### Observable Error Handling

```typescript
// ✅ GOOD - Handle errors in subscribe
this.productService.getProducts()
  .pipe(takeUntil(this.ngUnSubscribe))
  .subscribe({
    next: (products) => {
      this.products.set(products);
      this.isLoading.set(false);
    },
    error: (error) => {
      console.error('Failed to load products:', error);
      this.error.set('Failed to load products');
      this.isLoading.set(false);
    }
  });

// ❌ BAD - No error handling
this.productService.getProducts()
  .subscribe(products => {
    this.products.set(products);
  });
```

## Best Practices Checklist

### ✅ Do's

1. **Always extend BaseComponent** for components
2. **Always extend BaseModel** for business logic
3. **Use signals** for reactive state
4. **Use computed** for derived values
5. **Use TypeScript types** - No `any`
6. **Handle errors gracefully** - User-friendly messages
7. **Use modern control flow** - @if, @for, @switch
8. **Track by in loops** - Performance
9. **Follow naming conventions** - Consistency
10. **Add comments for complex logic** - Explain WHY

### ❌ Don'ts

1. **Don't use `any` type** - Always specify types
2. **Don't mutate signals directly** - Use set/update
3. **Don't forget takeUntil** - Memory leaks
4. **Don't use old syntax** - No *ngIf, *ngFor
5. **Don't hardcode values** - Use constants/environment
6. **Don't skip error handling** - Always handle errors
7. **Don't leave console.log** - Remove debugging
8. **Don't create inline templates** - Separate files
9. **Don't use left/right for RTL** - Use logical properties
10. **Don't skip documentation** - Document complex logic

---

**Next**: [Adding New Features](./adding-new-features.md)
