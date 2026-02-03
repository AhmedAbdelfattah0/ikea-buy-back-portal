# Buyback List - Main Single-Page Application

## Overview

The Buyback List feature IS the entire IKEA Buyback Portal application. This is a **single-page application (SPA)** where all functionality is contained in one main component with three state-managed views.

**Important**: This is NOT just a "list" feature - it encompasses the entire buyback flow from product discovery to confirmation.

## Application Architecture

### Single-Page Application Pattern

Instead of multiple routes and pages, this application uses **component state** to toggle between three distinct views:

1. **Browse View** (Default) - Product discovery and selection
2. **Estimation View** - Review items and submit buyback request
3. **Confirmation View** - Success page with quotation number

All views exist within the `BuybackListComponent` and switch based on signal state.

## User Flow

```
User lands on /sa/en/buy-back-quote
  ↓
BROWSE VIEW (default state)
  - Category tree navigation
  - Product grid with search
  - Buyback sidebar with selected items
  - User selects products and conditions
  - Clicks "Continue to Offer" in sidebar
  ↓
ESTIMATION VIEW (showEstimation = true)
  - Review all selected items with prices
  - Read buyback requirements
  - Enter email and store location
  - Click "Submit" or "Back"
  ↓
CONFIRMATION VIEW (showConfirmation = true)
  - Display quotation number (BYB-XXXXXX)
  - Copy-to-clipboard functionality
  - Next steps guide
  - "Estimate Another" resets to Browse View
```

## Feature Structure

```
features/buyback-list/
├── pages/
│   └── buyback-list/                    # MAIN SPA PAGE (entire app)
│       ├── buyback-list.component.ts    # State management & view logic
│       ├── buyback-list.component.html  # Three conditional views
│       └── buyback-list.component.scss  # Layout styles
├── components/
│   ├── buyback-sidebar/                 # Right sidebar (Browse View)
│   │   ├── buyback-sidebar.component.ts
│   │   ├── buyback-sidebar.component.html
│   │   └── buyback-sidebar.component.scss
│   ├── estimation/                      # Estimation View component
│   │   ├── estimation.component.ts
│   │   ├── estimation.component.html
│   │   └── estimation.component.scss
│   └── confirmation/                    # Confirmation View component
│       ├── confirmation.ts
│       ├── confirmation.html
│       └── confirmation.scss
└── services/
    ├── buyback-list.service.ts          # List state + persistence
    └── submission.service.ts            # Submit buyback + generate quotation
```

## View State Management

### State Signals

The main `BuybackListComponent` uses three signals to control views:

```typescript
export class BuybackListComponent extends BaseComponent {
  // View state signals
  showEstimation = signal<boolean>(false);      // Show estimation view
  showConfirmation = signal<boolean>(false);    // Show confirmation view
  confirmationNumber = signal<string>('');      // Generated quotation number
  searchQuery = signal<string>('');             // Search filter

  // Computed signals
  selectedCategory = computed(() => this.categoryService.selectedCategory());
  filteredProducts = computed(() => this.productService.filteredProducts());
}
```

### View Transitions

```typescript
// Default: Browse View
@if (!showEstimation() && !showConfirmation()) {
  <!-- Category tree + Product grid + Sidebar -->
}

// Estimation View
@if (showEstimation() && !showConfirmation()) {
  <app-estimation (back)="showEstimation.set(false)"
                  (submitted)="onSubmissionSuccess($event)">
  </app-estimation>
}

// Confirmation View
@if (showConfirmation()) {
  <app-confirmation [confirmationNumber]="confirmationNumber()"
                    (estimateAnotherClick)="onEstimateAnother()">
  </app-confirmation>
}
```

### View Transition Methods

```typescript
// Show estimation view (from Browse View)
onContinueToOffer(): void {
  this.showEstimation.set(true);
}

// Show confirmation view (from Estimation View)
onSubmissionSuccess(confirmationNum: string): void {
  this.confirmationNumber.set(confirmationNum);
  this.showEstimation.set(false);
  this.showConfirmation.set(true);
}

// Reset to Browse View (from Confirmation View)
onEstimateAnother(): void {
  this.showConfirmation.set(false);
  this.showEstimation.set(false);
  this.confirmationNumber.set('');
  this.clearCategorySelection();
  this.clearSearch();
}
```

