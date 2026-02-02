# Product Discovery

## Overview

The Product Discovery feature enables users to find products they want to sell back to IKEA through two methods:
1. **Keyword Search** - Free-text search for products
2. **Category Browse** - Hierarchical category navigation

## User Flow

```
Start
  ↓
Search or Browse Categories
  ↓
View Product Results
  ↓
Select Product
  ↓
[Navigate to Condition Assessment]
```

## Feature Structure

```
features/product-discovery/
├── pages/
│   ├── search/                    # Search page component
│   └── category-browse/           # Category browse page
├── components/
│   ├── search-bar/                # Search input component
│   ├── category-selector/         # Category tree component
│   ├── product-grid/              # Grid layout
│   └── product-card/              # Product card display
├── services/
│   ├── product-search.service.ts  # Search API calls
│   └── category.service.ts        # Category data
└── models/
    ├── product.model.ts           # Product business logic
    └── category.model.ts          # Category logic
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/sa/en/search` | SearchComponent | Product search page (English, SA) |
| `/sa/ar/search` | SearchComponent | Product search page (Arabic, SA) |
| `/sa/en/categories` | CategoryBrowseComponent | Category browse (English, SA) |
| `/sa/ar/categories` | CategoryBrowseComponent | Category browse (Arabic, SA) |
| `/bh/en/search` | SearchComponent | Product search page (English, BH) |
| `/bh/ar/search` | SearchComponent | Product search page (Arabic, BH) |

**Note**: Routes are automatically prefixed with `/{market}/{lang}/` via APP_BASE_HREF.

## Pages

### 1. Search Page

**Purpose**: Allow users to search for products by keyword.

**Location**: `features/product-discovery/pages/search/`

**State**:
```typescript
export class SearchComponent extends BaseComponent {
  // Search state
  searchQuery = signal<string>('');
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed
  hasResults = computed(() => this.products().length > 0);
  translations = computed(() => this.locale.translations().productDiscovery);
}
```

**Features**:
- Search input with debouncing
- Real-time search results
- Loading state with SKAPA skeleton
- Error handling
- Empty state when no results
- Product grid display

**Template Structure**:
```html
<div class="search-page">
  <h1>{{ translations().searchTitle }}</h1>

  <!-- Search Bar Component -->
  <app-search-bar
    (search)="onSearch($event)">
  </app-search-bar>

  <!-- Loading State -->
  @if (isLoading()) {
    <skapa-skeleton variant="card"></skapa-skeleton>
    <skapa-skeleton variant="card"></skapa-skeleton>
  }

  <!-- Error State -->
  @else if (error()) {
    <div class="error">{{ error() }}</div>
  }

  <!-- Empty State -->
  @else if (!hasResults() && searchQuery()) {
    <p>{{ translations().noResults }}</p>
  }

  <!-- Results -->
  @else if (hasResults()) {
    <app-product-grid
      [products]="products()"
      (productSelected)="onProductSelected($event)">
    </app-product-grid>
  }
</div>
```

### 2. Category Browse Page

**Purpose**: Navigate through product categories hierarchically.

**Location**: `features/product-discovery/pages/category-browse/`

**State**:
```typescript
export class CategoryBrowseComponent extends BaseComponent {
  // Category state
  categories = signal<Category[]>([]);
  selectedCategory = signal<Category | null>(null);
  products = signal<Product[]>([]);
  breadcrumbs = signal<Category[]>([]);
  isLoading = signal<boolean>(false);

  // Computed
  hasSubcategories = computed(() => {
    const category = this.selectedCategory();
    return category?.children && category.children.length > 0;
  });

  hasProducts = computed(() => this.products().length > 0);
}
```

**Features**:
- Hierarchical category tree
- Breadcrumb navigation
- Category selection
- Product display per category
- Back navigation
- Loading states

**Template Structure**:
```html
<div class="category-browse">
  <h1>{{ translations().categoriesTitle }}</h1>

  <!-- Breadcrumbs -->
  @if (breadcrumbs().length > 0) {
    <nav class="breadcrumbs">
      @for (crumb of breadcrumbs(); track crumb.id) {
        <span (click)="navigateToCategory(crumb)">
          {{ crumb.name }}
        </span>
      }
    </nav>
  }

  <!-- Category Selector -->
  @if (!selectedCategory() || hasSubcategories()) {
    <app-category-selector
      [categories]="categories()"
      (categorySelected)="onCategorySelected($event)">
    </app-category-selector>
  }

  <!-- Products in Category -->
  @if (hasProducts()) {
    <app-product-grid
      [products]="products()"
      (productSelected)="onProductSelected($event)">
    </app-product-grid>
  }
</div>
```

