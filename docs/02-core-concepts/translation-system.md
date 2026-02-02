# Translation System

## Overview

The IKEA Buyback Portal uses a **custom translation system** built with TypeScript constants instead of third-party i18n libraries. This approach provides type safety, simplicity, and full control over translations.

## Why Custom Translation System?

### Advantages

1. **Type Safety** - Full TypeScript autocomplete and compile-time checking
2. **No Dependencies** - No external i18n library needed
3. **Simple** - Easy to understand and maintain
4. **Fast** - No runtime parsing or lookups
5. **Predictable** - No hidden behaviors or magic
6. **Tree-Shakable** - Only used translations included in bundle

### Trade-offs

- **No Pluralization** - Must handle manually if needed
- **No Date/Number Formatting** - Use UtilityService instead
- **Manual Organization** - Structure is up to us

For this application, the advantages outweigh the trade-offs.

## File Structure

```
src/app/shared/
├── constants/
│   └── translations/
│       ├── en-sa.constants.ts      # English - Saudi Arabia
│       ├── ar-sa.constants.ts      # Arabic - Saudi Arabia
│       ├── en-bh.constants.ts      # English - Bahrain
│       ├── ar-bh.constants.ts      # Arabic - Bahrain
│       └── index.ts                # Translation loader
└── interfaces/
    └── translation.interface.ts    # Translation structure
```

## Translation Interface

All translation files implement the same interface for type safety.

```typescript
// src/app/shared/interfaces/translation.interface.ts

export interface Translation {
  common: CommonTranslations;
  productDiscovery: ProductDiscoveryTranslations;
  conditionAssessment: ConditionAssessmentTranslations;
  buybackList: BuybackListTranslations;
  offer: OfferTranslations;
  submission: SubmissionTranslations;
  errors: ErrorTranslations;
  validation: ValidationTranslations;
}

export interface CommonTranslations {
  appTitle: string;
  submit: string;
  cancel: string;
  next: string;
  previous: string;
  back: string;
  close: string;
  save: string;
  delete: string;
  edit: string;
  confirm: string;
  loading: string;
  error: string;
  success: string;
}

export interface ProductDiscoveryTranslations {
  searchPlaceholder: string;
  searchButton: string;
  categories: string;
  selectCategory: string;
  noResults: string;
  resultsFound: string;
  productName: string;
  productCode: string;
  selectProduct: string;
}

// ... other interfaces
```

## Translation Files

### English - Saudi Arabia

```typescript
// src/app/shared/constants/translations/en-sa.constants.ts

import { Translation } from '../../interfaces/translation.interface';

export const EN_SA_TRANSLATIONS: Translation = {
  common: {
    appTitle: 'IKEA Buyback Portal',
    submit: 'Submit',
    cancel: 'Cancel',
    next: 'Next',
    previous: 'Previous',
    back: 'Back',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success'
  },
  productDiscovery: {
    searchPlaceholder: 'Search for products...',
    searchButton: 'Search',
    categories: 'Categories',
    selectCategory: 'Select a category',
    noResults: 'No products found',
    resultsFound: 'products found',
    productName: 'Product Name',
    productCode: 'Product Code',
    selectProduct: 'Select Product'
  },
  conditionAssessment: {
    selectCondition: 'Select product condition',
    likeNew: 'Like New',
    likeNewDesc: 'Minimal signs of use, excellent condition',
    veryGood: 'Very Good',
    veryGoodDesc: 'Some signs of use, good condition',
    wellUsed: 'Well Used',
    wellUsedDesc: 'Clear signs of use, functional condition',
    conditionRequired: 'Please select a condition'
  },
  buybackList: {
    title: 'Your Buyback List',
    empty: 'No items in your list yet',
    itemCount: 'items',
    removeItem: 'Remove',
    changeCondition: 'Change Condition',
    continueToSummary: 'Continue to Summary',
    totalEstimate: 'Estimated Total'
  },
  offer: {
    title: 'Your Offer',
    totalOffer: 'Total Offer',
    familyMember: 'IKEA Family Member Price',
    nonFamilyMember: 'Regular Price',
    isFamilyMember: 'Are you an IKEA Family member?',
    yes: 'Yes',
    no: 'No',
    currency: 'SAR',
    priceBreakdown: 'Price Breakdown'
  },
  submission: {
    title: 'Review & Submit',
    email: 'Email Address',
    emailPlaceholder: 'your.email@example.com',
    storeLocation: 'Preferred Store Location',
    selectStore: 'Select a store',
    reviewItems: 'Review Your Items',
    terms: 'I agree to the terms and conditions',
    submit: 'Submit Buyback',
    confirmation: 'Confirmation',
    quotationNumber: 'Quotation Number',
    thankYou: 'Thank you for your submission!',
    nextSteps: 'Next Steps',
    visitStore: 'Visit your selected store with your items',
    bringQuotation: 'Bring this quotation number',
    storeContact: 'Store will contact you within 24 hours'
  },
  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    notFound: 'Resource not found.',
    serverError: 'Server error. Please try again later.',
    invalidInput: 'Invalid input. Please check your data.',
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email address',
    storeRequired: 'Please select a store location'
  },
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email',
    minLength: 'Minimum length is',
    maxLength: 'Maximum length is',
    pattern: 'Invalid format'
  }
};
```

