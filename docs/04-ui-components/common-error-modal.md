# Common Error Modal Component

## Overview

The Common Error Modal component provides a reusable modal dialog for displaying errors, confirmations, and user prompts using SKAPA's `skapa-prompt` web component. It supports various modal types including error messages, confirmation dialogs, and password input forms.

## Location

- **Component**: `src/app/shared/components/common-error-modal/`
- **Service**: `common-error-modal.service.ts`
- **Model**: `error.model.ts`
- **Template**: `common-error-modal.component.html`
- **Styles**: `common-error-modal.component.scss`

## Features

- **SKAPA Integration**: Uses `skapa-prompt` web component from IKEA's design system
- **Signal-Based State**: Modern Angular signals for reactive state management
- **Multiple Button Configurations**: Primary and secondary buttons with custom actions
- **Password Input Support**: Optional password field with show/hide toggle
- **RTL Support**: Fully supports right-to-left layouts for Arabic
- **Translation Support**: All text is translated based on current locale
- **Confirmation Dialogs**: Two-button confirmation flows
- **Global Availability**: Accessible from anywhere in the app

## Usage

### Basic Error Modal

```typescript
import { CommonErrorModalService } from './shared/components/common-error-modal/common-error-modal.service';
import { errorCase } from './shared/constants/app.constants';

export class MyComponent {
  constructor(private modalService: CommonErrorModalService) {}

  showError() {
    this.modalService.openErrorDialog(errorCase.genericError);
    // Shows generic error message with OK button
  }

  showProductNotFound() {
    this.modalService.openErrorDialog(errorCase.PRODUCT_NOT_FOUND);
    // Shows "Product not found" error with OK button
  }
}
```

### Confirmation Dialog

```typescript
import { CommonErrorModalService } from './shared/components/common-error-modal/common-error-modal.service';
import { errorCase } from './shared/constants/app.constants';
import { takeUntil } from 'rxjs';

export class MyComponent extends BaseComponent {
  constructor(private modalService: CommonErrorModalService) {
    super();

    // Listen for confirmation
    this.modalService.confirmButtonEmitter()
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(result => {
        if (result?.status === 'confirm' && result?.type === 'REMOVE_ITEM_CONFIRMATION') {
          this.removeItem();
        }
      });
  }

  confirmRemove() {
    this.modalService.openErrorDialog(errorCase.REMOVE_ITEM_CONFIRMATION);
    // Shows confirmation dialog with Confirm and Cancel buttons
  }

  removeItem() {
    // Execute removal logic
  }
}
```

### Password Input Modal

```typescript
import { CommonErrorModalService } from './shared/components/common-error-modal/common-error-modal.service';

export class MyComponent extends BaseComponent {
  constructor(private modalService: CommonErrorModalService) {
    super();

    // Listen for password submission
    this.modalService.confirmButtonEmitter()
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(result => {
        if (result?.status === 'confirm' && result?.inputValue) {
          this.validatePassword(result.inputValue);
        }
      });
  }

  showPasswordPrompt() {
    this.modalService.openErrorDialog({
      errType: 'PASSWORD_REQUIRED',
      title: 'CONFIRM',
      disc: 'Please enter your password to continue',
      showInput: true,
      primaryBtn: {
        btnText: 'CONFIRM',
        isVisible: true
      },
      secondaryBtn: {
        btnText: 'CANCEL',
        isVisible: true
      }
    });
  }

  validatePassword(password: string) {
    // Validate password
  }
}
```

## Error Cases

Predefined error cases are available in `src/app/shared/constants/app.constants.ts`:

```typescript
export const errorCase = {
  LOADER: {
    errType: 'LOADER',
    loader: true,
    loaderBG: true
  },

  genericError: {
    errType: 'API_FAILS',
    disc: 'GENERIC_ERROR_MESSAGE',
    primaryBtn: {
      btnText: 'OK',
      isVisible: true
    }
  },

  PRODUCT_NOT_FOUND: {
    errType: 'PRODUCT_NOT_FOUND',
    disc: 'PRODUCT_NOT_FOUND_MESSAGE',
    primaryBtn: {
      btnText: 'OK',
      isVisible: true
    }
  },

  INVALID_CONDITION: {
    errType: 'INVALID_CONDITION',
    disc: 'INVALID_CONDITION_MESSAGE',
    primaryBtn: {
      btnText: 'OK',
      isVisible: true
    }
  },

  REMOVE_ITEM_CONFIRMATION: {
    errType: 'REMOVE_ITEM_CONFIRMATION',
    title: 'CONFIRM_REMOVAL',
    disc: 'REMOVE_ITEM_CONFIRMATION_MESSAGE',
    primaryBtn: {
      btnText: 'CONFIRM',
      isVisible: true
    },
    secondaryBtn: {
      btnText: 'CANCEL',
      isVisible: true
    }
  },

  CLEAR_LIST_CONFIRMATION: {
    errType: 'CLEAR_LIST_CONFIRMATION',
    title: 'CONFIRM_CLEAR',
    disc: 'CLEAR_LIST_CONFIRMATION_MESSAGE',
    primaryBtn: {
      btnText: 'CONFIRM',
      isVisible: true
    },
    secondaryBtn: {
      btnText: 'CANCEL',
      isVisible: true
    }
  },

  QUOTATION_EXPIRED: {
    errType: 'QUOTATION_EXPIRED',
    disc: 'QUOTATION_EXPIRED_MESSAGE',
    primaryBtn: {
      btnText: 'OK',
      isVisible: true
    }
  },

  STORE_NOT_FOUND: {
    errType: 'STORE_NOT_FOUND',
    disc: 'STORE_NOT_FOUND_MESSAGE',
    primaryBtn: {
      btnText: 'OK',
      isVisible: true
    }
  }
};
```

## Service API

### CommonErrorModalService Methods

```typescript
class CommonErrorModalService {
  // Signals
  modalData: Signal<ModalData | null>
  openDialog: Signal<boolean>
  confirmButtonEmitter: Signal<any>

  // Methods
  openErrorDialog(modalData: ModalData): void
  closeErrorDialog(): void
  confirmButtonEvent(modalType: string, inputValue?: any): void
}
```

### ModalData Interface

```typescript
interface ModalData {
  errType: string;              // Error type key for translations
  title?: string;               // Optional title (translation key)
  disc: string;                 // Description (translation key)
  showInput?: boolean;          // Show password input field
  primaryBtn?: {
    btnText: string;            // Button text (translation key)
    isVisible: boolean;         // Whether button is visible
  };
  secondaryBtn?: {
    btnText: string;            // Button text (translation key)
    isVisible: boolean;         // Whether button is visible
  };
}
```

## Component Implementation

The component extends `BaseComponent` and uses signals:

```typescript
export class CommonErrorModalComponent extends BaseComponent implements OnInit {
  translations = computed(() => this.localeService.translations());
  direction = computed(() => this.localeService.isRTL() ? 'rtl' : 'ltr');
  modalData = computed(() => this.modalService.modalData());
  isOpen = computed(() => this.modalService.openDialog());

  inputValue = new FormControl('', [Validators.required]);
  showPassword = false;

  confirmButtonClick(modalType: string): void {
    if (this.inputValue.value && this.inputValue.value !== '') {
      this.model.confirmButtonEventFn(modalType, this.inputValue.value);
    } else {
      this.model.confirmButtonEventFn(modalType);
    }
  }

  closeButtonClick(): void {
    this.model.closeButtonEventFn();
  }
}
```

## Template Structure

The template uses SKAPA's `skapa-prompt` component:

```html
<skapa-prompt
  [open]="isOpen()"
  (closerequest)="closeButtonClick()">

  <skapa-modal-header slot="header">
    <span slot="closebutton-label">{{ translations().modal.CLOSE_DIALOG }}</span>
  </skapa-modal-header>

  <!-- Title -->
  <h2 slot="title" class="title-for-error-case" [dir]="direction()">
    {{ translations().modal[modalData()?.title || modalData()?.errType] }}
  </h2>

  <!-- Description -->
  <div class="max-width">
    {{ translations().modal[modalData()?.disc] }}
  </div>

  <!-- Optional password input -->
  @if(modalData()?.showInput) {
    <div class="password-input-container">
      <skapa-input-field auto-id="password">
        <label slot="label">{{ translations().modal.PASSWORD }}</label>
        <input
          [formControl]="inputValue"
          name="password"
          [type]="showPassword ? 'text' : 'password'"
          required
          minlength="8">
        <skapa-icon-button slot="action" (click)="showPassword = !showPassword">
          <skapa-icon slot="icon"
            [icon]="showPassword ? 'visibility-hide' : 'visibility-show'">
          </skapa-icon>
          <span>{{ translations().modal.REVEAL_PASSWORD }}</span>
        </skapa-icon-button>
      </skapa-input-field>
    </div>
  }

  <!-- Footer with buttons -->
  <skapa-modal-footer
    slot="footer"
    (primary)="confirmButtonClick(modalData()?.errType)"
    (secondary)="closeButtonClick()"
    [primaryLead]="true">

    @if(modalData()?.primaryBtn?.isVisible) {
      {{ translations().modal[modalData()?.primaryBtn?.btnText] }}
    }

    @if(modalData()?.secondaryBtn?.isVisible) {
      <span slot="secondary">
        {{ translations().modal[modalData()?.secondaryBtn?.btnText] }}
      </span>
    }

  </skapa-modal-footer>
</skapa-prompt>
```

