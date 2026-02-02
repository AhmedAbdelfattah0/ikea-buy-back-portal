# SKAPA Design System Integration

## Overview

The IKEA Buyback Portal uses the **SKAPA Design System** - IKEA's official design system built with web components. This guide explains how to integrate and use SKAPA components in the application.

## What is SKAPA?

SKAPA is IKEA's design system that provides:
- Pre-built web components
- Consistent IKEA branding
- Accessibility built-in
- Cross-framework compatibility
- Design tokens and guidelines

## Installation

### 1. Install SKAPA Packages

```bash
npm install @ingka/skeleton-webc --save
npm install @ingka/button-webc --save
npm install @ingka/modal-webc --save
npm install @ingka/input-field-webc --save
npm install @ingka/select-webc --save
npm install @ingka/card-webc --save
npm install @ingka/icon-webc --save
npm install @ingka/icon-store --save
# ... other SKAPA packages as needed
```

### 2. Import in BaseComponent

All SKAPA web components are imported centrally in `BaseComponent` to avoid duplicate imports.

```typescript
// src/app/shared/base-classes/base.component.ts

import '@ingka/skeleton-webc';
import '@ingka/button-webc';
import '@ingka/modal-webc';
import '@ingka/input-field-webc';
import '@ingka/select-webc';
import '@ingka/card-webc';
import '@ingka/icon-webc';
import '@ingka/icon-store/heart';
import '@ingka/icon-store/trash-can';
import '@ingka/icon-store/shopping-bag-add';
// ... other imports

@Injectable()
export class BaseComponent implements OnDestroy {
  // ...
}
```

### 3. Enable CUSTOM_ELEMENTS_SCHEMA

Every component using SKAPA web components must include `CUSTOM_ELEMENTS_SCHEMA`.

```typescript
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-my-component',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Required!
  // ...
})
export class MyComponent extends BaseComponent {
  // ...
}
```

## Using SKAPA Components

### Skeleton Loader

SKAPA skeleton loaders are used for loading states (NOT spinners).

```html
<!-- Text skeleton -->
<skapa-skeleton variant="text" rows="3"></skapa-skeleton>

<!-- Image skeleton -->
<skapa-skeleton variant="image" width="200px" height="200px"></skapa-skeleton>

<!-- Card skeleton -->
<skapa-skeleton variant="card"></skapa-skeleton>

<!-- List skeleton -->
<skapa-skeleton variant="list" items="5"></skapa-skeleton>
```

#### With Loading State

```typescript
export class ProductListComponent {
  isLoading = signal<boolean>(true);

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      }
    });
  }
}
```

```html
@if (isLoading()) {
  <skapa-skeleton variant="card"></skapa-skeleton>
  <skapa-skeleton variant="card"></skapa-skeleton>
  <skapa-skeleton variant="card"></skapa-skeleton>
} @else {
  @for (product of products(); track product.id) {
    <app-product-card [product]="product"></app-product-card>
  }
}
```

### Buttons

```html
<!-- Primary button -->
<skapa-button variant="primary" (click)="onSubmit()">
  Submit
</skapa-button>

<!-- Secondary button -->
<skapa-button variant="secondary" (click)="onCancel()">
  Cancel
</skapa-button>

<!-- Text button -->
<skapa-button variant="text" (click)="onEdit()">
  Edit
</skapa-button>

<!-- With icon -->
<skapa-button variant="primary">
  <skapa-icon slot="icon" icon="shopping-bag-add"></skapa-icon>
  Add to List
</skapa-button>

<!-- Disabled -->
<skapa-button variant="primary" [disabled]="!isValid()">
  Submit
</skapa-button>

<!-- Loading state -->
<skapa-button variant="primary" [loading]="isSubmitting()">
  {{ isSubmitting() ? 'Submitting...' : 'Submit' }}
</skapa-button>
```

### Input Fields

```html
<!-- Text input -->
<skapa-input-field
  label="Email Address"
  type="email"
  [value]="email()"
  (input)="onEmailChange($event)"
  placeholder="Enter your email"
  required>
</skapa-input-field>

<!-- With error -->
<skapa-input-field
  label="Email Address"
  type="email"
  [value]="email()"
  [error]="emailError()"
  error-message="Please enter a valid email">
</skapa-input-field>

<!-- Disabled -->
<skapa-input-field
  label="Store Location"
  [value]="selectedStore()"
  disabled>
</skapa-input-field>
```

#### Angular Forms Integration

```typescript
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  // ...
})
export class UserFormComponent {
  email = signal<string>('');

  onEmailChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.email.set(target.value);
  }
}
```