### Arabic - Saudi Arabia

```typescript
// src/app/shared/constants/translations/ar-sa.constants.ts

import { Translation } from '../../interfaces/translation.interface';

export const AR_SA_TRANSLATIONS: Translation = {
  common: {
    appTitle: 'بوابة إعادة الشراء من ايكيا',
    submit: 'إرسال',
    cancel: 'إلغاء',
    next: 'التالي',
    previous: 'السابق',
    back: 'رجوع',
    close: 'إغلاق',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    confirm: 'تأكيد',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح'
  },
  productDiscovery: {
    searchPlaceholder: 'البحث عن المنتجات...',
    searchButton: 'بحث',
    categories: 'الفئات',
    selectCategory: 'اختر فئة',
    noResults: 'لم يتم العثور على منتجات',
    resultsFound: 'منتج موجود',
    productName: 'اسم المنتج',
    productCode: 'رمز المنتج',
    selectProduct: 'اختر المنتج'
  },
  conditionAssessment: {
    selectCondition: 'اختر حالة المنتج',
    likeNew: 'كالجديد',
    likeNewDesc: 'علامات استخدام قليلة جداً، حالة ممتازة',
    veryGood: 'جيد جداً',
    veryGoodDesc: 'بعض علامات الاستخدام، حالة جيدة',
    wellUsed: 'مستخدم بشكل جيد',
    wellUsedDesc: 'علامات استخدام واضحة، حالة وظيفية',
    conditionRequired: 'الرجاء اختيار الحالة'
  },
  buybackList: {
    title: 'قائمة إعادة الشراء الخاصة بك',
    empty: 'لا توجد عناصر في قائمتك بعد',
    itemCount: 'عناصر',
    removeItem: 'إزالة',
    changeCondition: 'تغيير الحالة',
    continueToSummary: 'المتابعة إلى الملخص',
    totalEstimate: 'إجمالي التقدير'
  },
  offer: {
    title: 'عرضك',
    totalOffer: 'إجمالي العرض',
    familyMember: 'سعر عضو ايكيا فاميلي',
    nonFamilyMember: 'السعر العادي',
    isFamilyMember: 'هل أنت عضو في ايكيا فاميلي؟',
    yes: 'نعم',
    no: 'لا',
    currency: 'ر.س',
    priceBreakdown: 'تفاصيل السعر'
  },
  submission: {
    title: 'المراجعة والإرسال',
    email: 'عنوان البريد الإلكتروني',
    emailPlaceholder: 'your.email@example.com',
    storeLocation: 'موقع المتجر المفضل',
    selectStore: 'اختر متجر',
    reviewItems: 'راجع العناصر الخاصة بك',
    terms: 'أوافق على الشروط والأحكام',
    submit: 'إرسال إعادة الشراء',
    confirmation: 'تأكيد',
    quotationNumber: 'رقم عرض الأسعار',
    thankYou: 'شكراً لك على إرسالك!',
    nextSteps: 'الخطوات التالية',
    visitStore: 'قم بزيارة المتجر المختار مع العناصر الخاصة بك',
    bringQuotation: 'أحضر رقم عرض الأسعار هذا',
    storeContact: 'سيتصل بك المتجر خلال 24 ساعة'
  },
  errors: {
    generic: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    network: 'خطأ في الشبكة. يرجى التحقق من الاتصال.',
    notFound: 'لم يتم العثور على المورد.',
    serverError: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
    invalidInput: 'إدخال غير صالح. يرجى التحقق من بياناتك.',
    emailRequired: 'البريد الإلكتروني مطلوب',
    emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صالح',
    storeRequired: 'يرجى اختيار موقع المتجر'
  },
  validation: {
    required: 'هذا الحقل مطلوب',
    email: 'يرجى إدخال بريد إلكتروني صالح',
    minLength: 'الحد الأدنى للطول هو',
    maxLength: 'الحد الأقصى للطول هو',
    pattern: 'صيغة غير صالحة'
  }
};
```