## Styling

The component uses minimal custom styling for responsive layouts:

```scss
.title-for-error-case {
  text-align: start;
  font-family: $font-stack-ikea;
  font-weight: 700;
  font-size: 24px;
  line-height: 145%;
  max-width: 490px;

  @include responsive(mobile) {
    width: 279px;
    font-size: 18px;
  }
}

.max-width {
  max-width: 450px;
}

.password-input-container {
  margin-block-start: $spacing-md;
}
```

## Translations

Modal text is defined in translation files under the `modal` namespace:

**English**:
```typescript
modal: {
  CLOSE_DIALOG: 'Close dialog',
  OK: 'OK',
  CONFIRM: 'Confirm',
  CANCEL: 'Cancel',
  PASSWORD: 'Password',
  REVEAL_PASSWORD: 'Reveal password',
  API_FAILS: 'Something went wrong',
  GENERIC_ERROR_MESSAGE: 'An error occurred. Please try again later.',
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_NOT_FOUND_MESSAGE: 'The product you are looking for could not be found.',
  // ... more translations
}
```

**Arabic**:
```typescript
modal: {
  CLOSE_DIALOG: 'إغلاق الحوار',
  OK: 'حسناً',
  CONFIRM: 'تأكيد',
  CANCEL: 'إلغاء',
  PASSWORD: 'كلمة المرور',
  REVEAL_PASSWORD: 'إظهار كلمة المرور',
  API_FAILS: 'حدث خطأ ما',
  GENERIC_ERROR_MESSAGE: 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقاً.',
  // ... more translations
}
```

## Global Availability

The modal is globally available as it's included in `app.component.ts`:

```typescript
@Component({
  selector: 'app-root',
  template: `
    <app-toaster></app-toaster>
    <app-common-error-modal></app-common-error-modal>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
```

## Best Practices

1. **Use predefined cases**: Use predefined error cases when possible
2. **Listen for confirmations**: Always subscribe to `confirmButtonEmitter` when expecting user action
3. **Clean up subscriptions**: Use `takeUntil(this.ngUnSubscribe)` to prevent memory leaks
4. **Clear messages**: Write clear, actionable error messages
5. **Use appropriate buttons**: Show only necessary buttons (one for errors, two for confirmations)
6. **Validate input**: If using password input, always validate on submission

## Error Model Pattern

The component uses an ErrorModel for business logic:

```typescript
@Injectable()
export class ErrorModel extends BaseModel {
  constructor(
    public modalService: CommonErrorModalService,
    utility: UtilityService,
    datastore: DatastoreService
  ) {
    super(utility, datastore);
  }

  closeModalFunc(): void {
    this.modalService.closeErrorDialog();
  }

  confirmButtonEventFn(modalType: string, inputValue?: any): void {
    this.modalService.confirmButtonEvent(modalType, inputValue);
  }

  closeButtonEventFn(): void {
    this.modalService.closeErrorDialog();
  }
}
```

This follows the SOLID principles by keeping business logic separate from UI logic.

## RTL Support

The component automatically detects RTL mode:

```typescript
direction = computed(() => this.localeService.isRTL() ? 'rtl' : 'ltr');
```

The title uses `text-align: start` which automatically adapts for RTL.

## Related Documentation

- [Toaster Component](./toaster-component.md) - For simple, temporary notifications
- [SKAPA Packages](./skapa-packages.md) - SKAPA design system integration
- [Translation System](../02-core-concepts/translation-system.md) - How translations work
- [BaseModel Pattern](../01-architecture/solid-principles.md#single-responsibility) - Model architecture
- [LocaleService](../02-core-concepts/services.md#localeservice) - Locale management
