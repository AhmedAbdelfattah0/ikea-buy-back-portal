# Buyback List

## Overview

The Buyback List feature manages the collection of products users want to sell back to IKEA. Users can view, edit conditions, remove items, and see the total estimated offer before proceeding to submission.

## User Flow

```
Items Added to List (from Condition Assessment)
  ↓
View Buyback List (two-column browse layout)
  ↓
Manage Items:
  - View all items
  - Edit condition / quantity
  - Remove items
  - See total estimate
  ↓
Click "Continue to Offer" in sidebar
  ↓
Estimation View (in-page, no route change)
  - Review items + prices
  - Read requirements
  - Enter email + store
  - Submit or go back
```

## Feature Structure

```
features/buyback-list/
├── pages/
│   └── buyback-list/              # Main page: product browse + sidebar
│       ├── buyback-list.component.ts
│       ├── buyback-list.component.html
│       └── buyback-list.component.scss
├── components/
│   ├── buyback-sidebar/           # Sidebar: items list + price summary
│   │   ├── buyback-sidebar.component.ts
│   │   ├── buyback-sidebar.component.html
│   │   └── buyback-sidebar.component.scss
│   └── estimation/                # In-page estimation & submission view
│       ├── estimation.component.ts
│       ├── estimation.component.html
│       └── estimation.component.scss
└── services/
    └── buyback-list.service.ts    # List state + persistence
```

## Route

| Path | Component | Description |
|------|-----------|-------------|
| `/sa/en/buyback-list` | BuybackListComponent | Buyback list page |

## Components

### 1. Buyback List Page Component

**Purpose**: Main entry route. Renders a two-column browse layout — left panel has category tree, search, and product grid; right panel is the `BuybackSidebarComponent`. When a user taps a product, the `ConditionSelectorComponent` modal opens.

**Location**: `features/buyback-list/pages/buyback-list/`

**State**:
```typescript
export class BuybackListComponent extends BaseComponent {
  @ViewChild(ConditionSelectorComponent) conditionSelector!: ConditionSelectorComponent;

  // Local state
  searchQuery = signal<string>('');

  // Computed from services
  translations = computed(() => this.locale.translations());
  selectedCategory = computed(() => this.categoryService.selectedCategory());
  filteredProducts = computed(() => this.productService.filteredProducts());
  isLoading = computed(() => this.productService.isLoading());

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private locale: LocaleService
  ) {
    super();
  }
}
```

**Key Methods**:
```typescript
// Opens the condition-selector modal for the tapped product
onProductSelected(product: Product): void {
  this.conditionSelector.open(product);
}

onCategorySelected(category: Category): void {
  this.productService.setCategoryFilter(category.id);
}

onSearchInput(event: Event): void {
  const query = (event.target as HTMLInputElement).value;
  this.searchQuery.set(query);
  this.productService.setSearchQuery(query);
}

clearSearch(): void {
  this.searchQuery.set('');
  this.productService.setSearchQuery('');
}

clearCategorySelection(): void {
  this.categoryService.selectCategory(null);
  this.productService.setCategoryFilter(undefined);
}
```

**Layout** (`buyback-list.component.scss`):
```scss
.browse-layout {
  display: grid;
  grid-template-columns: 1fr 500px;   // left browse | right sidebar
  min-height: 100vh;
}

.browse-layout__right {
  position: sticky;
  top: 66px;
  align-self: flex-start;             // prevents sidebar from stretching full viewport height

  @include respond-max('sm') {        // collapse on small screens
    top: 0;
  }
}
```

### 2. Buyback Sidebar Component

**Purpose**: Sticky sidebar that lists all items currently in the buyback list, shows per-item prices using `<skapa-price>`, and displays the total estimate and IKEA Family price at the bottom.

**Location**: `features/buyback-list/components/buyback-sidebar/`