### Bahrain Variants

For Bahrain, the translations are similar but with market-specific differences:

```typescript
// src/app/shared/constants/translations/en-bh.constants.ts
export const EN_BH_TRANSLATIONS: Translation = {
  // ... same as EN_SA but with:
  offer: {
    // ...
    currency: 'BHD'  // Different currency
  }
};

// src/app/shared/constants/translations/ar-bh.constants.ts
export const AR_BH_TRANSLATIONS: Translation = {
  // ... same as AR_SA but with:
  offer: {
    // ...
    currency: 'د.ب'  // Different currency
  }
};
```

## Translation Loader

```typescript
// src/app/shared/constants/translations/index.ts

import { Translation } from '../../interfaces/translation.interface';
import { EN_SA_TRANSLATIONS } from './en-sa.constants';
import { AR_SA_TRANSLATIONS } from './ar-sa.constants';
import { EN_BH_TRANSLATIONS } from './en-bh.constants';
import { AR_BH_TRANSLATIONS } from './ar-bh.constants';

const TRANSLATION_MAP: Record<string, Translation> = {
  'en-sa': EN_SA_TRANSLATIONS,
  'ar-sa': AR_SA_TRANSLATIONS,
  'en-bh': EN_BH_TRANSLATIONS,
  'ar-bh': AR_BH_TRANSLATIONS
};

export function getTranslations(market: string, language: string): Translation {
  const key = `${language}-${market}`;
  return TRANSLATION_MAP[key] || EN_SA_TRANSLATIONS;
}
```

## Using Translations in Components

### Method 1: Via LocaleService (Recommended)

```typescript
import { Component, computed } from '@angular/core';
import { LocaleService } from '../../../../core/services/locale.service';

@Component({
  selector: 'app-search',
  // ...
})
export class SearchComponent {
  // Get translations as a computed signal
  translations = computed(() => this.locale.translations());

  constructor(private locale: LocaleService) {}
}
```

```html
<!-- In template -->
<h1>{{ translations().common.appTitle }}</h1>
<button>{{ translations().common.submit }}</button>
<input [placeholder]="translations().productDiscovery.searchPlaceholder" />
```

### Method 2: Direct Access

```typescript
import { Component } from '@angular/core';
import { LocaleService } from '../../../../core/services/locale.service';

@Component({
  selector: 'app-buyback-list',
  // ...
})
export class BuybackListComponent {
  constructor(private locale: LocaleService) {}

  getTitle(): string {
    return this.locale.translations().buybackList.title;
  }
}
```

### Method 3: Store as Property

```typescript
export class SummaryComponent {
  t = computed(() => this.locale.translations().submission);

  constructor(private locale: LocaleService) {}
}
```

```html
<h2>{{ t().title }}</h2>
<label>{{ t().email }}</label>
<button>{{ t().submit }}</button>
```

## Adding New Translations

### Step 1: Update Interface

```typescript
// src/app/shared/interfaces/translation.interface.ts

export interface Translation {
  // ... existing
  newFeature: NewFeatureTranslations;  // Add new section
}

export interface NewFeatureTranslations {
  title: string;
  description: string;
  action: string;
}
```

### Step 2: Add to All Translation Files

```typescript
// en-sa.constants.ts
export const EN_SA_TRANSLATIONS: Translation = {
  // ... existing
  newFeature: {
    title: 'New Feature',
    description: 'This is a new feature',
    action: 'Click here'
  }
};

// ar-sa.constants.ts
export const AR_SA_TRANSLATIONS: Translation = {
  // ... existing
  newFeature: {
    title: 'ميزة جديدة',
    description: 'هذه ميزة جديدة',
    action: 'انقر هنا'
  }
};

// en-bh.constants.ts (same as en-sa unless market-specific)
// ar-bh.constants.ts (same as ar-sa unless market-specific)
```

### Step 3: Use in Component

```typescript
export class NewFeatureComponent {
  t = computed(() => this.locale.translations().newFeature);
}
```

