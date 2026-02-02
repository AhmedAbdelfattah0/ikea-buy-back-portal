# Component Architecture

## Overview

The IKEA Buyback Portal follows a **component-based architecture** with clear separation of concerns between presentation (components), business logic (models), and data access (services).

## Component Types

### 1. Page Components

**Purpose**: Routable components that represent full pages.

**Location**: `features/{feature-name}/pages/{page-name}/`

**Characteristics**:
- Correspond to routes
- Container components
- Orchestrate child components
- Handle routing and navigation
- Manage page-level state

**Example**:
```typescript
// src/app/features/product-discovery/pages/search/search.component.ts
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, ProductGridComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent extends BaseComponent {
  products = signal<Product[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    super();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.loadProducts(query);
  }

  onProductSelected(product: Product): void {
    // Navigate to condition assessment
    this.router.navigate(['/condition-assessment'], {
      state: { product }
    });
  }

  private loadProducts(query: string): void {
    this.isLoading.set(true);

    this.productService.searchProducts(query)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
  }
}
```

### 2. Feature Components

**Purpose**: Components specific to a feature, not routable.

**Location**: `features/{feature-name}/components/{component-name}/`

**Characteristics**:
- Presentational components
- Receive data via `@Input()`
- Emit events via `@Output()`
- Focused on UI rendering
- Reusable within feature

**Example**:
```typescript
// src/app/features/product-discovery/components/product-card/product-card.component.ts
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // For SKAPA components
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showCondition: boolean = false;

  @Output() productSelected = new EventEmitter<Product>();

  onSelect(): void {
    this.productSelected.emit(this.product);
  }
}
```

```html
<!-- product-card.component.html -->
<skapa-card>
  <div slot="content">
    <img [src]="product.imageUrl" [alt]="product.name" />
    <h3>{{ product.name }}</h3>
    <p>{{ product.code }}</p>

    @if (showCondition && product.condition) {
      <span class="condition">{{ product.condition }}</span>
    }

    <skapa-button variant="primary" (click)="onSelect()">
      Select Product
    </skapa-button>
  </div>
</skapa-card>
```

### 3. Shared Components

**Purpose**: Reusable components used across multiple features.

**Location**: `shared/components/{component-name}/`

**Characteristics**:
- Generic and reusable
- No feature-specific logic
- Well-documented API
- Used by 2+ features

**Example**:
```typescript
// src/app/shared/components/modal/modal.component.ts
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() heading: string = '';
  @Input() showCloseButton: boolean = true;

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
```

### 4. Layout Components

**Purpose**: Wrapper components that define page structure.

**Location**: `layouts/{layout-name}/`

**Characteristics**:
- Provide consistent structure
- Include header, footer, navigation
- Use `<router-outlet>` for content
- May have multiple layouts

**Example**:
```typescript
// src/app/layouts/main-layout/main-layout.component.ts
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  template: `
    <div class="main-layout">
      <app-header></app-header>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent { }
```

## Component Structure

### Standalone Components

All components use Angular's **standalone** architecture (no NgModules).

```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,  // ← Standalone component
  imports: [
    CommonModule,
    FormsModule,
    OtherComponent
  ],
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss'
})
export class MyComponent extends BaseComponent { }
```

### Component Files

Every component has **3 separate files**:

```
component-name/
├── component-name.component.ts     # TypeScript logic
├── component-name.component.html   # Template
└── component-name.component.scss   # Styles
```

**IMPORTANT**: Never use inline templates or styles. Always use separate files.

```typescript
// ❌ WRONG - Inline template
@Component({
  template: `<div>Hello</div>`,
  styles: [`div { color: blue; }`]
})

// ✅ CORRECT - Separate files
@Component({
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss'
})
```

## Signal-Based Reactivity

### Using Signals

All components use **Angular Signals** for reactive state management.

```typescript
import { Component, signal, computed } from '@angular/core';

export class ProductListComponent {
  // Writable signals
  products = signal<Product[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);

  // Computed signals
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(query)
    );
  });

  productCount = computed(() => this.filteredProducts().length);

  // Update signals
  addProduct(product: Product): void {
    this.products.update(products => [...products, product]);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }
}
```

### In Templates

```html
<!-- Access signal values with () -->
<p>Found {{ productCount() }} products</p>

<input
  [value]="searchQuery()"
  (input)="setSearchQuery($event.target.value)"
/>