## Browse View

### Layout

The Browse View uses a **two-column responsive layout**:

- **Left Column**: Category tree OR Product grid + Search
- **Right Column**: Buyback sidebar (sticky)

### Components Used

1. **CategoryTreeComponent** (`product-discovery/components/category-tree`)
   - Hierarchical category navigation
   - Clickable categories with icons
   - Signals category selection to ProductService

2. **ProductGridComponent** (`product-discovery/components/product-grid`)
   - Grid of product cards
   - Responsive (1-4 columns)
   - Click to open condition selector

3. **ConditionSelectorComponent** (`product-discovery/components/condition-selector`)
   - Modal overlay
   - Product details with image
   - Condition options (Like New, Very Good, Well Used)
   - Adds to buyback list

4. **BuybackSidebarComponent**
   - Shows selected items count
   - Displays total estimated value
   - "Continue to Offer" button
   - Emits `continueToOfferClick` event

### State Flow

```
User clicks category
  → categoryService.selectCategory(category)
  → productService.setCategoryFilter(categoryId)
  → filteredProducts() recomputes
  → ProductGrid updates

User clicks product
  → conditionSelector.open(product)
  → User selects condition
  → buybackListService.addItem(product, condition)
  → Sidebar updates with new item count

User clicks "Continue to Offer"
  → Sidebar emits continueToOfferClick
  → showEstimation.set(true)
  → View switches to Estimation
```

## Estimation View

### Purpose

Review selected items, enter user information, and submit the buyback request.

### Features

- **Items Review Section**:
  - List of all selected products with conditions
  - Individual item prices
  - Total estimated value (using skapa-price)

- **Requirements Section**:
  - Buyback requirements checklist
  - Terms and conditions

- **User Information Form**:
  - Email input
  - Store location selector
  - Form validation

- **Actions**:
  - "Back" button → returns to Browse View
  - "Submit" button → calls submission service

### Submission Flow

```typescript
onSubmit(): void {
  const items = this.buybackListService.items();
  const formData = {
    email: this.email(),
    store: this.selectedStore(),
    items: items
  };

  this.submissionService.submitBuyback(formData)
    .subscribe({
      next: (response) => {
        this.submitted.emit(response.confirmationNumber);
      },
      error: (err) => {
        // Show error toast
      }
    });
}
```

## Confirmation View

### Purpose

Display success message and next steps after successful submission.

### Features

- **Confirmation Number**:
  - Generated format: `BYB-XXXXXX`
  - Copy-to-clipboard button
  - Success toast notification on copy

- **Next Steps Guide**:
  - 4-step process explanation
  - Timeline information
  - Contact details

- **Actions**:
  - "Estimate Another Product" → resets to Browse View
  - "Share Your Feedback" → opens feedback form (future)

- **Responsive Design**:
  - Mobile: Stacked layout
  - Tablet: Side-by-side content
  - Desktop: Full-bleed image with text overlay

### Component API

```typescript
@Component({
  selector: 'app-confirmation'
})
export class ConfirmationComponent {
  @Input() confirmationNumber: string = '';
  @Output() estimateAnotherClick = new EventEmitter<void>();

  copyQuotationNumber(): void {
    navigator.clipboard.writeText(this.confirmationNumber);
    // Show toast notification
  }

  estimateAnother(): void {
    this.estimateAnotherClick.emit();
  }
}
```

## Services

### BuybackListService

Manages the list of selected products for buyback.

