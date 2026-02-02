# Offer Calculation

## Overview

The Offer Calculation feature calculates the final buyback offer based on selected products, their conditions, and whether the user is an IKEA Family member. This feature is integrated throughout the buyback flow rather than being a separate page.

## Calculation Flow

```
Buyback Items with Conditions
  ↓
Calculate Base Total
  ↓
Apply IKEA Family Discount (if applicable)
  ↓
Display Final Offer
  ↓
Show Price Breakdown
```

## Feature Structure

```
features/offer-calculation/
├── components/
│   ├── offer-summary/             # Total offer display
│   ├── price-breakdown/           # Itemized pricing
│   └── ikea-family-toggle/        # Family member toggle
├── services/
│   └── offer-calculation.service.ts  # Pricing logic
└── models/
    └── offer.model.ts             # Offer business logic
```

## Components

### 1. Offer Summary Component

**Purpose**: Display total offer with IKEA Family option.

**Location**: `features/offer-calculation/components/offer-summary/`

**Props**:
```typescript
@Input() items!: BuybackItem[];
@Input() isFamilyMember: boolean = false;
@Output() familyStatusChanged = new EventEmitter<boolean>();
```

**State**:
```typescript
export class OfferSummaryComponent {
  @Input() items!: BuybackItem[];
  @Input() isFamilyMember: boolean = false;
  @Output() familyStatusChanged = new EventEmitter<boolean>();

  offer = computed(() =>
    this.offerService.calculateOffer(this.items, this.isFamilyMember)
  );

  translations = computed(() => this.locale.translations().offer);

  constructor(
    private offerService: OfferCalculationService,
    private locale: LocaleService
  ) {}

  onFamilyStatusChange(isMember: boolean): void {
    this.familyStatusChanged.emit(isMember);
  }
}
```

**Template**:
```html
<div class="offer-summary">
  <h2>{{ translations().title }}</h2>

  <!-- IKEA Family Toggle -->
  <app-ikea-family-toggle
    [isFamilyMember]="isFamilyMember"
    (statusChanged)="onFamilyStatusChange($event)">
  </app-ikea-family-toggle>

  <!-- Offer Display -->
  <div class="offer-display">
    <div class="subtotal">
      <span class="label">{{ translations().subtotal }}:</span>
      <span class="value">{{ offer().subtotal | currency }}</span>
    </div>

    @if (isFamilyMember && offer().familyDiscount > 0) {
      <div class="discount">
        <span class="label">{{ translations().familyDiscount }}:</span>
        <span class="value success">
          +{{ offer().familyDiscount | currency }}
        </span>
      </div>
    }

    <div class="total">
      <span class="label">{{ translations().totalOffer }}:</span>
      <span class="value highlight">{{ offer().total | currency }}</span>
    </div>
  </div>

  <!-- Price Breakdown Link -->
  <skapa-button
    variant="text"
    (click)="showBreakdown = !showBreakdown">
    {{ translations().viewBreakdown }}
  </skapa-button>

  @if (showBreakdown) {
    <app-price-breakdown
      [items]="items"
      [offer]="offer()">
    </app-price-breakdown>
  }
</div>
```

**Styles**:
```scss
.offer-summary {
  background: $color-background-light;
  padding: $spacing-lg;
  border-radius: $border-radius;
  border: 2px solid $color-primary;

  .offer-display {
    margin: $spacing-md 0;

    .subtotal,
    .discount,
    .total {
      display: flex;
      justify-content: space-between;
      padding: $spacing-sm 0;
      font-size: $font-size-md;

      .label {
        color: $color-text-secondary;
      }

      .value {
        font-weight: $font-weight-semibold;

        &.success {
          color: $color-success;
        }

        &.highlight {
          color: $color-primary;
          font-size: $font-size-xl;
          font-weight: $font-weight-bold;
        }
      }
    }

    .total {
      border-top: 2px solid $color-border;
      padding-top: $spacing-md;
      margin-top: $spacing-sm;
    }
  }
}
```

### 2. IKEA Family Toggle Component

**Purpose**: Toggle for IKEA Family membership status.

**Props**:
```typescript
@Input() isFamilyMember: boolean = false;
@Output() statusChanged = new EventEmitter<boolean>();
```

