# Toaster Component

## Overview

The Toaster component provides a user-friendly notification system using SKAPA's `skapa-toast` web component. It displays temporary messages to users for success, error, warning, or informational feedback.

## Location

- **Component**: `src/app/shared/components/toaster/`
- **Service**: `toaster.service.ts`
- **Template**: `toaster.component.html`
- **Styles**: `toaster.component.scss`

## Features

- **SKAPA Integration**: Uses `skapa-toast` web component from IKEA's design system
- **Signal-Based State**: Modern Angular signals for reactive state management
- **Auto-Dismiss**: Automatically dismisses after a timeout (handled by SKAPA component)
- **Manual Dismiss**: Users can manually dismiss notifications
- **RTL Support**: Fully supports right-to-left layouts for Arabic
- **Action Links**: Optional action links (e.g., "View" link to navigate)
- **Translation Support**: All messages are translated based on current locale

## Usage

### Basic Usage

The toaster uses predefined cases from `app.constants.ts`. There are no type-based variants (success/error/warning) since SKAPA's `skapa-toast` is a simple notification component.

```typescript
import { ToasterService } from './shared/components/toaster/toaster.service';
import { toasterCases } from './shared/constants/app.constants';

export class MyComponent {
  constructor(private toaster: ToasterService) {}

  showToaster() {
    // Use predefined case
    this.toaster.openToaster(toasterCases.ITEM_ADDED);
  }
}
```

### Using Predefined Toaster Cases

```typescript
import { toasterCases } from './shared/constants/app.constants';
import { ToasterService } from './shared/components/toaster/toaster.service';

export class MyComponent {
  constructor(private toaster: ToasterService) {}

  addItem() {
    // Use predefined toaster case with link
    this.toaster.openToaster(toasterCases.ITEM_ADDED);
    // Shows: "Item added to buyback list successfully" with "View" link
  }

  removeItem() {
    this.toaster.openToaster(toasterCases.ITEM_REMOVED);
    // Shows: "Item removed successfully"
  }

  updateItem() {
    this.toaster.openToaster(toasterCases.ITEM_UPDATED);
    // Shows: "Item updated successfully"
  }
}
```

### Custom Toaster with Custom Message

```typescript
// Custom message with existing toaster type
this.toaster.openToaster({
  ...toasterCases.ITEM_ADDED,
  Message: 'Your custom message here'
});

// Custom message without action link
this.toaster.openToaster({
  toasterType: 'ITEM_UPDATED_SUCCESS',
  isVisible: true,
  Message: 'Your custom message',
  viewLink: {
    link: '',
    isVisible: false
  }
});
```

## Toaster Cases

Predefined toaster cases are available in `src/app/shared/constants/app.constants.ts`:

```typescript
export const toasterCases = {
  DEFAULT: {
    toasterType: '',
    isVisible: false,
    Message: '',
    viewLink: {
      link: '',
      isVisible: false,
    },
  },

  ITEM_ADDED: {
    toasterType: 'ITEM_ADDED_SUCCESS',
    isVisible: true,
    viewLink: {
      link: '/buyback-list',
      isVisible: true,
    },
  },

  ITEM_REMOVED: {
    toasterType: 'ITEM_REMOVED_SUCCESS',
    isVisible: true,
    viewLink: {
      link: '',
      isVisible: false,
    },
  },

  ITEM_UPDATED: {
    toasterType: 'ITEM_UPDATED_SUCCESS',
    isVisible: true,
    viewLink: {
      link: '',
      isVisible: false,
    },
  },

  QUOTATION_SUBMITTED: {
    toasterType: 'QUOTATION_SUBMITTED_SUCCESS',
    isVisible: true,
    viewLink: {
      link: '',
      isVisible: false,
    },
  },

  ERROR_OCCURRED: {
    toasterType: 'ERROR_OCCURRED',
    isVisible: true,
    viewLink: {
      link: '',
      isVisible: false,
    },
  }
};
```

## Service API

### ToasterService Methods

```typescript
class ToasterService {
  // Signal containing current toaster data
  toasterObject: WritableSignal<ToasterData>

  // Open toaster with custom data
  openToaster(toasterObject: ToasterData): void

  // Close toaster
  closeToaster(): void
}
```

**Note**: Unlike traditional toaster implementations, this service doesn't have `success()`, `error()`, `info()`, or `warning()` methods because SKAPA's `skapa-toast` component doesn't have built-in type variants. Instead, use predefined toaster cases from `app.constants.ts` or pass custom `ToasterData` objects.

### ToasterData Interface

