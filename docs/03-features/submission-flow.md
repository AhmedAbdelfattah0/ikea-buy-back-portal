# Submission Flow

## Overview

The Submission Flow is the final step where users review their buyback list, provide contact information, select a store, and receive a quotation number for their buyback submission.

## User Flow

```
Buyback List Complete
  ↓
Review Summary Page
  - View all items
  - See final offer
  - Enter email
  - Select store location
  - Accept terms
  ↓
Submit
  ↓
Confirmation Page
  - Display quotation number
  - Show next steps
  - Provide store contact info
```

## Feature Structure

```
features/submission/
├── pages/
│   ├── summary/                   # Review page before submission
│   │   ├── summary.component.ts
│   │   ├── summary.component.html
│   │   └── summary.component.scss
│   └── confirmation/              # Success confirmation page
│       ├── confirmation.component.ts
│       ├── confirmation.component.html
│       └── confirmation.component.scss
├── components/
│   ├── user-info-form/            # Email + store form
│   ├── submission-review/         # Review items
│   └── quotation-display/         # Quotation number display
├── services/
│   └── submission.service.ts      # Submit buyback
└── models/
    ├── submission.model.ts        # Submission logic
    └── quotation.model.ts         # Quotation generation
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/sa/en/summary` | SummaryComponent | Review and submit page |
| `/sa/en/confirmation` | ConfirmationComponent | Success confirmation |

## Pages

### 1. Summary Page Component

**Purpose**: Review buyback and submit.

**Location**: `features/submission/pages/summary/`

**State**:
```typescript
export class SummaryComponent extends BaseComponent implements OnInit {
  // Data
  items = computed(() => this.buybackListService.items());
  isFamilyMember = computed(() => this.datastore.isFamilyMember());

  offer = computed(() =>
    this.offerService.calculateOffer(this.items(), this.isFamilyMember())
  );

  // Form state
  email = signal<string>('');
  selectedStore = signal<string>('');
  termsAccepted = signal<boolean>(false);

  // Validation
  isEmailValid = computed(() => this.utility.isValidEmail(this.email()));
  isStoreSelected = computed(() => this.selectedStore().length > 0);
  isFormValid = computed(() =>
    this.isEmailValid() &&
    this.isStoreSelected() &&
    this.termsAccepted()
  );

  // UI state
  isSubmitting = signal<boolean>(false);
  error = signal<string | null>(null);

  translations = computed(() => this.locale.translations().submission);

  constructor(
    private buybackListService: BuybackListService,
    private offerService: OfferCalculationService,
    private submissionService: SubmissionService,
    private datastore: DatastoreService,
    private utility: UtilityService,
    private locale: LocaleService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    // Redirect if no items
    if (this.items().length === 0) {
      this.router.navigate(['/search']);
    }
  }
}
```

**Template**:
```html
<div class="summary-page">
  <h1>{{ translations().title }}</h1>

  <!-- Items Review -->
  <section class="review-section">
    <h2>{{ translations().reviewItems }}</h2>
    <app-submission-review [items]="items()"></app-submission-review>
  </section>

  <!-- Offer Summary -->
  <section class="offer-section">
    <app-offer-summary
      [items]="items()"
      [isFamilyMember]="isFamilyMember()">
    </app-offer-summary>
  </section>

  <!-- User Information Form -->
  <section class="form-section">
    <h2>{{ translations().yourInformation }}</h2>
    <app-user-info-form
      [email]="email()"
      [selectedStore]="selectedStore()"
      [termsAccepted]="termsAccepted()"
      (emailChanged)="email.set($event)"
      (storeChanged)="selectedStore.set($event)"
      (termsChanged)="termsAccepted.set($event)">
    </app-user-info-form>
  </section>

  <!-- Error Message -->
  @if (error()) {
    <div class="error-message">
      <skapa-icon icon="warning-triangle"></skapa-icon>
      <span>{{ error() }}</span>
    </div>
  }

  <!-- Action Buttons -->
  <div class="actions">
    <skapa-button
      variant="secondary"
      (click)="goBack()">
      {{ translations().back }}
    </skapa-button>

    <skapa-button
      variant="primary"
      [disabled]="!isFormValid() || isSubmitting()"
      [loading]="isSubmitting()"
      (click)="onSubmit()">
      {{ isSubmitting() ? translations().submitting : translations().submit }}
    </skapa-button>
  </div>
</div>
```