```html
<h1>{{ t().title }}</h1>
<p>{{ t().description }}</p>
<button>{{ t().action }}</button>
```

## Translation Naming Conventions

### Structure

```typescript
{
  featureName: {
    elementName: 'Translation text',
    actionName: 'Action text',
    messageName: 'Message text'
  }
}
```

### Naming Rules

1. **camelCase** for all keys
2. **Descriptive** names (not generic like `text1`, `label2`)
3. **Grouped by feature** (productDiscovery, buybackList, etc.)
4. **Consistent patterns** (e.g., always use `Placeholder` suffix for placeholders)

### Examples

```typescript
// ✅ GOOD
productDiscovery: {
  searchPlaceholder: 'Search...',
  searchButton: 'Search',
  noResults: 'No results found'
}

// ❌ BAD
product: {
  text1: 'Search...',
  btn: 'Search',
  msg: 'No results found'
}
```

## Dynamic Translations

For dynamic content like numbers, dates, or names:

```typescript
export class ProductListComponent {
  t = computed(() => this.locale.translations().productDiscovery);
  productCount = signal(15);

  // Compose message
  resultMessage = computed(() =>
    `${this.productCount()} ${this.t().resultsFound}`
  );
}
```

```html
<p>{{ resultMessage() }}</p>
<!-- Renders: "15 products found" -->
```

## Handling Pluralization

Manual approach for plurals:

```typescript
// Add plural variants to translation
productDiscovery: {
  resultsSingular: 'product found',
  resultsPlural: 'products found'
}

// In component
getResultsText(count: number): string {
  const t = this.locale.translations().productDiscovery;
  return count === 1 ? t.resultsSingular : t.resultsPlural;
}
```

Or use UtilityService:

```typescript
// In UtilityService
public pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

// In component
resultsText = computed(() => {
  const count = this.productCount();
  const t = this.t();
  return `${count} ${this.utility.pluralize(count, t.resultsSingular, t.resultsPlural)}`;
});
```

## Testing Translations

### Ensure All Keys Exist

TypeScript will catch missing keys at compile time due to the interface.

### Visual Testing

Navigate to different locales to verify translations:

```
http://localhost:4200/sa/en/search  # English
http://localhost:4200/sa/ar/search  # Arabic
http://localhost:4200/bh/en/search  # Bahrain English
http://localhost:4200/bh/ar/search  # Bahrain Arabic
```

### Translation Checklist

When adding new translations:
- [ ] Added to translation interface
- [ ] Added to en-sa.constants.ts
- [ ] Added to ar-sa.constants.ts
- [ ] Added to en-bh.constants.ts (if different from SA)
- [ ] Added to ar-bh.constants.ts (if different from SA)
- [ ] Tested in all locales
- [ ] Arabic text displays correctly in RTL
- [ ] No TypeScript errors

## Best Practices

### ✅ Do's

1. **Use Type-Safe Access** - Always use computed signals from LocaleService
2. **Group by Feature** - Keep related translations together
3. **Be Descriptive** - Use clear, meaningful key names
4. **Keep It Flat** - Max 2-3 levels of nesting
5. **Use Consistent Patterns** - Follow established naming conventions
6. **Test RTL** - Always verify Arabic translations in RTL mode

### ❌ Don'ts

1. **Don't Hardcode Strings** - Always use translation constants
2. **Don't Use Generic Keys** - Avoid `text1`, `label2`, etc.
3. **Don't Skip Markets** - Update all 4 locale files
4. **Don't Forget Interface** - Always update the interface first
5. **Don't Mix Languages** - Keep each file pure (no English in Arabic file)

## Troubleshooting

### Issue: Missing Translation Key

**Error**: `Property 'xyz' does not exist on type 'ProductDiscoveryTranslations'`

**Solution**: Add the key to the interface and all translation files.

### Issue: Wrong Translation Shown

**Problem**: Showing English in Arabic locale

**Solution**:
1. Check URL has correct format `/sa/ar/route`
2. Verify translation file has the key
3. Check LocaleService is detecting locale correctly
4. Clear browser cache

### Issue: RTL Issues with Text

**Problem**: Arabic text not displaying correctly

**Solution**:
1. Ensure `dir="rtl"` is set on HTML element
2. Check font supports Arabic characters
3. Use logical properties (margin-inline-start instead of margin-left)
4. Test with actual Arabic text, not transliteration

---

**Next**: [Environment Configuration](./environment-configuration.md)