**State**:
```typescript
export class BuybackSidebarComponent extends BaseComponent {
  @Output() continueToOfferClick = new EventEmitter<void>();

  // All derived from BuybackListService signals
  translations     = computed(() => this.locale.translations());
  items            = computed(() => this.buybackService.items());
  itemCount        = computed(() => this.buybackService.itemCount());
  totalValue       = computed(() => this.buybackService.totalValue());
  totalFamilyValue = computed(() => this.buybackService.totalFamilyValue());
  isEmpty          = computed(() => this.buybackService.isEmpty());

  constructor(
    private buybackService: BuybackListService,
    private locale: LocaleService,
    private utility: UtilityService
  ) {
    super();
  }

  // Splits a numeric price into the parts <skapa-price> needs
  getPriceParts(price: number) {
    return this.utility.splitPriceForSkapa(price);
  }

  // Emits event — parent toggles to Estimation view (no route change)
  continueToSummary(): void {
    if (this.isEmpty()) return;
    this.continueToOfferClick.emit();
  }

  getConditionLabel(condition: string): string { /* ... */ }
  onQuantityChange(itemId: string, event: any): void { /* ... */ }
  removeItem(itemId: string): void { /* ... */ }
}
```

**Template highlights — item prices**:
```html
@for (item of items(); track item.id) {
  <div class="buyback-item">
    <!-- thumbnail, name, condition label, quantity stepper ... -->

    <div class="item-price">
      <span class="price-label">{{ translations().buybackList.itemPrice }}:</span>
      <skapa-price
        size="small"
        currency-position="leading"
        currency-spacing="thin"
        [integerValue]="getPriceParts(item.price * item.quantity).integerValue"
        [decimalValue]="getPriceParts(item.price * item.quantity).decimalValue"
        [decimalSign]="getPriceParts(item.price * item.quantity).decimalSign"
        [currencyLabel]="getPriceParts(item.price * item.quantity).currencyLabel">
      </skapa-price>
    </div>

    <button class="delete-btn" (click)="removeItem(item.id)">
      <skapa-icon icon="trash-can"></skapa-icon>
    </button>
  </div>
}
```

**Template highlights — summary totals**:
```html
<div class="buyback-sidebar__summary">
  <!-- Total Estimate -->
  <div class="summary-row">
    <span class="summary-label">{{ translations().buybackList.totalEstimate }}:</span>
    <skapa-price
      size="medium"
      currency-position="leading"
      currency-spacing="thin"
      [integerValue]="getPriceParts(totalValue()).integerValue"
      [decimalValue]="getPriceParts(totalValue()).decimalValue"
      [decimalSign]="getPriceParts(totalValue()).decimalSign"
      [currencyLabel]="getPriceParts(totalValue()).currencyLabel">
    </skapa-price>
  </div>

  <!-- IKEA Family Price -->
  <div class="summary-row summary-row--family">
    <span class="summary-label">{{ translations().buybackList.familyMemberPrice }}:</span>
    <skapa-price
      size="medium"
      currency-position="leading"
      currency-spacing="thin"
      [integerValue]="getPriceParts(totalFamilyValue()).integerValue"
      [decimalValue]="getPriceParts(totalFamilyValue()).decimalValue"
      [decimalSign]="getPriceParts(totalFamilyValue()).decimalSign"
      [currencyLabel]="getPriceParts(totalFamilyValue()).currencyLabel">
    </skapa-price>
  </div>

  <button class="btn btn-primary btn-continue" (click)="continueToSummary()">
    {{ translations().buybackList.continueToOffer }}
  </button>
</div>
```

### 3. Estimation Component

**Purpose**: Full-width, single-column view that replaces the browse layout when the user clicks "Continue to Offer". No route change — toggled in-page via a `showEstimation` signal on `BuybackListComponent`. Contains four sections: item review, total, requirements, and the submission form.

**Location**: `features/buyback-list/components/estimation/`

