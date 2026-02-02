# Styling Guide

## Overview

The IKEA Buyback Portal uses **SCSS** for styling with a global design system based on IKEA's design principles and the SKAPA component library.

## Global SCSS Structure

### File Organization

```
src/assets/global/
├── _variables.scss    # Design tokens (colors, spacing, typography)
├── _mixins.scss       # Reusable mixins
├── _common.scss       # Common styles and utilities
└── _rtl.scss          # RTL-specific styles
```

### Import Order

```scss
// src/styles.scss (Global entry point)
@use 'assets/global/variables' as *;
@use 'assets/global/mixins' as *;
@use 'assets/global/common' as *;
@use 'assets/global/rtl' as *;
```

### Component SCSS Imports

```scss
// In component SCSS files
@use '../../../../../assets/global/variables' as *;
@use '../../../../../assets/global/mixins' as *;

.my-component {
  padding: $spacing-md;
  color: $color-text;
  @include responsive(tablet) {
    padding: $spacing-lg;
  }
}
```

## Design Tokens (_variables.scss)

### Colors

```scss
// Brand Colors
$color-primary: #0058a3;      // IKEA Blue
$color-secondary: #ffda1a;    // IKEA Yellow
$color-accent: #111111;       // IKEA Black

// UI Colors
$color-success: #4caf50;
$color-error: #f44336;
$color-warning: #ff9800;
$color-info: #2196f3;

// Text Colors
$color-text: #111111;
$color-text-secondary: #666666;
$color-text-light: #999999;

// Background Colors
$color-background: #ffffff;
$color-background-light: #f5f5f5;
$color-background-dark: #e0e0e0;

// Border Colors
$color-border: #dddddd;
$color-border-light: #eeeeee;

// White & Black
$color-white: #ffffff;
$color-black: #111111;
```

### Spacing

```scss
// Spacing Scale (8px base)
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-base: 12px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-xxl: 48px;
$spacing-xxxl: 64px;
```

### Typography

```scss
// Font Families
$font-stack-latin: 'IKEA Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-stack-arabic: 'IKEA Arabic', 'Noto Sans Arabic', 'Tahoma', sans-serif;

// Font Sizes
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-base: 16px;
$font-size-md: 18px;
$font-size-lg: 20px;
$font-size-xl: 24px;
$font-size-xxl: 32px;
$font-size-xxxl: 40px;

// Font Weights
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Line Heights
$line-height-tight: 1.2;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;
```

### Breakpoints

```scss
// Responsive Breakpoints
$breakpoint-mobile: 320px;
$breakpoint-mobile-lg: 480px;
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;
$breakpoint-desktop-lg: 1280px;
$breakpoint-desktop-xl: 1440px;
```

### Other Variables

```scss
// Border Radius
$border-radius-sm: 2px;
$border-radius: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;
$border-radius-xl: 16px;
$border-radius-circle: 50%;

// Shadows
$shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
$shadow-md: 0 2px 8px rgba(0, 0, 0, 0.15);
$shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.2);
$shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.25);

// Transitions
$transition-fast: 0.15s ease;
$transition-normal: 0.3s ease;
$transition-slow: 0.5s ease;

// Z-Index Scale
$z-index-dropdown: 100;
$z-index-sticky: 200;
$z-index-fixed: 300;
$z-index-modal-backdrop: 1000;
$z-index-modal: 1100;
$z-index-popover: 1200;
$z-index-tooltip: 1300;
$z-index-toast: 2000;
```

## Mixins (_mixins.scss)

### Responsive Mixins

```scss
// Responsive breakpoint mixin
@mixin responsive($breakpoint) {
  @if $breakpoint == mobile {
    @media (min-width: $breakpoint-mobile) {
      @content;
    }
  } @else if $breakpoint == tablet {
    @media (min-width: $breakpoint-tablet) {
      @content;
    }
  } @else if $breakpoint == desktop {
    @media (min-width: $breakpoint-desktop) {
      @content;
    }
  } @else if $breakpoint == desktop-lg {
    @media (min-width: $breakpoint-desktop-lg) {
      @content;
    }
  }
}

// Usage
.container {
  padding: $spacing-md;

  @include responsive(tablet) {
    padding: $spacing-lg;
  }

  @include responsive(desktop) {
    padding: $spacing-xl;
  }
}
```