**Methods**:
```typescript
onSubmit(): void {
  if (!this.isFormValid()) {
    return;
  }

  this.isSubmitting.set(true);
  this.error.set(null);

  const submissionData: SubmissionData = {
    items: this.items(),
    email: this.email(),
    storeId: this.selectedStore(),
    isFamilyMember: this.isFamilyMember(),
    offer: this.offer(),
    submittedAt: new Date()
  };

  this.submissionService.submitBuyback(submissionData)
    .pipe(takeUntil(this.ngUnSubscribe))
    .subscribe({
      next: (response) => {
        // Clear buyback list
        this.buybackListService.clear();

        // Navigate to confirmation with quotation number
        this.router.navigate(['/confirmation'], {
          state: { quotationNumber: response.quotationNumber }
        });
      },
      error: (err) => {
        this.error.set(err.message || 'Submission failed. Please try again.');
        this.isSubmitting.set(false);
      }
    });
}

goBack(): void {
  this.router.navigate(['/buyback-list']);
}
```

### 2. Confirmation Page Component

**Purpose**: Display success message and quotation number.

**Location**: `features/submission/pages/confirmation/`

**State**:
```typescript
export class ConfirmationComponent implements OnInit {
  quotationNumber = signal<string>('');
  selectedStore = signal<Store | null>(null);

  translations = computed(() => this.locale.translations().submission);

  constructor(
    private router: Router,
    private locale: LocaleService,
    private datastore: DatastoreService
  ) {}

  ngOnInit(): void {
    // Get quotation number from navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { quotationNumber: string };

    if (state?.quotationNumber) {
      this.quotationNumber.set(state.quotationNumber);
    } else {
      // No quotation number, redirect to search
      this.router.navigate(['/search']);
    }

    // Load selected store details
    this.loadStoreDetails();
  }

  private loadStoreDetails(): void {
    const storeId = this.datastore.getSelectedStore();
    if (storeId) {
      // Load store details from service
      // this.storeService.getStore(storeId).subscribe(...)
    }
  }
}
```

**Template**:
```html
<div class="confirmation-page">
  <!-- Success Icon -->
  <div class="success-icon">
    <skapa-icon icon="checkmark-circle" size="80" color="#4caf50"></skapa-icon>
  </div>

  <!-- Success Message -->
  <h1>{{ translations().thankYou }}</h1>
  <p class="subtitle">{{ translations().submissionSuccess }}</p>

  <!-- Quotation Number Display -->
  <app-quotation-display
    [quotationNumber]="quotationNumber()">
  </app-quotation-display>

  <!-- Next Steps -->
  <section class="next-steps">
    <h2>{{ translations().nextSteps }}</h2>

    <div class="steps-list">
      <div class="step">
        <span class="step-number">1</span>
        <div class="step-content">
          <h3>{{ translations().step1Title }}</h3>
          <p>{{ translations().step1Description }}</p>
        </div>
      </div>

      <div class="step">
        <span class="step-number">2</span>
        <div class="step-content">
          <h3>{{ translations().step2Title }}</h3>
          <p>{{ translations().step2Description }}</p>
          <p class="quotation-reminder">
            <strong>{{ quotationNumber() }}</strong>
          </p>
        </div>
      </div>

      <div class="step">
        <span class="step-number">3</span>
        <div class="step-content">
          <h3>{{ translations().step3Title }}</h3>
          <p>{{ translations().step3Description }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Store Information -->
  @if (selectedStore(); as store) {
    <section class="store-info">
      <h2>{{ translations().yourStore }}</h2>
      <div class="store-details">
        <h3>{{ store.name }}</h3>
        <p>{{ store.address }}</p>
        <p>{{ store.phone }}</p>
        <p>{{ store.hours }}</p>
      </div>
    </section>
  }

  <!-- Action Buttons -->
  <div class="actions">
    <skapa-button variant="primary" (click)="startNewBuyback()">
      {{ translations().newBuyback }}
    </skapa-button>

    <skapa-button variant="text" (click)="downloadReceipt()">
      {{ translations().downloadReceipt }}
    </skapa-button>
  </div>
</div>
```