## Components

### 1. Search Bar Component

**Purpose**: Search input with autocomplete.

**Props**:
```typescript
@Output() search = new EventEmitter<string>();
```

**Features**:
- Debounced input (300ms)
- Clear button
- Enter key to search
- Placeholder translation

**Usage**:
```html
<app-search-bar (search)="handleSearch($event)"></app-search-bar>
```

### 2. Category Selector Component

**Purpose**: Display and select categories.

**Props**:
```typescript
@Input() categories!: Category[];
@Output() categorySelected = new EventEmitter<Category>();
```

**Features**:
- Grid layout of categories
- Category icons
- Hover states
- Click to select

**Usage**:
```html
<app-category-selector
  [categories]="rootCategories"
  (categorySelected)="onCategoryClick($event)">
</app-category-selector>
```

### 3. Product Grid Component

**Purpose**: Grid layout for product cards.

**Props**:
```typescript
@Input() products!: Product[];
@Output() productSelected = new EventEmitter<Product>();
```

**Features**:
- Responsive grid (1-4 columns)
- Product card children
- Empty state

**Usage**:
```html
<app-product-grid
  [products]="filteredProducts"
  (productSelected)="selectProduct($event)">
</app-product-grid>
```

### 4. Product Card Component

**Purpose**: Display individual product.

**Props**:
```typescript
@Input() product!: Product;
@Input() showCondition: boolean = false;
@Output() productSelected = new EventEmitter<Product>();
```

**Features**:
- Product image
- Product name
- Product code
- Select button
- Optional condition display

**Template**:
```html
<skapa-card>
  <div slot="content">
    <img [src]="product.imageUrl" [alt]="product.name" />
    <h3>{{ product.name }}</h3>
    <p class="code">{{ product.code }}</p>

    @if (showCondition && product.condition) {
      <span class="condition">{{ product.condition }}</span>
    }

    <skapa-button
      variant="primary"
      (click)="onSelect()">
      {{ translations().selectProduct }}
    </skapa-button>
  </div>
</skapa-card>
```

## Services

### 1. ProductSearchService

**Purpose**: Handle product search API calls.

**Methods**:
```typescript
@Injectable({ providedIn: 'root' })
export class ProductSearchService {
  constructor(
    private http: HttpClient,
    private api: APIService
  ) {}

  searchProducts(query: string): Observable<Product[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Product[]>(this.api.products, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.api.products}/${id}`);
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    const params = new HttpParams().set('categoryId', categoryId);
    return this.http.get<Product[]>(this.api.products, { params });
  }
}
```

### 2. CategoryService

**Purpose**: Manage category hierarchy.

**Methods**:
```typescript
@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(
    private http: HttpClient,
    private api: APIService
  ) {}

  getRootCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.api.categories);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.api.categories}/${id}`);
  }

  getSubcategories(parentId: string): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.api.categories}/${parentId}/children`
    );
  }
}
```

## Models

### 1. Product Model

**Purpose**: Product business logic and validation.

**Interface**:
```typescript
export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  estimatedPrice: number;
  condition?: ProductCondition;
}
```

**Model**:
```typescript
@Injectable({ providedIn: 'root' })
export class ProductModel extends BaseModel {
  constructor(
    utility: UtilityService,
    datastore: DatastoreService,
    private locale: LocaleService
  ) {
    super(utility, datastore);
  }

  validateProduct(product: Product): boolean {
    return !!(
      product.id &&
      product.code &&
      product.name &&
      product.estimatedPrice > 0
    );
  }

  formatProductForDisplay(product: Product): DisplayProduct {
    const currency = this.locale.currencyConfig();

    return {
      ...product,
      formattedPrice: this.utility.formatCurrency(
        product.estimatedPrice,
        currency.code
      )
    };
  }