**State**:
```typescript
export class EstimationComponent extends BaseComponent {
  @Output() back = new EventEmitter<void>();   // parent resets showEstimation

  // Form state
  email           = signal<string>('');
  selectedStore   = signal<string>('atlanta');
  privacyAccepted = signal<boolean>(false);

  // Derived from service
  translations = computed(() => this.locale.translations());
  items        = computed(() => this.buybackService.items());
  totalValue   = computed(() => this.buybackService.totalValue());

  // All prices use skapa-price via this helper
  getPriceParts(price: number) {
    return this.utility.splitPriceForSkapa(price);
  }
}
```

**Wiring in the parent** (`buyback-list.component.html`):
```html
@if (showEstimation()) {
  <app-estimation (back)="showEstimation.set(false)"></app-estimation>
}

@if (!showEstimation()) {
  <!-- existing browse layout -->
  <app-buyback-sidebar (continueToOfferClick)="onContinueToOffer()"></app-buyback-sidebar>
}
```

**Template sections**:

1. **Item list** — thumbnail, name/description/condition, `<skapa-price size="small">` for the line total, quantity stepper, and "Remove Product" link. All mutations go through `BuybackListService` so the sidebar and estimation view stay in sync.

2. **Total row** — `<skapa-price size="medium">` bound to `totalValue()`. Separated from items by a 1 px border.

3. **Requirements** — three numbered items (clean, assembled, original IKEA sticker) with a CSS-rendered sticker label mockup. No external image dependency.

4. **Submission form** — email `<input>`, store `<select>`, privacy checkbox with a link to the privacy policy (`ExternalUrls.PRIVACY_POLICY`), "Sell back to IKEA" primary button, and "Go back to homepage" outlined button.

**Price rendering** (mandatory pattern — see `skapa-integration.md`):
```html
<!-- Per-item price -->
<skapa-price
  size="small"
  currency-position="leading"
  currency-spacing="thin"
  [integerValue]="getPriceParts(item.price * item.quantity).integerValue"
  [decimalValue]="getPriceParts(item.price * item.quantity).decimalValue"
  [decimalSign]="getPriceParts(item.price * item.quantity).decimalSign"
  [currencyLabel]="getPriceParts(item.price * item.quantity).currencyLabel">
</skapa-price>

<!-- Total -->
<skapa-price
  size="medium"
  currency-position="leading"
  currency-spacing="thin"
  [integerValue]="getPriceParts(totalValue()).integerValue"
  [decimalValue]="getPriceParts(totalValue()).decimalValue"
  [decimalSign]="getPriceParts(totalValue()).decimalSign"
  [currencyLabel]="getPriceParts(totalValue()).currencyLabel">
</skapa-price>
```

## Services

### BuybackListService

**Purpose**: Manage buyback list state and persistence.

**Location**: `features/buyback-list/services/buyback-list.service.ts`

**Implementation**:
```typescript
import { Injectable, signal, computed } from '@angular/core';
import { DatastoreService } from '../../../core/services/datastore.service';
import { ConditionService } from '../../condition-assessment/services/condition.service';
import { BuybackItem } from '../models/buyback-item.model';
import { ProductCondition } from '../../../shared/constants/app.constants';

@Injectable({ providedIn: 'root' })
export class BuybackListService {
  private _items = signal<BuybackItem[]>([]);

  // Readonly signals
  readonly items = this._items.asReadonly();

  // Computed values
  readonly itemCount = computed(() => this._items().length);

  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.adjustedPrice, 0)
  );

  readonly isEmpty = computed(() => this.itemCount() === 0);

  constructor(
    private datastore: DatastoreService,
    private conditionService: ConditionService
  ) {
    this.loadFromStorage();
  }

  loadFromStorage(): void {
    const stored = this.datastore.getBuybackList<BuybackItem>();
    this._items.set(stored);
  }

  saveToStorage(): void {
    this.datastore.setBuybackList(this._items());
  }

  addItem(item: BuybackItem): void {
    this._items.update(items => [...items, item]);
    this.saveToStorage();
  }

  removeItem(itemId: string): void {
    this._items.update(items => items.filter(item => item.id !== itemId));
    this.saveToStorage();
  }

  updateItemCondition(itemId: string, newCondition: ProductCondition): void {
    this._items.update(items =>
      items.map(item => {
        if (item.id === itemId) {
          const adjustedPrice = this.conditionService.calculatePrice(
            item.basePrice,
            newCondition
          );
          return { ...item, condition: newCondition, adjustedPrice };
        }
        return item;
      })
    );
    this.saveToStorage();
  }

  getItemById(itemId: string): BuybackItem | undefined {
    return this._items().find(item => item.id === itemId);
  }

  clear(): void {
    this._items.set([]);
    this.datastore.clearBuybackList();
  }

  hasItem(productId: string): boolean {
    return this._items().some(item => item.product.id === productId);
  }
}
```

