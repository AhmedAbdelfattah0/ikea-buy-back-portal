# Confirmation Page

## Overview

The confirmation page is displayed after a successful buyback submission. It provides users with their quotation number and instructions for the next steps to complete the buyback process at an IKEA store.

## Location

- **Component**: `src/app/features/buyback-list/components/confirmation/`
- **Route**: Displayed after submission from the buyback list flow

## Features

### Quotation Information
- Displays unique confirmation/quotation number (format: `#BYB-XXXXXX`)
- Copy-to-clipboard functionality using SKAPA icon button
- Quotation number is auto-generated during submission

### Next Steps Guide
Four numbered steps explaining the buyback process:
1. Email confirmation with estimate
2. Bring assembled furniture to selected IKEA store
3. In-store evaluation by IKEA co-worker
4. Receive store credit as IKEA refund card

### Action Buttons
- **Primary**: "Estimate another product" - Returns to product discovery
- **Secondary**: "Share your feedback" - Opens feedback form (to be implemented)

### Hero Image
- Full-width responsive image showcasing IKEA buyback service
- Uses SKAPA aspect-ratio-box component for consistent proportions
- Source: `https://www.ikea.com/global/assets/buyback/images/content-factory/large-GC-CF-Buyback-FY24-External-02-crop001_1.jpg`

## Layout Structure

### Responsive Grid System

The page uses a sophisticated responsive grid that adapts across breakpoints:

```scss
// Base (Mobile-first): 4 columns
grid-template-columns: repeat(4, minmax(0, 1fr));
grid-column-gap: .75rem;
grid-row-gap: .75rem;

// Tablet (37.5em / 600px+): 6 columns
grid-template-columns: repeat(6, minmax(0, 1fr));
grid-column-gap: 1rem;
grid-row-gap: 1rem;

// Desktop (56.25em / 900px+): 12 columns
grid-template-columns: repeat(12, minmax(0, 1fr));
grid-column-gap: 1.25rem;
grid-row-gap: 1.25rem;
```

### Content Positioning

**Left Content Section** (`.confirmation-content`):
- **Base**: Columns 1-4 (full width)
- **37.5em+**: Columns 2-5 (centered with margins)
- **56.25em+**: Columns 1-4 (left half of 12-column grid)

**Right Image Section** (`.confirmation-image`):
- **Base**: Columns 1-4 with negative margins (full bleed)
- **37.5em+**: Columns 1-6 with negative margins (full bleed)
- **56.25em+**: Columns 6-12 (right half, leaving column 5 as gap)

### HTML Structure

```html
<div class="confirmation-page">
  <div class="confirmation-container">
    <div class="confirmation-content">
      <div class="confirmation-content-inner">
        <!-- Main heading, title, quotation box, steps, buttons -->
      </div>
    </div>
    <div class="confirmation-image">
      <skapa-aspect-ratio-box ratio="square">
        <img src="..." alt="IKEA Buyback" class="hero-image" />
      </skapa-aspect-ratio-box>
    </div>
  </div>
</div>
```

**Key structural elements**:
- `.confirmation-content-inner` uses flexbox for vertical stacking with `align-items: flex-start`
- Image section includes overflow handling and negative margins for full-bleed effect
- Mobile-first approach with image appearing first on small screens (`order: -1`)

## Implementation Details

### Component Class

```typescript
export class ConfirmationComponent extends BaseComponent implements OnInit {
  confirmationNumber = signal<string>('');

  constructor(
    private router: Router,
    private submissionService: SubmissionService,
    private locale: LocaleService
  ) {
    super();
  }

  ngOnInit(): void {
    // Get confirmation number from last submission
    const lastSubmission = this.submissionService.lastSubmission();
    if (lastSubmission) {
      this.confirmationNumber.set(lastSubmission.confirmationNumber);
    }
  }
}
```

### API Integration (Mocked)

Currently uses mocked submission service to avoid API errors:

```typescript
// submission.service.ts
submit(request: SubmissionRequest): Observable<SubmissionResponse> {
  const mockResponse: SubmissionResponse = {
    success: true,
    submissionId: `SUB-${Date.now()}`,
    confirmationNumber: `BYB-${Math.floor(100000 + Math.random() * 900000)}`,
    message: 'Buyback submission successful'
  };

  return of(mockResponse).pipe(
    delay(1000), // Simulate network delay
    tap(response => {
      this._lastSubmission.set(response);
      this._isSubmitting.set(false);
    })
  );
}
```

**TODO**: Replace with real API call when backend is ready.

### SKAPA Components Used

```typescript
// base.component.ts imports
import '@ingka/button-webc';
import '@ingka/icon-webc';
import '@ingka/icon-store/copy';
import '@ingka/aspect-ratio-box-webc';
```

**Components**:
- `<skapa-button>` - Primary and secondary action buttons
- `<skapa-icon-button>` - Copy quotation number button
- `<skapa-icon>` - Copy icon
- `<skapa-aspect-ratio-box>` - Responsive image container

## Styling Approach

### Design System Alignment

The styling matches the IKEA design system used on the official buyback website:

- **Font**: IKEA Noto Sans (via `$font-stack-ikea`)
- **Colors**:
  - Primary text: `#111`
  - Secondary text: `#484848`
  - Background: `#fff`
  - Accent gray: `#f5f5f5`