  createSlug(productName: string): string {
    return this.utility.slugify(productName);
  }
}
```

### 2. Category Model

**Purpose**: Category hierarchy and navigation logic.

**Interface**:
```typescript
export interface Category {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  parentId?: string;
  children?: Category[];
  level: number;
}
```

**Model**:
```typescript
@Injectable({ providedIn: 'root' })
export class CategoryModel extends BaseModel {
  buildBreadcrumbs(
    category: Category,
    allCategories: Category[]
  ): Category[] {
    const breadcrumbs: Category[] = [category];

    let current = category;
    while (current.parentId) {
      const parent = allCategories.find(c => c.id === current.parentId);
      if (parent) {
        breadcrumbs.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }

    return breadcrumbs;
  }

  isLeafCategory(category: Category): boolean {
    return !category.children || category.children.length === 0;
  }

  findCategoryByPath(
    categories: Category[],
    path: string[]
  ): Category | null {
    let current = categories;

    for (const segment of path) {
      const found = current.find(c => c.id === segment);
      if (!found) return null;

      if (found.children && found.children.length > 0) {
        current = found.children;
      } else {
        return found;
      }
    }

    return null;
  }
}
```

## API Endpoints

### Search Products

```
GET /api/buyback/products?q={query}

Response:
{
  "products": [
    {
      "id": "12345",
      "code": "123.456.78",
      "name": "BILLY Bookcase",
      "description": "White bookcase, 80x28x202 cm",
      "imageUrl": "https://...",
      "categoryId": "cat_001",
      "estimatedPrice": 150
    }
  ]
}
```

### Get Categories

```
GET /api/buyback/categories

Response:
{
  "categories": [
    {
      "id": "cat_001",
      "name": "Living Room",
      "description": "Living room furniture",
      "level": 0,
      "children": [
        {
          "id": "cat_002",
          "name": "Bookcases & Shelves",
          "parentId": "cat_001",
          "level": 1
        }
      ]
    }
  ]
}
```

### Get Products by Category

```
GET /api/buyback/products?categoryId={categoryId}

Response:
{
  "products": [...]
}
```

## Translations

### English

```typescript
productDiscovery: {
  searchTitle: 'Search for Products',
  searchPlaceholder: 'Search by product name or code...',
  searchButton: 'Search',
  categoriesTitle: 'Browse by Category',
  categories: 'Categories',
  selectCategory: 'Select a category',
  noResults: 'No products found',
  resultsFound: 'products found',
  productName: 'Product Name',
  productCode: 'Product Code',
  selectProduct: 'Select Product'
}
```

### Arabic

```typescript
productDiscovery: {
  searchTitle: 'البحث عن المنتجات',
  searchPlaceholder: 'ابحث باسم المنتج أو الرمز...',
  searchButton: 'بحث',
  categoriesTitle: 'تصفح حسب الفئة',
  categories: 'الفئات',
  selectCategory: 'اختر فئة',
  noResults: 'لم يتم العثور على منتجات',
  resultsFound: 'منتج موجود',
  productName: 'اسم المنتج',
  productCode: 'رمز المنتج',
  selectProduct: 'اختر المنتج'
}
```

## Implementation Example

### Search Page Component

```typescript
// search.component.ts
import { Component, OnInit, signal, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/base-classes/base.component';
import { ProductSearchService } from '../../services/product-search.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { LoaderService } from '../../../../core/services/loader.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, ProductGridComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchComponent extends BaseComponent implements OnInit {
  searchQuery = signal<string>('');
  products = signal<Product[]>([]);
  isLoading = computed(() => this.loader.isLoadingFor('product-search'));
  error = signal<string | null>(null);

  hasResults = computed(() => this.products().length > 0);
  translations = computed(() => this.locale.translations().productDiscovery);

  constructor(
    private searchService: ProductSearchService,
    private locale: LocaleService,
    private loader: LoaderService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    // Could load featured products or last search
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);

    if (query.trim().length < 2) {
      this.products.set([]);
      return;
    }

    this.performSearch(query);
  }

  onProductSelected(product: Product): void {
    // Navigate to condition assessment with product data
    this.router.navigate(['/condition-assessment'], {
      state: { product }
    });
  }

  private performSearch(query: string): void {
    this.loader.setLoading('product-search', true);
    this.error.set(null);

    this.searchService.searchProducts(query)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.loader.setLoading('product-search', false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.loader.setLoading('product-search', false);
        }
      });
  }
}
```

## Best Practices

### ✅ Do's

1. **Debounce search input** - Reduce API calls
2. **Show loading states** - Use SKAPA skeleton loaders
3. **Handle errors gracefully** - Display user-friendly messages
4. **Clear search on navigation** - Reset state when leaving
5. **Validate input** - Minimum 2 characters for search
6. **Use computed signals** - For derived state
7. **Track by ID in loops** - Performance optimization

### ❌ Don'ts

1. **Don't search on every keystroke** - Use debounce
2. **Don't forget empty states** - Show helpful messages
3. **Don't hardcode strings** - Use translations
4. **Don't mutate signals** - Use set/update
5. **Don't forget RTL** - Test Arabic layout
6. **Don't skip error handling** - Always handle API errors

---

**Next**: [Condition Assessment](./condition-assessment.md)