**Styles**:
```scss
.confirmation-page {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-xl;
  text-align: center;

  .success-icon {
    margin-bottom: $spacing-lg;
    animation: scaleIn 0.5s ease;
  }

  h1 {
    color: $color-success;
    margin-bottom: $spacing-sm;
  }

  .subtitle {
    color: $color-text-secondary;
    margin-bottom: $spacing-xl;
  }

  .next-steps {
    text-align: left;
    margin: $spacing-xl 0;

    .steps-list {
      .step {
        display: flex;
        gap: $spacing-md;
        margin-bottom: $spacing-lg;

        .step-number {
          @include flex-center;
          width: 40px;
          height: 40px;
          background: $color-primary;
          color: $color-white;
          border-radius: 50%;
          font-weight: $font-weight-bold;
          flex-shrink: 0;
        }

        .step-content {
          flex: 1;

          h3 {
            margin-bottom: $spacing-xs;
          }

          p {
            color: $color-text-secondary;
          }

          .quotation-reminder {
            margin-top: $spacing-sm;
            padding: $spacing-sm;
            background: $color-background-light;
            border-radius: $border-radius;

            strong {
              color: $color-primary;
              font-size: $font-size-lg;
            }
          }
        }
      }
    }
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

## Components

### 1. User Info Form Component

**Props**:
```typescript
@Input() email!: string;
@Input() selectedStore!: string;
@Input() termsAccepted!: boolean;
@Output() emailChanged = new EventEmitter<string>();
@Output() storeChanged = new EventEmitter<string>();
@Output() termsChanged = new EventEmitter<boolean>();
```

**Template**:
```html
<div class="user-info-form">
  <!-- Email Input -->
  <div class="form-field">
    <skapa-input-field
      label="{{ translations().email }}"
      type="email"
      [value]="email"
      (input)="onEmailInput($event)"
      [error]="showEmailError()"
      [error-message]="emailErrorMessage()"
      required>
    </skapa-input-field>
  </div>

  <!-- Store Selection -->
  <div class="form-field">
    <skapa-select
      label="{{ translations().storeLocation }}"
      [value]="selectedStore"
      (change)="onStoreChange($event)"
      required>
      <option value="">{{ translations().selectStore }}</option>
      @for (store of stores(); track store.id) {
        <option [value]="store.id">{{ store.name }}</option>
      }
    </skapa-select>
  </div>

  <!-- Terms Checkbox -->
  <div class="form-field checkbox">
    <label>
      <input
        type="checkbox"
        [checked]="termsAccepted"
        (change)="onTermsChange($event)" />
      <span>{{ translations().terms }}</span>
      <a href="/terms" target="_blank">{{ translations().readTerms }}</a>
    </label>
  </div>
</div>
```

### 2. Submission Review Component

**Props**:
```typescript
@Input() items!: BuybackItem[];
```

**Template**:
```html
<div class="submission-review">
  <div class="items-summary">
    @for (item of items; track item.id) {
      <div class="review-item">
        <img [src]="item.product.imageUrl" [alt]="item.product.name" />
        <div class="item-details">
          <h4>{{ item.product.name }}</h4>
          <p class="code">{{ item.product.code }}</p>
          <span class="condition">{{ getConditionLabel(item.condition) }}</span>
        </div>
        <div class="item-price">
          {{ item.adjustedPrice | currency }}
        </div>
      </div>
    }
  </div>