```typescript
interface ToasterData {
  toasterType: string;          // Translation key for message type
  isVisible: boolean;           // Whether toaster is visible
  Message?: string;             // Custom message (overrides toasterType)
  viewLink?: {
    link: string;               // Route to navigate to
    isVisible: boolean;         // Whether to show action link
  };
}
```

## Component Implementation

The component extends `BaseComponent` and uses Angular signals:

```typescript
export class ToasterComponent extends BaseComponent implements OnInit {
  direction = computed(() => this.localeService.isRTL() ? 'rtl' : 'ltr');
  translations = computed(() => this.localeService.translations());
  toasterData = computed(() => this.toasterService.toasterObject());

  afterDismiss(): void {
    this.toasterService.closeToaster();
  }
}
```

## Template Structure

The template uses SKAPA's `skapa-toast` component:

```html
@if(toasterData().isVisible) {
  <skapa-toast
    [dir]="direction()"
    id="buyback-toast"
    [show]="toasterData().isVisible"
    (skapa-toast-dismissed)="afterDismiss()">

    <!-- Message content -->
    @if(toasterData().Message) {
      <span>{{ toasterData().Message }}</span>
    }
    @if(!toasterData().Message && toasterData().toasterType) {
      <span>{{ translations().toaster[toasterData().toasterType] }}</span>
    }

    <!-- Optional action link -->
    @if(toasterData().viewLink?.isVisible) {
      <span slot="action">
        <a [routerLink]="toasterData().viewLink?.link">
          {{ translations().toaster.VIEW }}
        </a>
      </span>
    }
  </skapa-toast>
}
```

## Styling

The component uses minimal custom styling, relying on SKAPA's built-in styles:

```scss
#buyback-toast {
  font-family: $font-stack-ikea;
}
```

## Translations

Toaster messages are defined in translation files:

**English (en-sa.constants.ts, en-bh.constants.ts)**:
```typescript
toaster: {
  SUCCESS: 'Success',
  ERROR: 'Error',
  INFO: 'Information',
  WARNING: 'Warning',
  VIEW: 'View',
  ITEM_ADDED_SUCCESS: 'Item added to buyback list successfully',
  ITEM_REMOVED_SUCCESS: 'Item removed successfully',
  ITEM_UPDATED_SUCCESS: 'Item updated successfully',
  QUOTATION_SUBMITTED_SUCCESS: 'Quotation submitted successfully',
  ERROR_OCCURRED: 'An error occurred. Please try again.'
}
```

**Arabic (ar-sa.constants.ts, ar-bh.constants.ts)**:
```typescript
toaster: {
  SUCCESS: 'نجح',
  ERROR: 'خطأ',
  INFO: 'معلومات',
  WARNING: 'تحذير',
  VIEW: 'عرض',
  ITEM_ADDED_SUCCESS: 'تمت إضافة العنصر إلى قائمة إعادة الشراء بنجاح',
  ITEM_REMOVED_SUCCESS: 'تمت إزالة العنصر بنجاح',
  ITEM_UPDATED_SUCCESS: 'تم تحديث العنصر بنجاح',
  QUOTATION_SUBMITTED_SUCCESS: 'تم إرسال عرض الأسعار بنجاح',
  ERROR_OCCURRED: 'حدث خطأ. يرجى المحاولة مرة أخرى.'
}
```

## Global Availability

The toaster is globally available as it's included in `app.component.ts`:

```typescript
@Component({
  selector: 'app-root',
  template: `
    <app-toaster></app-toaster>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
```

## Best Practices

1. **Use predefined cases**: Always use predefined toaster cases from `app.constants.ts` when possible
2. **Keep messages short**: Toaster messages should be brief and actionable
3. **Add action links when helpful**: If users need to navigate after seeing a message, include a view link
4. **Don't overuse**: Avoid showing too many toasters in quick succession
5. **Custom messages**: If you need a custom message, use the `Message` property to override the translation key
6. **No type variants**: Remember that SKAPA toast doesn't support type-based styling (success/error/warning colors) - it's a simple notification

## RTL Support

The component automatically detects RTL mode based on the current locale:

```typescript
direction = computed(() => this.localeService.isRTL() ? 'rtl' : 'ltr');
```

SKAPA's `skapa-toast` component handles RTL layout internally.

## Related Documentation

- [SKAPA Packages](./skapa-packages.md) - SKAPA design system integration
- [Translation System](../02-core-concepts/translation-system.md) - How translations work
- [LocaleService](../02-core-concepts/services.md#localeservice) - Locale management
- [Common Error Modal](./common-error-modal.md) - For more complex user feedback
