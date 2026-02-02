# SKAPA Package Installation

## Overview

SKAPA web components are hosted in IKEA's private npm registry. To install them, you need access to the IKEA npm registry.

## Required Packages

Based on the Online Services Booking project, the following SKAPA packages should be installed:

```json
{
  "@ingka/button-webc": "^0.10.11",
  "@ingka/card-webc": "^0.11.5",
  "@ingka/icon-webc": "^0.10.8",
  "@ingka/icon-store": "^0.9.6",
  "@ingka/input-field-webc": "^0.6.10",
  "@ingka/loading-webc": "^0.3.4",
  "@ingka/modal-webc": "^0.8.11",
  "@ingka/skeleton-webc": "^0.3.4",
  "@ingka/toast-webc": "^0.9.11",
  "@ingka/inline-message-webc": "^0.8.11",
  "@ingka/common-styles-webc": "^0.3.4",
  "@ingka/accordion-webc": "^0.10.1",
  "@ingka/carousel-webc": "^0.9.11",
  "@ingka/combobox-webc": "^0.3.4",
  "@ingka/image-webc": "^0.8.10",
  "@ingka/payment-logo-webc": "^0.3.5",
  "@ingka/pill-webc": "^0.7.3",
  "@ingka/price-module-webc": "^0.2.11",
  "@ingka/price-webc": "^0.5.3",
  "@ingka/product-identifier-webc": "^0.4.4",
  "@ingka/quantity-stepper-webc": "^0.8.11",
  "@ingka/radio-button-webc": "^0.5.1",
  "@ingka/status-webc": "^0.4.4",
  "@ingka/tabs-webc": "^0.11.1"
}
```

## Installation Steps

### 1. Configure npm Registry

You need to configure npm to use IKEA's private registry for `@ingka` packages.

Create or update `.npmrc` in the project root:

```
@ingka:registry=https://[IKEA_NPM_REGISTRY_URL]
//[IKEA_NPM_REGISTRY_URL]/:_authToken=${NPM_TOKEN}
```

**Note**: Contact IKEA DevOps team for the correct registry URL and authentication method.

### 2. Install Packages

Once registry is configured:

```bash
npm install --save @ingka/button-webc@^0.10.11 \
  @ingka/card-webc@^0.11.5 \
  @ingka/icon-webc@^0.10.8 \
  @ingka/icon-store@^0.9.6 \
  @ingka/input-field-webc@^0.6.10 \
  @ingka/loading-webc@^0.3.4 \
  @ingka/modal-webc@^0.8.11 \
  @ingka/skeleton-webc@^0.3.4 \
  @ingka/toast-webc@^0.9.11 \
  @ingka/inline-message-webc@^0.8.11 \
  @ingka/common-styles-webc@^0.3.4
```

## Current Status

**SKAPA packages are NOT currently installed** because they require access to IKEA's private npm registry.

## Fallback Implementation

The project includes custom implementations of core shared components (Modal, Toaster, ErrorMessage) that provide similar functionality while SKAPA packages are unavailable. These can be replaced with SKAPA components once the packages are installed.

### Custom Components Created

- `src/app/shared/components/modal/` - Modal dialog component
- `src/app/shared/components/toaster/` - Toast notification system
- `src/app/shared/components/error-message/` - Error message display

These components follow IKEA design patterns and can be easily replaced with SKAPA equivalents.

## Usage with SKAPA

Once SKAPA packages are installed, components will need to import `CUSTOM_ELEMENTS_SCHEMA`:

```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-my-component',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Required for SKAPA web components
  template: `
    <skapa-button variant="primary">Click Me</skapa-button>
    <skapa-skeleton variant="card"></skapa-skeleton>
  `
})
export class MyComponent {}
```

## Migration Plan

When SKAPA packages become available:

1. Install SKAPA packages via npm
2. Update BaseComponent to import SKAPA styles
3. Replace custom components with SKAPA equivalents where applicable
4. Update component templates to use SKAPA web components
5. Test all components with SKAPA integration
6. Remove custom fallback components (or keep as backups)

## Contact

For SKAPA package access and documentation:
- IKEA Design System Team
- Internal IKEA Developer Portal
- DevOps Team for npm registry access