</div>
```

### 3. Quotation Display Component

**Props**:
```typescript
@Input() quotationNumber!: string;
```

**Template**:
```html
<div class="quotation-display">
  <div class="quotation-label">{{ translations().quotationNumber }}</div>
  <div class="quotation-number">{{ quotationNumber }}</div>
  <skapa-button variant="text" (click)="copyToClipboard()">
    <skapa-icon icon="copy"></skapa-icon>
    {{ translations().copy }}
  </skapa-button>
</div>
```

**Logic**:
```typescript
export class QuotationDisplayComponent {
  @Input() quotationNumber!: string;

  translations = computed(() => this.locale.translations().submission);

  constructor(private locale: LocaleService) {}

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.quotationNumber);
    // Show toast notification
  }
}
```

## Services

### SubmissionService

**Location**: `features/submission/services/submission.service.ts`

**Implementation**:
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIService } from '../../../core/services/api.service';

export interface SubmissionData {
  items: BuybackItem[];
  email: string;
  storeId: string;
  isFamilyMember: boolean;
  offer: OfferCalculation;
  submittedAt: Date;
}

export interface SubmissionResponse {
  quotationNumber: string;
  submittedAt: string;
  estimatedProcessingDays: number;
}

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  constructor(
    private http: HttpClient,
    private api: APIService
  ) {}

  submitBuyback(data: SubmissionData): Observable<SubmissionResponse> {
    return this.http.post<SubmissionResponse>(
      this.api.submissions,
      this.formatSubmissionData(data)
    );
  }

  private formatSubmissionData(data: SubmissionData): any {
    return {
      items: data.items.map(item => ({
        productId: item.product.id,
        productCode: item.product.code,
        condition: item.condition,
        basePrice: item.basePrice,
        adjustedPrice: item.adjustedPrice
      })),
      customerEmail: data.email,
      storeId: data.storeId,
      isFamilyMember: data.isFamilyMember,
      subtotal: data.offer.subtotal,
      familyDiscount: data.offer.familyDiscount,
      total: data.offer.total,
      submittedAt: data.submittedAt.toISOString()
    };
  }
}
```

## Models

### Submission Model

**Location**: `features/submission/models/submission.model.ts`

**Implementation**:
```typescript
import { Injectable } from '@angular/core';
import { BaseModel } from '../../../shared/base-classes/base.model';
import { UtilityService } from '../../../core/services/utility.service';
import { DatastoreService } from '../../../core/services/datastore.service';

@Injectable({ providedIn: 'root' })
export class SubmissionModel extends BaseModel {
  constructor(
    utility: UtilityService,
    datastore: DatastoreService
  ) {
    super(utility, datastore);
  }

  validateEmail(email: string): boolean {
    return this.utility.isValidEmail(email);
  }

  validateSubmission(data: SubmissionData): ValidationResult {
    const errors: string[] = [];

    if (!this.validateEmail(data.email)) {
      errors.push('Invalid email address');
    }

    if (!data.storeId) {
      errors.push('Store location is required');
    }

    if (!data.items || data.items.length === 0) {
      errors.push('No items in buyback list');
    }

    if (data.offer.total <= 0) {
      errors.push('Invalid offer amount');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

### Quotation Model

**Location**: `features/submission/models/quotation.model.ts`

**Implementation**:
```typescript
import { Injectable } from '@angular/core';
import { BaseModel } from '../../../shared/base-classes/base.model';

@Injectable({ providedIn: 'root' })
export class QuotationModel extends BaseModel {
  generateQuotationNumber(): string {
    return this.utility.generateId('BB');
    // Returns: "BB-1234567890123"
  }

  formatQuotationNumber(quotationNumber: string): string {
    // Format for display: BB-1234-5678-9012
    return quotationNumber.replace(/(.{2})(.{4})(.{4})(.{4})/, '$1-$2-$3-$4');
  }

