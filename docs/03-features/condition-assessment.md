# Condition Assessment

## Overview

The Condition Assessment feature allows users to select the condition of their product before adding it to the buyback list. The condition directly affects the buyback offer price.

## User Flow

```
Product Selected (from Product Discovery)
  ↓
View Condition Options
  ↓
Select Condition:
  - Like New
  - Very Good
  - Well Used
  ↓
Add to Buyback List
  ↓
[Navigate to Buyback List or Continue Shopping]
```

## Feature Structure

The condition selector is implemented as a **modal** (not a standalone page). It lives under `product-discovery` because it is triggered directly from the product grid when a user taps a product.

```
features/product-discovery/
└── components/
    └── condition-selector/        # Side-sheet modal for condition selection
        ├── condition-selector.component.ts
        ├── condition-selector.component.html
        └── condition-selector.component.scss
```

> The modal is opened programmatically via a `@ViewChild` reference in `BuybackListComponent`:
> ```typescript
> @ViewChild(ConditionSelectorComponent) conditionSelector!: ConditionSelectorComponent;
> onProductSelected(product: Product): void {
>   this.conditionSelector.open(product);
> }
> ```

## Condition Types

### 1. Like New

**Criteria**:
- Minimal or no signs of use
- No visible damage or wear
- Original condition or close to it
- Excellent functional condition

**Price Impact**: 100% of base price

**Translation Keys**:
```typescript
conditionAssessment: {
  likeNew: 'Like New',
  likeNewDesc: 'Minimal signs of use, excellent condition'
}
```

### 2. Very Good

**Criteria**:
- Some signs of use
- Minor cosmetic wear
- Fully functional
- Good overall condition

**Price Impact**: 70-80% of base price

**Translation Keys**:
```typescript
conditionAssessment: {
  veryGood: 'Very Good',
  veryGoodDesc: 'Some signs of use, good condition'
}
```

### 3. Well Used

**Criteria**:
- Clear signs of use
- Visible wear and tear
- Still functional
- Acceptable condition

**Price Impact**: 40-50% of base price

**Translation Keys**:
```typescript
conditionAssessment: {
  wellUsed: 'Well Used',
  wellUsedDesc: 'Clear signs of use, functional condition'
}
```

## Components

### Condition Selector Component (Modal)

**Purpose**: A SKAPA `<skapa-sheet>` side-modal that lets the user pick a condition grade before adding the product to the buyback list. Opened programmatically — not navigated to.

**Location**: `features/product-discovery/components/condition-selector/`

**State**:
```typescript
export class ConditionSelectorComponent extends BaseComponent {
  isOpen = signal<boolean>(false);
  selectedProduct = signal<Product | null>(null);
  selectedCondition = signal<'LIKE_NEW' | 'VERY_GOOD' | 'WELL_USED' | null>(null);

  translations = computed(() => this.locale.translations());
  canSubmit = computed(() => this.selectedCondition() !== null);

  // Condition grade images are served from local assets (public/assets/images/conditions/).
  // CDN hosting was ruled out because fetch() is blocked by CORS on the CDN,
  // and <img> tags bypass CORS but cannot be pre-cached via JS.
  conditions = [
    {
      value: 'LIKE_NEW' as const,
      iconUrl: 'assets/images/conditions/grade-a.jpg',
      translationKey: 'likeNew',
      descriptionKey: 'likeNewDescription'
    },
    {
      value: 'VERY_GOOD' as const,
      iconUrl: 'assets/images/conditions/grade-b.jpg',
      translationKey: 'veryGood',
      descriptionKey: 'veryGoodDescription'
    },
    {
      value: 'WELL_USED' as const,
      iconUrl: 'assets/images/conditions/grade-c.jpg',
      translationKey: 'wellUsed',
      descriptionKey: 'wellUsedDescription'
    }
  ];

  constructor(
    private locale: LocaleService,
    private buybackService: BuybackListService,
    private toasterService: ToasterService
  ) {
    super();
  }

  // Called by BuybackListComponent via @ViewChild
  open(product: Product): void {
    this.selectedProduct.set(product);
    this.selectedCondition.set(null);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.selectedProduct.set(null);
    this.selectedCondition.set(null);
  }

  selectCondition(condition: 'LIKE_NEW' | 'VERY_GOOD' | 'WELL_USED'): void {
    this.selectedCondition.set(condition);
  }

  // Adds item to buyback list and shows a success toast
  confirmSelection(): void {
    const product = this.selectedProduct();
    const condition = this.selectedCondition();
    if (!product || !condition) return;

    this.buybackService.addItem(product, condition);
    this.toasterService.openToaster(toasterCases.ITEM_ADDED);
    this.close();
  }
}
```