@if (isLoading()) {
  <skapa-skeleton variant="card"></skapa-skeleton>
} @else {
  @for (product of filteredProducts(); track product.id) {
    <app-product-card [product]="product"></app-product-card>
  }
}
```

### Signal Best Practices

```typescript
// ✅ GOOD - Computed for derived state
totalPrice = computed(() =>
  this.items().reduce((sum, item) => sum + item.price, 0)
);

// ❌ BAD - Manual calculation
getTotalPrice(): number {
  return this.items().reduce((sum, item) => sum + item.price, 0);
}

// ✅ GOOD - Update with function
addItem(item: Item): void {
  this.items.update(items => [...items, item]);
}

// ❌ BAD - Direct mutation
addItem(item: Item): void {
  this.items().push(item);  // Won't trigger updates!
}
```

## Component Communication

### Parent to Child: @Input()

```typescript
// Child component
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showPrice: boolean = true;
}
```

```html
<!-- Parent template -->
<app-product-card
  [product]="selectedProduct()"
  [showPrice]="true">
</app-product-card>
```

### Child to Parent: @Output()

```typescript
// Child component
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();

  onSubmit(query: string): void {
    this.search.emit(query);
  }
}
```

```html
<!-- Parent template -->
<app-search-bar (search)="handleSearch($event)"></app-search-bar>
```

```typescript
// Parent component
export class SearchPageComponent {
  handleSearch(query: string): void {
    console.log('Search query:', query);
  }
}
```

### Service-Based Communication

For sibling or distant components, use shared services:

```typescript
// Shared service
@Injectable({ providedIn: 'root' })
export class BuybackListService {
  private items = signal<BuybackItem[]>([]);
  readonly items$ = this.items.asReadonly();

  addItem(item: BuybackItem): void {
    this.items.update(items => [...items, item]);
  }
}

// Component A (adds item)
export class ProductSelectionComponent {
  constructor(private buybackList: BuybackListService) {}

  selectProduct(product: Product): void {
    this.buybackList.addItem({ product, condition: 'LIKE_NEW' });
  }
}

// Component B (displays items)
export class BuybackListComponent {
  items = computed(() => this.buybackList.items$());

  constructor(private buybackList: BuybackListService) {}
}
```

## Change Detection

### OnPush Strategy (Recommended)

Use `OnPush` change detection for better performance:

```typescript
@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class ProductListComponent {
  // Signals automatically trigger change detection
  products = signal<Product[]>([]);
}
```

### When to Use OnPush

```typescript
// ✅ GOOD - Pure component with @Input()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input() product!: Product;
}

// ✅ GOOD - Component with signals
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  products = signal<Product[]>([]);
}
```

## Template Syntax

### Modern Control Flow

Use Angular's modern `@if`, `@for`, `@switch` syntax:

```html
<!-- Conditional rendering -->
@if (isLoading()) {
  <skapa-skeleton variant="card"></skapa-skeleton>
} @else if (products().length === 0) {
  <p>No products found</p>
} @else {
  <div class="products">
    @for (product of products(); track product.id) {
      <app-product-card [product]="product"></app-product-card>
    }
  </div>
}

<!-- Switch statement -->
@switch (status()) {
  @case ('loading') {
    <skapa-skeleton variant="text"></skapa-skeleton>
  }
  @case ('success') {
    <div>Success!</div>
  }
  @case ('error') {
    <div>Error occurred</div>
  }
}
```

### Track By in Loops

Always use `track` in `@for` loops for performance:

```html
<!-- ✅ GOOD - Track by ID -->
@for (product of products(); track product.id) {
  <app-product-card [product]="product"></app-product-card>
}

<!-- ❌ BAD - No track -->
@for (product of products()) {
  <app-product-card [product]="product"></app-product-card>
}

<!-- Track by index if no ID -->
@for (item of items(); track $index) {
  <div>{{ item.name }}</div>
}
```

## SKAPA Integration

### CUSTOM_ELEMENTS_SCHEMA

All components using SKAPA must include the schema:

```typescript
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-my-component',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // ← Required for SKAPA
  // ...
})
```

### Using SKAPA Components

```html
<!-- Buttons -->
<skapa-button variant="primary" (click)="onSubmit()">
  Submit
</skapa-button>

<!-- Input fields -->
<skapa-input-field
  label="Email"
  type="email"
  [value]="email()"
  (input)="onEmailChange($event)">
</skapa-input-field>