  validateQuotationNumber(quotationNumber: string): boolean {
    return /^BB-\d{13}$/.test(quotationNumber);
  }
}
```

## Translations

### English

```typescript
submission: {
  title: 'Review & Submit',
  email: 'Email Address',
  emailPlaceholder: 'your.email@example.com',
  storeLocation: 'Preferred Store Location',
  selectStore: 'Select a store',
  reviewItems: 'Review Your Items',
  yourInformation: 'Your Information',
  terms: 'I agree to the terms and conditions',
  readTerms: 'Read terms',
  submit: 'Submit Buyback',
  submitting: 'Submitting...',
  back: 'Back',

  // Confirmation page
  confirmation: 'Confirmation',
  quotationNumber: 'Quotation Number',
  thankYou: 'Thank you for your submission!',
  submissionSuccess: 'Your buyback request has been submitted successfully',
  nextSteps: 'Next Steps',

  step1Title: 'Visit your selected store',
  step1Description: 'Bring your items to the store you selected',

  step2Title: 'Bring this quotation number',
  step2Description: 'Show this number to our staff at the customer service desk',

  step3Title: 'Get your offer',
  step3Description: 'We will verify your items and complete the buyback',

  yourStore: 'Your Selected Store',
  newBuyback: 'Start New Buyback',
  downloadReceipt: 'Download Receipt',
  copy: 'Copy',

  storeContact: 'Store will contact you within 24 hours'
}
```

### Arabic

```typescript
submission: {
  title: 'المراجعة والإرسال',
  email: 'عنوان البريد الإلكتروني',
  emailPlaceholder: 'your.email@example.com',
  storeLocation: 'موقع المتجر المفضل',
  selectStore: 'اختر متجر',
  reviewItems: 'راجع العناصر الخاصة بك',
  yourInformation: 'معلوماتك',
  terms: 'أوافق على الشروط والأحكام',
  readTerms: 'اقرأ الشروط',
  submit: 'إرسال إعادة الشراء',
  submitting: 'جاري الإرسال...',
  back: 'رجوع',

  // Confirmation page
  confirmation: 'تأكيد',
  quotationNumber: 'رقم عرض الأسعار',
  thankYou: 'شكراً لك على إرسالك!',
  submissionSuccess: 'تم إرسال طلب إعادة الشراء بنجاح',
  nextSteps: 'الخطوات التالية',

  step1Title: 'قم بزيارة المتجر المختار',
  step1Description: 'أحضر العناصر الخاصة بك إلى المتجر الذي اخترته',

  step2Title: 'أحضر رقم عرض الأسعار هذا',
  step2Description: 'اعرض هذا الرقم لموظفينا في مكتب خدمة العملاء',

  step3Title: 'احصل على عرضك',
  step3Description: 'سنقوم بالتحقق من العناصر الخاصة بك وإتمام عملية إعادة الشراء',

  yourStore: 'المتجر المختار',
  newBuyback: 'بدء إعادة شراء جديدة',
  downloadReceipt: 'تحميل الإيصال',
  copy: 'نسخ',

  storeContact: 'سيتصل بك المتجر خلال 24 ساعة'
}
```

## Best Practices

### ✅ Do's

1. **Validate before submit** - Check all fields
2. **Show loading state** - Disable button while submitting
3. **Handle errors gracefully** - Display user-friendly messages
4. **Clear list on success** - Remove items after submission
5. **Generate unique quotation numbers** - Use timestamp + random
6. **Persist quotation number** - Save for reference
7. **Provide clear next steps** - Guide users

### ❌ Don'ts

1. **Don't allow empty submissions** - Validate items exist
2. **Don't skip email validation** - Ensure valid format
3. **Don't forget error handling** - Handle API failures
4. **Don't lose quotation number** - Save to localStorage
5. **Don't allow duplicate submissions** - Prevent double-click

---

**Documentation Complete** for all 5 features!

**Next**: [Shared Components](../04-ui-components/shared-components.md)