**Template** (uses `<skapa-sheet>` for the side-modal):
```html
<skapa-sheet size="small" [open]="isOpen()" (closerequest)="close()">
  <skapa-modal-header slot="header">
    <span slot="closebutton-label">{{ translations().common.close }}</span>
  </skapa-modal-header>

  @if (selectedProduct()) {
    <div class="condition-modal__title">
      <h2>{{ translations().conditionAssessment.title }}</h2>
      <p>{{ translations().conditionAssessment.selectCondition }}</p>
    </div>

    <div class="condition-options">
      @for (conditionOption of conditions; track conditionOption.value) {
        <button
          type="button"
          class="condition-option"
          [class.selected]="selectedCondition() === conditionOption.value"
          (click)="selectCondition(conditionOption.value)"
        >
          <div class="condition-icon">
            <img
              [src]="conditionOption.iconUrl"
              [alt]="translations().conditionAssessment[conditionOption.translationKey]"
            />
          </div>
          <div class="condition-text">
            <h3>{{ translations().conditionAssessment[conditionOption.translationKey] }}</h3>
            <p>{{ translations().conditionAssessment[conditionOption.descriptionKey] }}</p>
          </div>
        </button>
      }
    </div>

    <div class="condition-modal__actions">
      <skapa-button variant="secondary" (click)="close()">
        {{ translations().common.cancel }}
      </skapa-button>
      <skapa-button variant="emphasised" [disabled]="!canSubmit()" (click)="confirmSelection()">
        {{ translations().productDiscovery.addToBuyback }}
      </skapa-button>
    </div>
  }
</skapa-sheet>
```

#### Condition Grade Images

Images are bundled as local assets under `public/assets/images/conditions/`:

| File | Condition |
|------|-----------|
| `grade-a.jpg` | Like New |
| `grade-b.jpg` | Very Good |
| `grade-c.jpg` | Well Used |

These are copied into `dist/` at build time via the `angular.json` assets config (`input: public`). After adding new files to `public/`, restart `ng serve` for the dev server to pick up new subdirectories.

## Integration

### How It Fits Into the Flow

There is no separate condition-assessment route or page component. The flow is:

1. User browses products on the **Buyback List** page (`/buyback-list`).
2. Tapping a product calls `BuybackListComponent.onProductSelected(product)`.
3. That opens the `ConditionSelectorComponent` modal via `@ViewChild`.
4. On confirm, the modal calls `BuybackListService.addItem(product, condition)` directly — item creation and pricing are handled inside the service.
5. A success toast is shown via `ToasterService`.
6. The modal closes and the sidebar updates reactively (signal-driven).

## Translations

### English

```typescript
conditionAssessment: {
  selectCondition: 'Select product condition',
  likeNew: 'Like New',
  likeNewDesc: 'Minimal signs of use, excellent condition',
  veryGood: 'Very Good',
  veryGoodDesc: 'Some signs of use, good condition',
  wellUsed: 'Well Used',
  wellUsedDesc: 'Clear signs of use, functional condition',
  conditionRequired: 'Please select a condition',
  estimatedPrice: 'Estimated Price',
  addToList: 'Add to Buyback List',
  continueShopping: 'Continue Shopping'
}
```

### Arabic

```typescript
conditionAssessment: {
  selectCondition: 'اختر حالة المنتج',
  likeNew: 'كالجديد',
  likeNewDesc: 'علامات استخدام قليلة جداً، حالة ممتازة',
  veryGood: 'جيد جداً',
  veryGoodDesc: 'بعض علامات الاستخدام، حالة جيدة',
  wellUsed: 'مستخدم بشكل جيد',
  wellUsedDesc: 'علامات استخدام واضحة، حالة وظيفية',
  conditionRequired: 'الرجاء اختيار الحالة',
  estimatedPrice: 'السعر المقدر',
  addToList: 'إضافة إلى قائمة إعادة الشراء',
  continueShopping: 'متابعة التسوق'
}
```

## Constants

### Product Condition Enum

```typescript
// src/app/shared/constants/app.constants.ts

export namespace ProductCondition {
  export const LIKE_NEW = 'LIKE_NEW';
  export const VERY_GOOD = 'VERY_GOOD';
  export const WELL_USED = 'WELL_USED';
}

export type ProductCondition =
  | typeof ProductCondition.LIKE_NEW
  | typeof ProductCondition.VERY_GOOD
  | typeof ProductCondition.WELL_USED;
```

## Best Practices

### ✅ Do's

1. **Show clear condition descriptions** - Help users make informed decisions
2. **Display price estimates** - Show impact of condition on price
3. **Validate condition selection** - Ensure condition is selected before proceeding
4. **Use visual indicators** - Highlight selected condition
5. **Persist selections** - Save to localStorage immediately
6. **Handle navigation state** - Pass product data correctly

### ❌ Don'ts

1. **Don't skip condition selection** - Always require condition
2. **Don't hardcode pricing** - Use ConditionService
3. **Don't forget validation** - Check condition is valid
4. **Don't lose product data** - Handle navigation properly
5. **Don't skip translations** - Support all languages

## Edge Cases

### Modal Opened Without a Product

The modal guards its content with `@if (selectedProduct())`. If `open()` is somehow called with a null product the sheet renders empty. In practice this cannot happen because `onProductSelected` in the page component only fires from a concrete product-grid tap.

### Confirm Without Selecting a Condition

The "Add to Buyback List" button is bound to `[disabled]="!canSubmit()"`, where `canSubmit` is a computed that checks `selectedCondition() !== null`. The `confirmSelection()` method also short-circuits if either product or condition is null.

---

**Next**: [Buyback List](./buyback-list.md)
