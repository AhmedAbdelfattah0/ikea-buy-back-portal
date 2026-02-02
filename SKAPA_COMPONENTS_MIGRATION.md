# SKAPA Components Migration Summary

**Date**: 2026-01-26
**Status**: ✅ Complete

## Overview

Successfully migrated the toaster and error modal components to use SKAPA web components (`skapa-toast` and `skapa-prompt`) based on the reference implementation from the Webapp-ShoppingBagV2 project.

## Components Updated

### 1. Toaster Component

**Location**: `src/app/shared/components/toaster/`

**Changes**:
- ✅ Replaced custom HTML/CSS implementation with SKAPA's `skapa-toast` web component
- ✅ Updated service to use signal-based state management matching reference pattern
- ✅ Added support for optional action links (e.g., "View" link)
- ✅ Simplified styling to rely on SKAPA's built-in styles
- ✅ Maintained full RTL support
- ✅ Added CUSTOM_ELEMENTS_SCHEMA for SKAPA web components

**Files Modified**:
- `toaster.service.ts` - New interface matching reference pattern
- `toaster.component.ts` - Updated to use SKAPA toast with signals
- `toaster.component.html` - Replaced custom template with `<skapa-toast>`
- `toaster.component.scss` - Simplified to minimal styling

**New Features**:
- `openToaster(toasterObject)` - Open with predefined cases or custom data
- `closeToaster()` - Manually close the toaster
- No type-based variants (SKAPA toast is a simple notification without success/error/warning styles)

### 2. Common Error Modal Component

**Location**: `src/app/shared/components/common-error-modal/`

**Changes**:
- ✅ Created new component using SKAPA's `skapa-prompt` web component
- ✅ Implemented signal-based service for modal state
- ✅ Added error model following SOLID principles
- ✅ Support for single-button and two-button modals
- ✅ Optional password input with show/hide toggle
- ✅ Full translation support
- ✅ RTL layout support
- ✅ Added to app.component.ts for global availability

**Files Created**:
- `common-error-modal.service.ts` - Modal state management service
- `common-error-modal.component.ts` - Component implementation
- `common-error-modal.component.html` - SKAPA prompt template
- `common-error-modal.component.scss` - Responsive styling
- `error.model.ts` - Business logic model

**Features**:
- Error messages with single "OK" button
- Confirmation dialogs with "Confirm" and "Cancel" buttons
- Optional password input field
- Event emitter for confirmation handling
- Translation key support for all text

## Constants & Configuration

### Error Cases

Added to `src/app/shared/constants/app.constants.ts`:

```typescript
export const errorCase = {
  LOADER: {...},
  genericError: {...},
  PRODUCT_NOT_FOUND: {...},
  INVALID_CONDITION: {...},
  REMOVE_ITEM_CONFIRMATION: {...},
  CLEAR_LIST_CONFIRMATION: {...},
  QUOTATION_EXPIRED: {...},
  STORE_NOT_FOUND: {...}
};
```

### Toaster Cases

Added to `src/app/shared/constants/app.constants.ts`:

```typescript
export const toasterCases = {
  DEFAULT: {...},
  ITEM_ADDED: {...},
  ITEM_REMOVED: {...},
  ITEM_UPDATED: {...},
  QUOTATION_SUBMITTED: {...},
  ERROR_OCCURRED: {...}
};
```

## Translation Updates

### New Translation Namespaces

Added to all 4 translation files (en-sa, ar-sa, en-bh, ar-bh):

1. **`toaster` namespace**:
   - SUCCESS, ERROR, INFO, WARNING
   - VIEW (action link text)
   - ITEM_ADDED_SUCCESS, ITEM_REMOVED_SUCCESS, ITEM_UPDATED_SUCCESS
   - QUOTATION_SUBMITTED_SUCCESS
   - ERROR_OCCURRED

2. **`modal` namespace**:
   - CLOSE_DIALOG, OK, CONFIRM, CANCEL
   - PASSWORD, REVEAL_PASSWORD
   - API_FAILS, GENERIC_ERROR_MESSAGE
   - PRODUCT_NOT_FOUND, PRODUCT_NOT_FOUND_MESSAGE
   - INVALID_CONDITION, INVALID_CONDITION_MESSAGE
   - CONFIRM_REMOVAL, REMOVE_ITEM_CONFIRMATION, REMOVE_ITEM_CONFIRMATION_MESSAGE
   - CONFIRM_CLEAR, CLEAR_LIST_CONFIRMATION, CLEAR_LIST_CONFIRMATION_MESSAGE
   - QUOTATION_EXPIRED, QUOTATION_EXPIRED_MESSAGE
   - STORE_NOT_FOUND, STORE_NOT_FOUND_MESSAGE

### Updated Translation Interface

Added to `src/app/shared/interfaces/translation.interface.ts`:

```typescript
export interface Translation {
  // ... existing interfaces
  toaster: ToasterTranslations;
  modal: ModalTranslations;
}

export interface ToasterTranslations { /* ... */ }
export interface ModalTranslations { /* ... */ }
```

## Global Integration

Updated `app.component.ts` to include both components globally:

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterComponent, CommonErrorModalComponent],
  template: `
    <app-toaster></app-toaster>
    <app-common-error-modal></app-common-error-modal>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
```

## Documentation

Created comprehensive documentation:

1. **`docs/04-ui-components/toaster-component.md`**
   - Component overview and features
   - Usage examples (basic and advanced)
   - Service API reference
   - Toaster cases reference
   - Translation keys
   - RTL support details
   - Best practices

2. **`docs/04-ui-components/common-error-modal.md`**
   - Component overview and features
   - Usage examples (errors, confirmations, password input)
   - Service API reference
   - Error cases reference
   - Modal data interface
   - Translation keys
   - Error model pattern
   - Best practices

## Usage Examples

### Toaster

```typescript
// Using predefined cases
this.toasterService.openToaster(toasterCases.ITEM_ADDED);

// Custom message with existing case
this.toasterService.openToaster({
  ...toasterCases.ITEM_ADDED,
  Message: 'Your custom message here'
});

// Fully custom toaster
this.toasterService.openToaster({
  toasterType: 'ITEM_UPDATED_SUCCESS',
  isVisible: true,
  Message: 'Custom message',
  viewLink: {
    link: '/buyback-list',
    isVisible: true
  }
});
```

### Error Modal

```typescript
// Show error
this.modalService.openErrorDialog(errorCase.genericError);

// Show confirmation
this.modalService.openErrorDialog(errorCase.REMOVE_ITEM_CONFIRMATION);

// Listen for confirmation
this.modalService.confirmButtonEmitter()
  .pipe(takeUntil(this.ngUnSubscribe))
  .subscribe(result => {
    if (result?.status === 'confirm') {
      // Handle confirmation
    }
  });
```

## Build Verification

✅ **Build Status**: Successful

```
Initial chunk files | Names                     |  Raw size | Estimated transfer size
main-BIYKZZJE.js    | main                      | 157.05 kB |                34.50 kB
chunk-XPZR6LSP.js   | -                         | 119.08 kB |                35.18 kB
styles-7GURPKIZ.css | styles                    |   8.50 kB |                 1.87 kB

Application bundle generation complete. [1.072 seconds]
```

No TypeScript errors, all components compile successfully.

## Key Benefits

1. **Consistency**: Uses IKEA's official SKAPA design system
2. **Maintainability**: Less custom code to maintain
3. **Accessibility**: SKAPA components have built-in accessibility features
4. **RTL Support**: Automatic RTL handling by SKAPA
5. **Modern Architecture**: Signal-based state management
6. **Type Safety**: Full TypeScript support
7. **Translations**: Complete i18n support for SA and BH markets
8. **Responsive**: Mobile-optimized out of the box

## Migration Notes

### Breaking Changes

The toaster service API is completely new (simplified to match SKAPA's simple toast component):

```typescript
// New API
toasterService.openToaster(toasterCase);
toasterService.closeToaster();
```

**Important Notes**:
- No `success()`, `error()`, `info()`, or `warning()` convenience methods
- SKAPA's `skapa-toast` doesn't have type-based styling (no color variants)
- Use predefined cases from `toasterCases` in `app.constants.ts`
- For custom messages, pass a `ToasterData` object with the `Message` property

If you have existing code using a different toaster API, update it to use the new pattern.

### No Breaking Changes for Error Modal

The error modal is a new component, so there are no breaking changes.

## Testing Recommendations

1. **Toaster Component**:
   - Test all toaster types (success, error, info, warning)
   - Verify action links navigate correctly
   - Test auto-dismiss functionality
   - Verify RTL layout in Arabic

2. **Error Modal**:
   - Test single-button error messages
   - Test two-button confirmation dialogs
   - Test password input with show/hide
   - Verify confirmation event handling
   - Test RTL layout in Arabic
   - Test responsive layout on mobile

3. **Translations**:
   - Verify all translation keys resolve correctly
   - Test all 4 locales (en-sa, ar-sa, en-bh, ar-bh)

## Related Files

### Modified Files
- `src/app/shared/components/toaster/toaster.service.ts`
- `src/app/shared/components/toaster/toaster.component.ts`
- `src/app/shared/components/toaster/toaster.component.html`
- `src/app/shared/components/toaster/toaster.component.scss`
- `src/app/shared/constants/app.constants.ts`
- `src/app/shared/constants/translations/en-sa.constants.ts`
- `src/app/shared/constants/translations/ar-sa.constants.ts`
- `src/app/shared/constants/translations/en-bh.constants.ts`
- `src/app/shared/constants/translations/ar-bh.constants.ts`
- `src/app/shared/interfaces/translation.interface.ts`
- `src/app/app.component.ts`

### New Files
- `src/app/shared/components/common-error-modal/common-error-modal.service.ts`
- `src/app/shared/components/common-error-modal/common-error-modal.component.ts`
- `src/app/shared/components/common-error-modal/common-error-modal.component.html`
- `src/app/shared/components/common-error-modal/common-error-modal.component.scss`
- `src/app/shared/components/common-error-modal/error.model.ts`
- `docs/04-ui-components/toaster-component.md`
- `docs/04-ui-components/common-error-modal.md`

## Next Steps

1. Update any existing code that uses the old toaster API
2. Replace any custom error dialogs with the new common error modal
3. Test components in all 4 locales (en-sa, ar-sa, en-bh, ar-bh)
4. Test on mobile devices for responsive behavior
5. Add unit tests for both components
6. Add E2E tests for critical user flows

## References

- Reference project: `/Users/ahmedabdelfatah/Documents/work-repos/Webapp-ShoppingBagV2`
- SKAPA documentation: https://www.ikea.com/global/en/skapa/
- Project documentation: `docs/04-ui-components/`