```html
<skapa-input-field
  label="Email"
  [value]="email()"
  (input)="onEmailChange($event)">
</skapa-input-field>
```

### Select Dropdown

```html
<skapa-select
  label="Store Location"
  [value]="selectedStore()"
  (change)="onStoreChange($event)">
  <option value="">Select a store</option>
  @for (store of stores(); track store.id) {
    <option [value]="store.id">{{ store.name }}</option>
  }
</skapa-select>
```

#### With Signal

```typescript
export class StoreSelector Component {
  selectedStore = signal<string>('');
  stores = signal<Store[]>([]);

  onStoreChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedStore.set(target.value);
  }
}
```

### Cards

```html
<skapa-card>
  <div slot="header">
    <h3>Product Name</h3>
  </div>
  <div slot="content">
    <p>Product description goes here</p>
  </div>
  <div slot="footer">
    <skapa-button variant="primary">Select</skapa-button>
  </div>
</skapa-card>
```

### Modal

```html
<skapa-modal
  [open]="isModalOpen()"
  (close)="closeModal()"
  heading="Confirm Action">
  <div slot="content">
    <p>Are you sure you want to proceed?</p>
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

#### Modal Management

```typescript
export class ConfirmationComponent {
  isModalOpen = signal<boolean>(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  confirm() {
    // Perform action
    this.closeModal();
  }
}
```

### Icons

```html
<!-- Simple icon -->
<skapa-icon icon="heart"></skapa-icon>

<!-- With size -->
<skapa-icon icon="trash-can" size="24"></skapa-icon>

<!-- With color -->
<skapa-icon icon="shopping-bag-add" color="#0058a3"></skapa-icon>

<!-- In button -->
<skapa-button variant="text">
  <skapa-icon slot="icon" icon="edit"></skapa-icon>
  Edit
</skapa-button>
```

#### Available Icons

Common icons from `@ingka/icon-store`:
- `heart` - Favorite/wishlist
- `trash-can` - Delete
- `shopping-bag-add` - Add to cart
- `arrow-right-small` - Navigation
- `arrow-left-small` - Back
- `plus` - Add
- `minus` - Remove
- `magnifying-glass` - Search
- `crosshair` - Location
- `warning-triangle` - Warning

Import specific icons:

```typescript
import '@ingka/icon-store/heart';
import '@ingka/icon-store/trash-can';
```

### Price (MANDATORY)

**Rule**: Every price and total in the application MUST be rendered with `<skapa-price>`. Never use plain text, string interpolation, or `formatCurrency()` for price display. This ensures consistent locale-aware formatting (currency symbol placement, decimal separator) across all markets and languages.

The `<skapa-price>` component renders prices with IKEA-consistent formatting: currency symbol, integer, decimal sign, and decimal value as separate slots. Use `UtilityService.splitPriceForSkapa()` to produce the required parts from a numeric amount.

#### Basic Usage

```html
<skapa-price
  size="small"
  currency-position="leading"
  currency-spacing="thin"
  [integerValue]="getPriceParts(price).integerValue"
  [decimalValue]="getPriceParts(price).decimalValue"
  [decimalSign]="getPriceParts(price).decimalSign"
  [currencyLabel]="getPriceParts(price).currencyLabel">
</skapa-price>
```

#### Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `size` | `small`, `medium`, `large` | Visual size of the price display |
| `currency-position` | `leading`, `trailing` | Where the currency symbol is placed relative to the number |
| `currency-spacing` | `thin`, `normal` | Spacing between the currency symbol and the number |
| `integerValue` | string | The whole-number part of the price |
| `decimalValue` | string | The fractional part (e.g. `"50"`) |
| `decimalSign` | string | The locale-specific decimal separator (`"."` or `","`) |
| `currencyLabel` | string | The currency symbol (`"ر.س"`, `"د.ب"`, etc.) |

#### Component Pattern

```typescript
import { UtilityService } from '../../../../core/services/utility.service';

export class BuybackSidebarComponent extends BaseComponent {
  constructor(private utility: UtilityService) {
    super();
  }