- **Border radius**: 2px for boxes, 8px for images, 50px for buttons
- **Typography scale**: 14px body, 24px headings

### Responsive Behavior

**Container max-width**: `1800px` (centered with auto margins)

**Padding progression**:
- Desktop: `48px 80px`
- Tablet (≤1024px): `40px 32px`
- Mobile (≤768px): `32px 24px`

**Image negative margins** (full-bleed effect):
- Base: `-1.25rem` left/right
- 37.5em+: `-1.875rem` right, `0.125rem` left
- 56.25em+: `0` (no bleed, sits in grid)
- Mobile: `-0.25rem` left

## RTL Support

Uses logical CSS properties for automatic RTL adaptation:

```scss
.quotation-label {
  margin-inline-end: auto; // margin-right in LTR, margin-left in RTL
}

.quotation-number {
  margin-inline-end: 8px;
}

// RTL-specific overrides
[dir='rtl'] {
  .confirmation-container {
    direction: rtl;
  }

  .step {
    flex-direction: row-reverse;
  }
}
```

## Translations

All text content uses the translation system:

```typescript
// In component
translations = computed(() => this.locale.translations());

// In template
{{ translations().confirmation.title }}
{{ translations().confirmation.quotationLabel }}
{{ translations().confirmation.step1 }}
```

**Translation keys** (in `src/app/shared/constants/translations/`):
```typescript
confirmation: {
  title: 'Great, here\'s what to do next',
  quotationLabel: 'Quotation no.',
  step1: 'You will receive your email shortly with the estimate',
  step2: 'Next bring your fully assembled furniture to IKEA you selected.',
  step3: 'At store, head to Returns & exchanges area...',
  step4: 'You will receive a store credit in the form of an IKEA refund card...',
  estimateAnother: 'Estimate another product',
  shareFeedback: 'Share your feedback'
}
```

## User Actions

### Copy Quotation Number
```typescript
copyQuotationNumber(): void {
  const number = this.confirmationNumber();
  if (number) {
    navigator.clipboard.writeText(number).then(() => {
      // TODO: Show success toast
      console.log('Quotation number copied!');
    });
  }
}
```

### Estimate Another Product
```typescript
estimateAnother(): void {
  // Navigate back to product discovery
  this.router.navigate(['/search']);
}
```

### Share Feedback
```typescript
shareFeedback(): void {
  // TODO: Implement feedback modal/form
  console.log('Share feedback clicked');
}
```

## Reference Design

The implementation is based on the official IKEA buyback estimator tool:
- **Reference URL**: `https://www.ikea.com/us/en/buyback/`
- **Design pattern**: View card with content/image split layout
- **Grid system**: 4/6/12 column responsive grid
- **Component structure**: Matches IKEA's Next.js implementation

## Testing Considerations

### Manual Testing Checklist

- [ ] Quotation number displays correctly
- [ ] Copy button copies full number to clipboard
- [ ] "Estimate another" navigates to search page
- [ ] Image scales properly at all breakpoints
- [ ] Layout switches correctly between mobile/tablet/desktop
- [ ] RTL mode displays properly (Arabic)
- [ ] All translations load for all supported locales
- [ ] Negative margins create proper full-bleed effect on mobile/tablet
- [ ] Grid positioning is correct at each breakpoint

### Responsive Testing Breakpoints

- **Mobile**: < 768px (1 column, stacked layout)
- **Tablet**: 600px - 899px (6 column grid)
- **Desktop**: 900px+ (12 column grid)
- **Large screens**: Test up to 1800px max-width

## Future Enhancements

1. **Real API Integration**: Replace mocked submission with actual backend API
2. **Email Functionality**: Send confirmation email with quotation details
3. **Feedback Modal**: Implement feedback form/modal
4. **Success Toast**: Show toast notification on copy action
5. **Print Option**: Add ability to print confirmation page
6. **Download PDF**: Generate and download quotation as PDF
7. **Analytics**: Track user actions (copy, estimate another, feedback)
8. **Error Handling**: Handle cases where submission data is missing

## Related Documentation

- [Routing and Localization](../02-core-concepts/routing-and-localization.md)
- [Translation System](../02-core-concepts/translation-system.md)
- [SKAPA Packages](../04-ui-components/skapa-packages.md)
- [Base Component](../02-core-concepts/base-component-pattern.md)
- [Buyback List Feature](./buyback-list.md)

## Troubleshooting

### Issue: Confirmation number not showing
**Solution**: Check that `submissionService.lastSubmission()` has data. Ensure navigation to confirmation page happens after successful submission.

### Issue: Image not displaying
**Solution**: Verify SKAPA aspect-ratio-box component is imported in `base.component.ts`. Check browser console for 404 errors on image URL.

### Issue: Layout broken on specific breakpoint
**Solution**: Check media query order in SCSS. Ensure min-width queries are in ascending order. Verify grid-column values match the total columns for that breakpoint.

### Issue: Copy button not working
**Solution**: Ensure browser supports `navigator.clipboard` API. For HTTP (non-HTTPS) testing, clipboard API may not work - test on HTTPS or localhost.

### Issue: RTL layout issues
**Solution**: Verify logical CSS properties are used (`margin-inline-start/end` instead of `left/right`). Check `[dir='rtl']` overrides in SCSS.