**Template**:
```html
<div class="ikea-family-toggle">
  <div class="toggle-header">
    <skapa-icon icon="heart" [class.active]="isFamilyMember"></skapa-icon>
    <div class="toggle-text">
      <h4>{{ translations().isFamilyMember }}</h4>
      <p>{{ translations().familyBenefit }}</p>
    </div>
  </div>

  <div class="toggle-switch">
    <label class="switch">
      <input
        type="checkbox"
        [checked]="isFamilyMember"
        (change)="onToggle($event)" />
      <span class="slider"></span>
    </label>
  </div>

  @if (isFamilyMember) {
    <div class="benefit-badge">
      <span>+10% {{ translations().bonus }}</span>
    </div>
  }
</div>
```

**Logic**:
```typescript
export class IkeaFamilyToggleComponent {
  @Input() isFamilyMember: boolean = false;
  @Output() statusChanged = new EventEmitter<boolean>();

  translations = computed(() => this.locale.translations().offer);

  constructor(private locale: LocaleService) {}

  onToggle(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.statusChanged.emit(target.checked);
  }
}
```

### 3. Price Breakdown Component

**Purpose**: Show itemized price breakdown.

**Props**:
```typescript
@Input() items!: BuybackItem[];
@Input() offer!: OfferCalculation;
```

**Template**:
```html
<div class="price-breakdown">
  <h3>{{ translations().priceBreakdown }}</h3>

  <div class="breakdown-items">
    @for (item of items; track item.id) {
      <div class="breakdown-item">
        <div class="item-info">
          <span class="name">{{ item.product.name }}</span>
          <span class="condition">{{ getConditionLabel(item.condition) }}</span>
        </div>
        <div class="item-prices">
          <span class="base">{{ item.basePrice | currency }}</span>
          <span class="arrow">→</span>
          <span class="adjusted">{{ item.adjustedPrice | currency }}</span>
        </div>
      </div>
    }
  </div>

  <div class="breakdown-summary">
    <div class="summary-row">
      <span>{{ translations().itemsSubtotal }}:</span>
      <span>{{ offer.subtotal | currency }}</span>
    </div>

    @if (offer.familyDiscount > 0) {
      <div class="summary-row discount">
        <span>{{ translations().familyBonus }} (10%):</span>
        <span class="success">+{{ offer.familyDiscount | currency }}</span>
      </div>
    }

    <div class="summary-row total">
      <span>{{ translations().finalOffer }}:</span>
      <span class="highlight">{{ offer.total | currency }}</span>
    </div>
  </div>
</div>
```

## Services

### OfferCalculationService

**Purpose**: Calculate buyback offers with discounts.

**Location**: `features/offer-calculation/services/offer-calculation.service.ts`

**Implementation**:
```typescript
import { Injectable, signal } from '@angular/core';
import { BuybackItem } from '../../buyback-list/models/buyback-item.model';

export interface OfferCalculation {
  subtotal: number;
  familyDiscount: number;
  total: number;
  itemCount: number;
  currency: string;
}

@Injectable({ providedIn: 'root' })
export class OfferCalculationService {
  private readonly FAMILY_DISCOUNT_RATE = 0.10; // 10%

  calculateOffer(
    items: BuybackItem[],
    isFamilyMember: boolean
  ): OfferCalculation {
    const subtotal = this.calculateSubtotal(items);
    const familyDiscount = isFamilyMember
      ? this.calculateFamilyDiscount(subtotal)
      : 0;
    const total = subtotal + familyDiscount;

    return {
      subtotal,
      familyDiscount,
      total,
      itemCount: items.length,
      currency: 'SAR' // Could be dynamic based on market
    };
  }

  private calculateSubtotal(items: BuybackItem[]): number {
    return items.reduce((sum, item) => sum + item.adjustedPrice, 0);
  }

  private calculateFamilyDiscount(subtotal: number): number {
    return Math.round(subtotal * this.FAMILY_DISCOUNT_RATE * 100) / 100;
  }

  getFamilyDiscountRate(): number {
    return this.FAMILY_DISCOUNT_RATE;
  }

  estimateOffer(
    basePrice: number,
    condition: ProductCondition,
    isFamilyMember: boolean
  ): number {
    // Use ConditionService to get adjusted price
    const adjustedPrice = basePrice * this.getConditionMultiplier(condition);
    const familyBonus = isFamilyMember
      ? adjustedPrice * this.FAMILY_DISCOUNT_RATE
      : 0;
    return adjustedPrice + familyBonus;
  }

  private getConditionMultiplier(condition: ProductCondition): number {
    const multipliers = {
      [ProductCondition.LIKE_NEW]: 1.0,
      [ProductCondition.VERY_GOOD]: 0.75,
      [ProductCondition.WELL_USED]: 0.45
    };
    return multipliers[condition] || 0.5;
  }
}
```