<!-- Skeleton loaders -->
@if (isLoading()) {
  <skapa-skeleton variant="card"></skapa-skeleton>
  <skapa-skeleton variant="text" rows="3"></skapa-skeleton>
}

<!-- Modal -->
<skapa-modal
  [open]="isModalOpen()"
  (close)="closeModal()"
  heading="Confirm Action">
  <div slot="content">
    <p>Are you sure?</p>
  </div>
  <div slot="actions">
    <skapa-button variant="secondary" (click)="closeModal()">
      Cancel
    </skapa-button>
    <skapa-button variant="primary" (click)="confirm()">
      Confirm
    </skapa-button>
  </div>
</skapa-modal>
```

## Component Lifecycle

### Key Lifecycle Hooks

```typescript
export class MyComponent extends BaseComponent implements OnInit, AfterViewInit {
  constructor() {
    super();
    // 1. Constructor - Initialize properties
  }

  ngOnInit(): void {
    // 2. OnInit - Component initialized, inputs set
    this.loadData();
  }

  ngAfterViewInit(): void {
    // 3. AfterViewInit - View initialized
    this.setupThirdPartyLibrary();
  }

  override ngOnDestroy(): void {
    // 4. OnDestroy - Component destroyed
    // BaseComponent handles subscription cleanup
    super.ngOnDestroy();
  }
}
```

### Subscription Cleanup

Always use `takeUntil` with `ngUnSubscribe` from `BaseComponent`:

```typescript
export class MyComponent extends BaseComponent {
  ngOnInit(): void {
    this.myService.getData()
      .pipe(takeUntil(this.ngUnSubscribe))  // ← Automatic cleanup
      .subscribe(data => {
        this.data.set(data);
      });
  }
}
```

## Component Best Practices

### ✅ Do's

1. **Extend BaseComponent** - Automatic cleanup
2. **Use signals for state** - Reactive and efficient
3. **Keep components focused** - Single Responsibility
4. **Use OnPush change detection** - Better performance
5. **Separate files** - TS, HTML, SCSS
6. **Use CUSTOM_ELEMENTS_SCHEMA** - For SKAPA components
7. **Track by in loops** - Performance optimization
8. **Use modern control flow** - @if, @for, @switch

### ❌ Don'ts

1. **Don't put business logic in components** - Use models/services
2. **Don't use inline templates/styles** - Always separate files
3. **Don't forget takeUntil** - Memory leaks!
4. **Don't mutate signals directly** - Use set/update
5. **Don't use old syntax** - No *ngIf, *ngFor
6. **Don't skip CUSTOM_ELEMENTS_SCHEMA** - SKAPA won't work
7. **Don't create deep component trees** - Keep it flat

## Example: Complete Component

```typescript
// product-list.component.ts
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/base-classes/base.component';
import { ProductService } from '../../services/product.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductListComponent extends BaseComponent implements OnInit {
  // State
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);
  searchQuery = signal<string>('');

  // Computed values
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(query)
    );
  });

  translations = computed(() => this.locale.translations().productDiscovery);

  constructor(
    private productService: ProductService,
    private locale: LocaleService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  onProductSelected(product: Product): void {
    // Handle product selection
    console.log('Selected:', product);
  }

  private loadProducts(): void {
    this.isLoading.set(true);

    this.productService.getProducts()
      .pipe(takeUntil(this.ngUnSubscribe))
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

```html
<!-- product-list.component.html -->
<div class="product-list">
  <h1>{{ translations().title }}</h1>

  <app-search-bar (search)="onSearch($event)"></app-search-bar>

  @if (isLoading()) {
    <skapa-skeleton variant="card"></skapa-skeleton>
    <skapa-skeleton variant="card"></skapa-skeleton>
    <skapa-skeleton variant="card"></skapa-skeleton>
  } @else if (filteredProducts().length === 0) {
    <p>{{ translations().noResults }}</p>
  } @else {
    <div class="products-grid">
      @for (product of filteredProducts(); track product.id) {
        <app-product-card
          [product]="product"
          (productSelected)="onProductSelected($event)">
        </app-product-card>
      }
    </div>
  }
</div>
```

```scss
// product-list.component.scss
@use '../../../../../assets/global/variables' as *;
@use '../../../../../assets/global/mixins' as *;

.product-list {
  padding: $spacing-lg;

  h1 {
    @include heading-1;
    margin-bottom: $spacing-md;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-md;
  margin-top: $spacing-lg;
}
```

---

**Next**: [State Management](./state-management.md)