### Flexbox Mixins

```scss
// Flex center
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Flex between
@mixin flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// Flex column
@mixin flex-column {
  display: flex;
  flex-direction: column;
}

// Usage
.header {
  @include flex-between;
  padding: $spacing-md;
}

.modal {
  @include flex-center;
  min-height: 100vh;
}
```

### Typography Mixins

```scss
// Heading styles
@mixin heading-1 {
  font-size: $font-size-xxxl;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
  margin-bottom: $spacing-md;
}

@mixin heading-2 {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
  margin-bottom: $spacing-md;
}

@mixin heading-3 {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  line-height: $line-height-normal;
  margin-bottom: $spacing-sm;
}

// Body text
@mixin body-text {
  font-size: $font-size-base;
  line-height: $line-height-normal;
  color: $color-text;
}

// Small text
@mixin small-text {
  font-size: $font-size-sm;
  line-height: $line-height-normal;
  color: $color-text-secondary;
}

// Usage
h1 {
  @include heading-1;
}

.description {
  @include body-text;
}
```

### RTL Support Mixins

```scss
// Margin start (left in LTR, right in RTL)
@mixin margin-start($value) {
  margin-inline-start: $value;
}

// Margin end (right in LTR, left in RTL)
@mixin margin-end($value) {
  margin-inline-end: $value;
}

// Padding start
@mixin padding-start($value) {
  padding-inline-start: $value;
}

// Padding end
@mixin padding-end($value) {
  padding-inline-end: $value;
}

// Usage
.card {
  @include margin-start($spacing-md);
  @include padding-end($spacing-lg);
}

// Generates:
// LTR: margin-left: 16px; padding-right: 24px;
// RTL: margin-right: 16px; padding-left: 24px;
```

### Other Useful Mixins

```scss
// Truncate text
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Visually hidden (accessible but invisible)
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

// Box shadow
@mixin box-shadow($level: 'md') {
  @if $level == 'sm' {
    box-shadow: $shadow-sm;
  } @else if $level == 'md' {
    box-shadow: $shadow-md;
  } @else if $level == 'lg' {
    box-shadow: $shadow-lg;
  } @else if $level == 'xl' {
    box-shadow: $shadow-xl;
  }
}
```

## Common Styles (_common.scss)

### Reset & Normalize

```scss
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
}

body {
  font-family: $font-stack-latin;
  color: $color-text;
  background: $color-background;
  line-height: $line-height-normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Headings

```scss
h1 {
  @include heading-1;
}

h2 {
  @include heading-2;
}

h3 {
  @include heading-3;
}

h4 {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-sm;
}

h5 {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-sm;
}

h6 {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-sm;
}
```

### Utility Classes

```scss
// Display
.d-none {
  display: none;
}

.d-block {
  display: block;
}

.d-flex {
  display: flex;
}

.d-grid {
  display: grid;
}

// Flex utilities
.flex-center {
  @include flex-center;
}

.flex-between {
  @include flex-between;
}

.flex-column {
  @include flex-column;
}

// Text alignment
.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

// Spacing utilities
.m-0 {
  margin: 0;
}

.m-1 {
  margin: $spacing-sm;
}

.m-2 {
  margin: $spacing-md;
}

.m-3 {
  margin: $spacing-lg;
}

.p-0 {
  padding: 0;
}

.p-1 {
  padding: $spacing-sm;
}

.p-2 {
  padding: $spacing-md;
}

.p-3 {
  padding: $spacing-lg;
}

// Margin top
.mt-1 {
  margin-top: $spacing-sm;
}

.mt-2 {
  margin-top: $spacing-md;
}

.mt-3 {
  margin-top: $spacing-lg;
}

// Margin bottom
.mb-1 {
  margin-bottom: $spacing-sm;
}

.mb-2 {
  margin-bottom: $spacing-md;
}