## Translations

### English

```typescript
buybackList: {
  title: 'Your Buyback List',
  empty: 'No items in your list yet',
  emptyDescription: 'Start by searching for products you want to sell back',
  startShopping: 'Find Products',
  itemCount: 'items',
  noItems: 'Your buyback list is empty',
  removeItem: 'Remove',
  updateCondition: 'Update condition',
  continueToOffer: 'Continue to Offer',
  // Price labels (used by BuybackSidebarComponent with <skapa-price>)
  itemPrice: 'Price',
  totalEstimate: 'Total Estimate',
  familyMemberPrice: 'IKEA Family Price'
}
```

### Arabic

```typescript
buybackList: {
  title: 'قائمة إعادة الشراء الخاصة بك',
  empty: 'لا توجد عناصر في قائمتك بعد',
  emptyDescription: 'ابدأ بالبحث عن المنتجات التي تريد بيعها',
  startShopping: 'ابحث عن المنتجات',
  itemCount: 'عناصر',
  noItems: 'قائمة إعادة الشراء فارغة',
  removeItem: 'إزالة',
  updateCondition: 'تحديث الحالة',
  continueToOffer: 'المتابعة إلى العرض',
  // تسميات الأسعار (يستخدمها BuybackSidebarComponent مع <skapa-price>)
  itemPrice: 'السعر',
  totalEstimate: 'التقدير الإجمالي',
  familyMemberPrice: 'سعر عائلة ايكيا'
}
```

## Best Practices

### ✅ Do's

1. **Persist immediately** - Save to localStorage on every change
2. **Load on init** - Restore state when page loads
3. **Show empty state** - Guide users when list is empty
4. **Confirm deletions** - Prevent accidental removals
5. **Display totals prominently** - Show estimated value
6. **Allow condition editing** - Let users update without removing
7. **Use computed signals** - For totals and counts

### ❌ Don'ts

1. **Don't lose data on refresh** - Always persist to storage
2. **Don't allow empty submissions** - Validate before continuing
3. **Don't forget confirmation** - Always confirm delete
4. **Don't mutate signals directly** - Use update()
5. **Don't skip validation** - Validate items before saving

## Edge Cases

### Empty Sidebar

The sidebar shows an empty-state message (`noItems` translation key) when `BuybackListService.isEmpty()` is true. The "Continue to Offer" button is guarded — it emits `continueToOfferClick` only when the list is non-empty:

```typescript
continueToSummary(): void {
  if (this.isEmpty()) return;            // no-op when list is empty
  this.continueToOfferClick.emit();      // parent switches to Estimation view
}
```

### Quantity Changes

`skapa-quantity-stepper` emits a custom event. The sidebar extracts the value from `event.detail` and forwards it to the service:

```typescript
onQuantityChange(itemId: string, event: any): void {
  const quantity = event.detail?.value || event.detail;
  this.buybackService.updateQuantity(itemId, quantity);
}
```

---

**Next**: [Offer Calculation](./offer-calculation.md)