## Models

### Offer Model

**Purpose**: Business logic for offer calculations and validation.

**Location**: `features/offer-calculation/models/offer.model.ts`

**Interface**:
```typescript
export interface OfferDetails {
  subtotal: number;
  discounts: Discount[];
  total: number;
  breakdown: OfferBreakdownItem[];
  validUntil: Date;
}

export interface Discount {
  type: 'FAMILY_MEMBER' | 'PROMO_CODE' | 'SPECIAL_OFFER';
  amount: number;
  description: string;
}

export interface OfferBreakdownItem {
  productName: string;
  productCode: string;
  condition: ProductCondition;
  basePrice: number;
  adjustedPrice: number;
  conditionDiscount: number;
}
```

**Model**:
```typescript
import { Injectable } from '@angular/core';
import { BaseModel } from '../../../shared/base-classes/base.model';
import { UtilityService } from '../../../core/services/utility.service';
import { DatastoreService } from '../../../core/services/datastore.service';
import { LocaleService } from '../../../core/services/locale.service';

@Injectable({ providedIn: 'root' })
export class OfferModel extends BaseModel {
  private readonly OFFER_VALIDITY_DAYS = 7;

  constructor(
    utility: UtilityService,
    datastore: DatastoreService,
    private locale: LocaleService
  ) {
    super(utility, datastore);
  }

  createOfferDetails(
    items: BuybackItem[],
    calculation: OfferCalculation,
    isFamilyMember: boolean
  ): OfferDetails {
    const breakdown = this.createBreakdown(items);
    const discounts = this.createDiscounts(calculation, isFamilyMember);
    const validUntil = this.calculateValidityDate();

    return {
      subtotal: calculation.subtotal,
      discounts,
      total: calculation.total,
      breakdown,
      validUntil
    };
  }

  private createBreakdown(items: BuybackItem[]): OfferBreakdownItem[] {
    return items.map(item => ({
      productName: item.product.name,
      productCode: item.product.code,
      condition: item.condition,
      basePrice: item.basePrice,
      adjustedPrice: item.adjustedPrice,
      conditionDiscount: item.basePrice - item.adjustedPrice
    }));
  }

  private createDiscounts(
    calculation: OfferCalculation,
    isFamilyMember: boolean
  ): Discount[] {
    const discounts: Discount[] = [];

    if (isFamilyMember && calculation.familyDiscount > 0) {
      discounts.push({
        type: 'FAMILY_MEMBER',
        amount: calculation.familyDiscount,
        description: 'IKEA Family Member Bonus (10%)'
      });
    }

    return discounts;
  }

  private calculateValidityDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + this.OFFER_VALIDITY_DAYS);
    return date;
  }

  formatOfferForDisplay(offer: OfferDetails): DisplayOffer {
    const currency = this.locale.currencyConfig();

    return {
      ...offer,
      formattedSubtotal: this.utility.formatCurrency(
        offer.subtotal,
        currency.code
      ),
      formattedTotal: this.utility.formatCurrency(
        offer.total,
        currency.code
      ),
      formattedValidUntil: this.utility.formatDate(offer.validUntil),
      discounts: offer.discounts.map(d => ({
        ...d,
        formattedAmount: this.utility.formatCurrency(d.amount, currency.code)
      }))
    };
  }

  validateOffer(offer: OfferDetails): boolean {
    return !!(
      offer.subtotal >= 0 &&
      offer.total >= 0 &&
      offer.breakdown.length > 0 &&
      offer.validUntil > new Date()
    );
  }

  isOfferExpired(validUntil: Date): boolean {
    return new Date() > new Date(validUntil);
  }
}
```

## Integration Examples

### In Buyback List Page