.mb-3 {
  margin-bottom: $spacing-lg;
}
```

## RTL Styles (_rtl.scss)

### RTL-Specific Overrides

```scss
[dir='rtl'] {
  // Font family for Arabic
  body {
    font-family: $font-stack-arabic;
  }

  // Flip icons
  .icon-arrow-right {
    transform: scaleX(-1);
  }

  .icon-arrow-left {
    transform: scaleX(-1);
  }

  // Flip shadows
  .card {
    box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.1);
  }

  // Text alignment
  .text-left {
    text-align: right;
  }

  .text-right {
    text-align: left;
  }
}
```

## Component Styling Best Practices

### Component Structure

```scss
// product-card.component.scss
@use '../../../../../assets/global/variables' as *;
@use '../../../../../assets/global/mixins' as *;

.product-card {
  // Container
  padding: $spacing-md;
  border: 1px solid $color-border;
  border-radius: $border-radius;
  @include box-shadow('sm');
  transition: transform $transition-fast;

  // Hover state
  &:hover {
    transform: translateY(-2px);
    @include box-shadow('md');
  }

  // Child elements
  .product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: $border-radius;
    margin-bottom: $spacing-md;
  }

  .product-title {
    @include heading-3;
    @include truncate;
  }

  .product-price {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-primary;
    margin-top: $spacing-sm;
  }

  // Responsive
  @include responsive(tablet) {
    padding: $spacing-lg;

    .product-image {
      height: 250px;
    }
  }

  // State modifiers
  &.is-selected {
    border-color: $color-primary;
    background: rgba($color-primary, 0.05);
  }

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
```

### BEM Naming Convention

```scss
// Block
.buyback-list {
  padding: $spacing-lg;

  // Element
  &__header {
    @include flex-between;
    margin-bottom: $spacing-md;
  }

  &__title {
    @include heading-2;
  }

  &__items {
    display: grid;
    gap: $spacing-md;
  }

  &__item {
    padding: $spacing-md;
    border: 1px solid $color-border;
    border-radius: $border-radius;

    // Modifier
    &--selected {
      border-color: $color-primary;
      background: rgba($color-primary, 0.05);
    }

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
```

### Naming Conventions

```scss
// ✅ GOOD - Descriptive class names
.product-card { }
.buyback-list__item { }
.button--primary { }
.modal-backdrop { }

// ❌ BAD - Generic names
.card { }
.item { }
.btn { }
.backdrop { }
```

## SKAPA Component Styling

### Styling SKAPA Components

```scss
// You can style SKAPA components using CSS custom properties
skapa-button {
  --button-background: #{$color-primary};
  --button-text-color: #{$color-white};
  --button-border-radius: #{$border-radius};
}

skapa-input-field {
  --input-border-color: #{$color-border};
  --input-focus-border-color: #{$color-primary};
  --input-background: #{$color-white};
}
```

## Animations

### Predefined Animations

```scss
// Fade in
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// Slide in up
@keyframes slideInUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// Usage
.modal {
  animation: fadeIn 0.3s ease;
}

.toast {
  animation: slideInUp 0.3s ease;
}
```

## Best Practices

### ✅ Do's

1. **Use design tokens** - Always use variables, not hard-coded values
2. **Follow BEM** - Block, Element, Modifier naming
3. **Use mixins** - Reusable patterns
4. **Support RTL** - Use logical properties (margin-inline-start)
5. **Be responsive** - Use breakpoint mixins
6. **Organize logically** - Group related styles
7. **Use SCSS features** - Nesting, variables, mixins

### ❌ Don'ts

1. **Don't hardcode colors** - Use $color-* variables
2. **Don't hardcode spacing** - Use $spacing-* variables
3. **Don't use left/right** - Use margin-inline-start/end for RTL
4. **Don't over-nest** - Max 3-4 levels deep
5. **Don't create global classes** - Scope to components
6. **Don't skip responsive** - Always test mobile/tablet/desktop
7. **Don't override SKAPA core styles** - Use CSS custom properties

---

**Documentation 90% complete!** Only development guide files remaining.

**Next**: Development Guide Documentation