```typescript
@Injectable({ providedIn: 'root' })
export class BuybackListService {
  private _items = signal<BuybackItem[]>([]);
  public readonly items = this._items.asReadonly();
  public readonly totalItems = computed(() => this._items().length);
  public readonly totalValue = computed(() =>
    this._items().reduce((sum, item) => sum + item.estimatedPrice, 0)
  );

  addItem(product: Product, condition: Condition): void {
    const item: BuybackItem = {
      id: crypto.randomUUID(),
      product,
      condition,
      estimatedPrice: this.calculatePrice(product, condition),
      addedAt: new Date()
    };
    this._items.update(items => [...items, item]);
    this.persistToStorage();
  }

  removeItem(itemId: string): void {
    this._items.update(items => items.filter(i => i.id !== itemId));
    this.persistToStorage();
  }

  clear(): void {
    this._items.set([]);
    this.datastore.remove(STORAGE_KEYS.BUYBACK_LIST);
  }
}
```

### SubmissionService

Handles buyback request submission and quotation generation.

```typescript
@Injectable({ providedIn: 'root' })
export class SubmissionService {
  submitBuyback(data: SubmissionData): Observable<SubmissionResponse> {
    // Mock implementation with 1-second delay
    return of({
      confirmationNumber: this.generateConfirmationNumber(),
      estimatedTotal: data.items.reduce((sum, i) => sum + i.estimatedPrice, 0),
      submittedAt: new Date()
    }).pipe(delay(1000));
  }

  private generateConfirmationNumber(): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `BYB-${randomNum}`;
  }
}
```

## Responsive Behavior

### Browse View Breakpoints

- **Mobile (<600px)**: Single column, sidebar at bottom
- **Tablet (600-1024px)**: Sidebar shows as overlay/drawer
- **Desktop (>1024px)**: Two-column layout with fixed sidebar

### Grid System

The application uses a custom 3-breakpoint grid:

- **Base (mobile)**: 4 columns, 0.75rem gaps
- **Tablet (37.5em+)**: 6 columns, 1rem gaps
- **Desktop (56.25em+)**: 12 columns, 1.25rem gaps

See `confirmation.component.scss` for implementation example.

## Routing

**Important**: This is a single-page application with ONE route:

```typescript
// app.routes.ts
{
  path: 'buy-back-quote',
  loadComponent: () => import('./features/buyback-list/pages/buyback-list/buyback-list.component')
    .then(m => m.BuybackListComponent)
}
```

**All view changes are handled via component state, NOT routing.**

## Why Single-Page Architecture?

### Benefits

1. **Faster Navigation**: Instant view switching without route changes
2. **Simpler State Management**: All state in one component hierarchy
3. **Better Performance**: Single lazy chunk instead of multiple route chunks
4. **Smoother UX**: No page reloads between views
5. **Easier Debugging**: All flow logic in one place
6. **Smaller Bundle**: Reduced overhead from routing

### Tradeoffs

1. **No Deep Linking**: Can't link directly to Estimation or Confirmation views
2. **Browser History**: Back button doesn't navigate between views
3. **State Management**: Must carefully manage component state

For this use case, the tradeoffs are acceptable because:
- Buyback flow is linear (no need for deep linking)
- Users progress forward through the flow
- No need to bookmark intermediate steps

## Testing

### Component Testing

```typescript
describe('BuybackListComponent', () => {
  it('should show browse view by default', () => {
    expect(component.showEstimation()).toBe(false);
    expect(component.showConfirmation()).toBe(false);
  });

  it('should switch to estimation view', () => {
    component.onContinueToOffer();
    expect(component.showEstimation()).toBe(true);
  });

  it('should switch to confirmation view after submission', () => {
    component.onSubmissionSuccess('BYB-123456');
    expect(component.showConfirmation()).toBe(true);
    expect(component.confirmationNumber()).toBe('BYB-123456');
  });

  it('should reset to browse view', () => {
    component.onEstimateAnother();
    expect(component.showEstimation()).toBe(false);
    expect(component.showConfirmation()).toBe(false);
  });
});
```

## Related Documentation

- [Confirmation Page](./confirmation-page.md) - Detailed confirmation view documentation
- [Product Discovery](./product-discovery.md) - Reusable product UI components
- [Folder Structure](../01-architecture/folder-structure.md) - Project organization
- [Routing and Localization](../02-core-concepts/routing-and-localization.md) - SPA routing setup