```typescript
export class BuybackListComponent extends BaseComponent {
  items = computed(() => this.buybackListService.items());
  isFamilyMember = signal<boolean>(false);

  offer = computed(() =>
    this.offerService.calculateOffer(
      this.items(),
      this.isFamilyMember()
    )
  );

  constructor(
    private buybackListService: BuybackListService,
    private offerService: OfferCalculationService,
    private datastore: DatastoreService
  ) {
    super();

    // Load family member status
    this.isFamilyMember.set(this.datastore.isFamilyMember());
  }

  onFamilyStatusChanged(isMember: boolean): void {
    this.isFamilyMember.set(isMember);
    this.datastore.setFamilyMemberStatus(isMember);
  }
}
```

```html
<app-offer-summary
  [items]="items()"
  [isFamilyMember]="isFamilyMember()"
  (familyStatusChanged)="onFamilyStatusChanged($event)">
</app-offer-summary>
```

### In Summary Page

```typescript
export class SummaryComponent extends BaseComponent {
  items = computed(() => this.buybackListService.items());
  isFamilyMember = computed(() => this.datastore.isFamilyMember());

  offerDetails = computed(() => {
    const items = this.items();
    const isMember = this.isFamilyMember();
    const calculation = this.offerService.calculateOffer(items, isMember);
    return this.offerModel.createOfferDetails(items, calculation, isMember);
  });

  constructor(
    private buybackListService: BuybackListService,
    private offerService: OfferCalculationService,
    private offerModel: OfferModel,
    private datastore: DatastoreService
  ) {
    super();
  }
}
```

## Translations

### English

```typescript
offer: {
  title: 'Your Offer',
  totalOffer: 'Total Offer',
  subtotal: 'Subtotal',
  familyMember: 'IKEA Family Member Price',
  nonFamilyMember: 'Regular Price',
  isFamilyMember: 'Are you an IKEA Family member?',
  familyBenefit: 'Get 10% bonus on your buyback offer',
  familyDiscount: 'Family Member Bonus',
  bonus: 'Bonus',
  yes: 'Yes',
  no: 'No',
  currency: 'SAR',
  priceBreakdown: 'Price Breakdown',
  viewBreakdown: 'View Price Breakdown',
  itemsSubtotal: 'Items Subtotal',
  familyBonus: 'Family Member Bonus',
  finalOffer: 'Final Offer',
  validUntil: 'Offer valid until'
}
```

### Arabic

```typescript
offer: {
  title: 'عرضك',
  totalOffer: 'إجمالي العرض',
  subtotal: 'المجموع الفرعي',
  familyMember: 'سعر عضو ايكيا فاميلي',
  nonFamilyMember: 'السعر العادي',
  isFamilyMember: 'هل أنت عضو في ايكيا فاميلي؟',
  familyBenefit: 'احصل على مكافأة 10٪ على عرض إعادة الشراء',
  familyDiscount: 'مكافأة العضوية',
  bonus: 'مكافأة',
  yes: 'نعم',
  no: 'لا',
  currency: 'ر.س',
  priceBreakdown: 'تفاصيل السعر',
  viewBreakdown: 'عرض تفاصيل السعر',
  itemsSubtotal: 'مجموع العناصر',
  familyBonus: 'مكافأة العضوية',
  finalOffer: 'العرض النهائي',
  validUntil: 'العرض صالح حتى'
}
```

## Calculations

### Basic Calculation

```typescript
// 3 items with conditions
Item 1: Base 100 SAR × 1.0 (Like New) = 100 SAR
Item 2: Base 200 SAR × 0.75 (Very Good) = 150 SAR
Item 3: Base 150 SAR × 0.45 (Well Used) = 67.5 SAR

Subtotal = 317.5 SAR
```

### With IKEA Family Discount

```typescript
Subtotal = 317.5 SAR
Family Bonus (10%) = 31.75 SAR
Total Offer = 349.25 SAR
```

## Best Practices

### ✅ Do's

1. **Show clear breakdown** - Itemized pricing
2. **Highlight family benefits** - Encourage membership
3. **Persist family status** - Save to localStorage
4. **Round properly** - Avoid floating point issues
5. **Update reactively** - Use computed signals
6. **Validate calculations** - Ensure totals are correct

### ❌ Don'ts

1. **Don't hardcode discount rates** - Use service constants
2. **Don't skip rounding** - Always round currency
3. **Don't forget to persist** - Save family status
4. **Don't calculate in templates** - Use computed signals
5. **Don't ignore edge cases** - Handle zero items

---

**Next**: [Submission Flow](./submission-flow.md)