  // Wrapper keeps templates clean
  getPriceParts(price: number) {
    return this.utility.splitPriceForSkapa(price);
  }
}
```

#### Size Usage Guidelines

- **`small`** — Individual item prices in lists
- **`medium`** — Summary totals (Total Estimate, IKEA Family Price)
- **`large`** — Hero/hero-level price displays (e.g. final offer on confirmation page)

#### RTL

`<skapa-price>` automatically respects `dir="rtl"` — currency symbol placement and text direction are handled by the component.

## Event Handling

SKAPA web components emit native DOM events.

### Click Events

```html
<skapa-button (click)="handleClick()">
  Click Me
</skapa-button>
```

### Input Events

```html
<skapa-input-field
  (input)="handleInput($event)"
  (change)="handleChange($event)"
  (blur)="handleBlur($event)">
</skapa-input-field>
```

### Custom Events

```html
<!-- SKAPA custom events -->
<skapa-modal (close)="handleModalClose()">
</skapa-modal>

<skapa-select (change)="handleSelectChange($event)">
</skapa-select>
```

## Styling SKAPA Components

### Using CSS Custom Properties

SKAPA components can be styled using CSS custom properties (CSS variables).

```scss
skapa-button {
  --button-background: #0058a3;
  --button-text-color: #ffffff;
  --button-border-radius: 4px;
}

skapa-input-field {
  --input-border-color: #cccccc;
  --input-focus-border-color: #0058a3;
}
```

### Global Theme Variables

```scss
// src/assets/global/_variables.scss

:root {
  --skapa-primary-color: #0058a3;
  --skapa-secondary-color: #ffda1a;
  --skapa-text-color: #111111;
  --skapa-border-color: #cccccc;
}

[dir='rtl'] {
  --skapa-text-align: right;
}
```

### Component-Specific Styles

```scss
// Component SCSS file
.product-card {
  skapa-button {
    width: 100%;
    margin-top: 16px;
  }

  skapa-card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```

## RTL Support

SKAPA components automatically support RTL when `dir="rtl"` is set on the HTML element.

```html
<!-- Automatically RTL when dir="rtl" -->
<html dir="rtl">
  <skapa-button>زر</skapa-button>
  <skapa-input-field label="البريد الإلكتروني"></skapa-input-field>
</html>
```

### Testing RTL

Navigate to Arabic version:
```
http://localhost:4200/sa/ar/search
```

All SKAPA components should automatically flip to RTL layout.

## Accessibility

SKAPA components come with built-in accessibility features:

- **Keyboard Navigation**: Tab, Enter, Space, Arrow keys
- **ARIA Labels**: Proper ARIA attributes
- **Screen Reader Support**: Semantic HTML and ARIA
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant

### Enhancing Accessibility

```html
<!-- Add aria-label for context -->
<skapa-button aria-label="Add sofa to buyback list">
  Add
</skapa-button>

<!-- Add aria-describedby for errors -->
<skapa-input-field
  id="email"
  label="Email"
  aria-describedby="email-error">
</skapa-input-field>
<span id="email-error" role="alert">{{ emailError() }}</span>
```

## Best Practices

### ✅ Do's

1. **Import in BaseComponent** - Centralize SKAPA imports
2. **Use Skeleton Loaders** - Not spinners for loading states
3. **Handle Events Properly** - Use Angular event binding
4. **Test RTL** - Verify all components work in Arabic
5. **Use Slots** - Leverage web component slots for content
6. **Follow SKAPA Guidelines** - Use components as intended

### ❌ Don'ts

1. **Don't Import in Multiple Components** - Import once in BaseComponent
2. **Don't Forget CUSTOM_ELEMENTS_SCHEMA** - Required for web components
3. **Don't Override Core Styles** - Use CSS custom properties instead
4. **Don't Mix UI Libraries** - Use SKAPA exclusively for consistency
5. **Don't Skip Accessibility** - Always add proper labels and ARIA
6. **Don't Render Prices as Plain Text** - All prices and totals MUST use `<skapa-price>` — never `formatCurrency()` or `{{ price }}`

## Troubleshooting

### Components Not Rendering

**Issue**: SKAPA components show as unknown elements

**Solution**:
1. Check `CUSTOM_ELEMENTS_SCHEMA` is added to component
2. Verify imports in BaseComponent
3. Ensure component extends BaseComponent

### Styles Not Applying

**Issue**: CSS custom properties not working

**Solution**:
1. Check variable names match SKAPA documentation
2. Verify specificity of selectors
3. Use browser DevTools to inspect actual custom properties

### Events Not Firing

**Issue**: Click or change events not working

**Solution**:
1. Use Angular event binding `(event)="handler()"`
2. Check event name matches SKAPA documentation
3. Verify handler method exists

### RTL Not Working

**Issue**: Components not flipping to RTL

**Solution**:
1. Ensure `dir="rtl"` is set on HTML element
2. Check SKAPA component version supports RTL
3. Clear browser cache

## Reference

- **SKAPA Documentation**: [Internal IKEA Link]
- **Web Components**: [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- **CSS Custom Properties**: [MDN CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

---

**Next**: [Shared Components](./shared-components.md)
