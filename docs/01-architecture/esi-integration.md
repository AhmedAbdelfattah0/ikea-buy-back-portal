# ESI Integration

## Overview

The IKEA Buyback Portal uses **ESI (Edge Side Includes)** to integrate IKEA's global header and footer. This approach allows the application to use the official IKEA navigation and branding without implementing custom header/footer components.

## What is ESI?

**Edge Side Includes (ESI)** is a markup language for edge-level dynamic web content assembly. It allows web servers to compose page fragments at the edge (CDN/reverse proxy level) before sending the final page to the browser.

### Benefits

- **Consistent Branding** - Same header/footer across all IKEA web properties
- **Centralized Updates** - Header/footer updates managed by IKEA platform team
- **Performance** - CDN-level assembly and caching
- **No Maintenance** - No need to maintain custom header/footer code

## ESI Implementation

### Index Files per Market/Language

The project has separate `index.html` files for each market/language combination:

```
src/
├── index.html         # Development (default)
├── index.sa.html      # Saudi Arabia - English
├── index.sa.ar.html   # Saudi Arabia - Arabic
├── index.bh.html      # Bahrain - English
└── index.bh.ar.html   # Bahrain - Arabic
```

### ESI Include Tags

Each index file contains ESI include tags that reference IKEA's header/footer fragments:

```html
<!-- Saudi Arabia - English (index.sa.html) -->
<!doctype html>
<html lang="en">
<head>
  <!-- ESI CSS fragment -->
  <esi:include
    src="https://www.ikea.com/sa/en/header-footer/style-fragment-recursive.html?request-path=$(REQUEST_PATH)">
  </esi:include>
</head>
<body>
  <!-- ESI Header -->
  <esi:include
    src="https://www.ikea.com/sa/en/header-footer/header-fragment-recursive.html?page-type=CART">
  </esi:include>

  <app-root></app-root>
  <div id="root"></div>

  <!-- ESI Footer and Scripts -->
  <esi:include
    src="https://www.ikea.com/sa/en/header-footer/footer-fragment-recursive.html?request-path=$(REQUEST_PATH)">
  </esi:include>
  <esi:include
    src="https://www.ikea.com/sa/en/header-footer/script-fragment-recursive.html?request-path=$(REQUEST_PATH)">
  </esi:include>
</body>
</html>
```

### ESI Fragment Types

**1. Style Fragment** (`style-fragment-recursive.html`)
- Injects CSS for IKEA header/footer
- Loads IKEA fonts
- Applied in `<head>` section

**2. Header Fragment** (`header-fragment-recursive.html`)
- IKEA navigation menu
- Search bar
- Cart icon
- User account menu
- **Parameter**: `page-type=CART` indicates the page context

**3. Footer Fragment** (`footer-fragment-recursive.html`)
- IKEA footer links
- Newsletter signup
- Social media links
- Legal information

**4. Script Fragment** (`script-fragment-recursive.html`)
- JavaScript for header/footer functionality
- Analytics tracking
- Cookie consent management

## Build Configuration

### angular.json Configuration

Each build configuration specifies which index file to use:

```json
{
  "configurations": {
    "sa-prod": {
      "optimization": true,
      "outputHashing": "all",
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.sa-prod.ts"
        }
      ],
      "index": {
        "input": "src/index.sa.html",
        "output": "index.html"
      }
    },
    "sa-prod-ar": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.sa-prod.ts"
        }
      ],
      "index": {
        "input": "src/index.sa.ar.html",
        "output": "index.html"
      }
    }
  }
}
```

### Build Commands

```bash
# Saudi Arabia - English
ng build --configuration=sa-prod

# Saudi Arabia - Arabic
ng build --configuration=sa-prod-ar

# Bahrain - English
ng build --configuration=bh-prod

# Bahrain - Arabic
ng build --configuration=bh-prod-ar

# QA Environments
ng build --configuration=sa-qa
ng build --configuration=sa-qa-ar
ng build --configuration=bh-qa
ng build --configuration=bh-qa-ar
```

## Market-Specific ESI URLs

### Saudi Arabia

**English** (`/sa/en/`):
- Style: `https://www.ikea.com/sa/en/header-footer/style-fragment-recursive.html`
- Header: `https://www.ikea.com/sa/en/header-footer/header-fragment-recursive.html`
- Footer: `https://www.ikea.com/sa/en/header-footer/footer-fragment-recursive.html`
- Script: `https://www.ikea.com/sa/en/header-footer/script-fragment-recursive.html`

**Arabic** (`/sa/ar/`):
- Style: `https://www.ikea.com/sa/ar/header-footer/style-fragment-recursive.html`
- Header: `https://www.ikea.com/sa/ar/header-footer/header-fragment-recursive.html`
- Footer: `https://www.ikea.com/sa/ar/header-footer/footer-fragment-recursive.html`
- Script: `https://www.ikea.com/sa/ar/header-footer/script-fragment-recursive.html`

### Bahrain

**English** (`/bh/en/`):
- Style: `https://www.ikea.com/bh/en/header-footer/style-fragment-recursive.html`
- Header: `https://www.ikea.com/bh/en/header-footer/header-fragment-recursive.html`
- Footer: `https://www.ikea.com/bh/en/header-footer/footer-fragment-recursive.html`
- Script: `https://www.ikea.com/bh/en/header-footer/script-fragment-recursive.html`

**Arabic** (`/bh/ar/`):
- Style: `https://www.ikea.com/bh/ar/header-footer/style-fragment-recursive.html`
- Header: `https://www.ikea.com/bh/ar/header-fragment-recursive.html`
- Footer: `https://www.ikea.com/bh/ar/header-footer/footer-fragment-recursive.html`
- Script: `https://www.ikea.com/bh/ar/header-footer/script-fragment-recursive.html`

## ESI Variables

### $(REQUEST_PATH)

This variable is replaced by the ESI processor with the current request path:

```html
<esi:include
  src="https://www.ikea.com/sa/en/header-footer/footer-fragment-recursive.html?request-path=$(REQUEST_PATH)">
</esi:include>
```

**Purpose**: Allows the header/footer to highlight the active section based on current URL.

### page-type Parameter

```html
<esi:include
  src="https://www.ikea.com/sa/en/header-footer/header-fragment-recursive.html?page-type=CART">
</esi:include>
```

**Purpose**: Informs the header about the page context. Using `CART` indicates a shopping/transaction flow.

## Cookie Integration

### Cookie Helper Script

Each index file includes a cookie helper function:

```javascript
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return JSON.parse(c.split('=')[1].replaceAll("'", ""))
    }
  }
  return "";
}

var ikea_cookieconsent_bh = getCookie('ikea_cookieconsent_bh');
var ikea_cookieconsent_sa = getCookie('ikea_cookieconsent_sa');
```

**Purpose**:
- Reads IKEA cookie consent preferences
- Used by analytics and tracking scripts
- Ensures compliance with privacy regulations

### Market Detection

```javascript
var isSaudi = window.location.href.includes('/sa/')
```

**Purpose**: Global variable to detect which market the user is browsing.

## Development vs Production

### Development Mode

During development (`npm start`), ESI tags are NOT processed:

- ESI includes remain as raw `<esi:include>` tags
- Header/footer won't display
- Application works independently for development

**Development URL**: `http://localhost:4200/sa/en/search`

### Production Mode

In production, the CDN/reverse proxy processes ESI tags:

- `<esi:include>` tags are replaced with actual content
- Header/footer injected from IKEA.com
- Complete page assembled before reaching browser

**Production URL**: `https://buyback.ikea.sa/sa/en/search`

## Adding New Market Support

To add support for a new market (e.g., Kuwait):

### 1. Create Index Files

```bash
# Create Kuwait index files
touch src/index.kw.html
touch src/index.kw.ar.html
```

### 2. Update Index Files

```html
<!-- index.kw.html -->
<!doctype html>
<html lang="en">
<head>
  <!-- ... -->
  <esi:include
    src="https://www.ikea.com/kw/en/header-footer/style-fragment-recursive.html?request-path=$(REQUEST_PATH)">
  </esi:include>
</head>
<body>
  <esi:include
    src="https://www.ikea.com/kw/en/header-footer/header-fragment-recursive.html?page-type=CART">
  </esi:include>

  <app-root></app-root>
  <div id="root"></div>

  <esi:include
    src="https://www.ikea.com/kw/en/header-footer/footer-fragment-recursive.html?request-path=$(REQUEST_PATH)">
  </esi:include>
  <esi:include
    src="https://www.ikea.com/kw/en/header-footer/script-fragment-recursive.html?request-path=$(REQUEST_PATH)">
  </esi:include>
</body>
</html>
```

### 3. Add Build Configurations

```json
// angular.json
"kw-prod": {
  "optimization": true,
  "outputHashing": "all",
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.kw-prod.ts"
    }
  ],
  "index": {
    "input": "src/index.kw.html",
    "output": "index.html"
  }
},
"kw-prod-ar": {
  "optimization": true,
  "outputHashing": "all",
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.kw-prod.ts"
    }
  ],
  "index": {
    "input": "src/index.kw.ar.html",
    "output": "index.html"
  }
}
```

### 4. Create Environment Files

```typescript
// src/environments/environment.kw-prod.ts
export const environment: Environment = {
  production: true,
  market: 'kw',
  apiBaseUrl: 'https://api.ikea.kw',
  supportedLanguages: ['en', 'ar'],
  defaultLanguage: 'en',
  currency: {
    code: 'KWD',
    symbol: 'د.ك'
  }
};
```

### 5. Add Translation Files

```typescript
// src/app/shared/constants/translations/en-kw.constants.ts
export const EN_KW_TRANSLATIONS = {
  // Kuwait-specific English translations
};

// src/app/shared/constants/translations/ar-kw.constants.ts
export const AR_KW_TRANSLATIONS = {
  // Kuwait-specific Arabic translations
};
```

### 6. Update LocaleService

```typescript
// locale.service.ts
const validMarkets: SupportedMarket[] = ['sa', 'bh', 'kw'];  // Add 'kw'
```

## App Component Structure

Since ESI provides header/footer, the app component is minimal:

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {}
```

**No custom layouts needed** - Just render routes directly.

## Content Spacing

Since ESI header/footer are injected, ensure your page components account for the header height:

```scss
// Page component styles
.page-container {
  min-height: calc(100vh - 200px);  // Account for header/footer
  padding: $spacing-lg;
}
```

## Testing ESI Locally

ESI tags won't work in local development. To test:

### Option 1: Mock ESI Processor

Create a simple proxy that processes ESI tags:

```javascript
// esi-proxy.js (not included in project)
const express = require('express');
const fetch = require('node-fetch');

app.use((req, res, next) => {
  // Fetch and process ESI includes
  // Replace <esi:include> tags with actual content
});
```

### Option 2: Test in QA Environment

Deploy to QA environment where ESI processor is available:

```bash
# Build for QA
ng build --configuration=sa-qa

# Deploy to QA server with ESI support
```

## Common Issues

### Issue: Header/Footer not showing locally

**Solution**: This is expected. ESI tags only work on servers with ESI processors (production/QA environments). During local development, focus on your application content.

### Issue: Styles conflict with IKEA header

**Solution**:
- Use scoped styles in components
- Avoid global CSS that might affect header/footer
- Use specific selectors for your components

```scss
// ✅ Good - Scoped to component
.buyback-list {
  padding: $spacing-lg;
}

// ❌ Bad - Global that might affect header
nav {
  padding: 10px;
}
```

### Issue: Wrong market header displays

**Solution**: Ensure correct index file is used for the build configuration.

```json
// Check angular.json
"sa-prod": {
  "index": {
    "input": "src/index.sa.html"  // ✅ Correct for Saudi Arabia
  }
}
```

## Best Practices

### ✅ Do's

1. **Use correct index file** for each market/language
2. **Keep ESI URLs consistent** with IKEA platform standards
3. **Test in QA environment** before production
4. **Account for header/footer space** in your layouts
5. **Verify page-type parameter** is appropriate
6. **Include cookie consent script** for compliance

### ❌ Don'ts

1. **Don't create custom headers/footers** - Use ESI
2. **Don't modify ESI URLs** - Managed by IKEA platform team
3. **Don't expect ESI to work locally** - Requires ESI processor
4. **Don't add global styles** that affect header/footer
5. **Don't cache index.html** - Should be served fresh

## Deployment Checklist

When deploying to a new environment:

- [ ] Verify ESI processor is enabled on CDN/server
- [ ] Check all 4 index files build correctly
- [ ] Test each market/language combination
- [ ] Verify header/footer display correctly
- [ ] Check navigation links work
- [ ] Verify RTL layout for Arabic
- [ ] Test cookie consent functionality
- [ ] Verify analytics tracking
- [ ] Check responsive header/footer
- [ ] Test on mobile devices

---

**Next**: [SKAPA Integration](../04-ui-components/skapa-integration.md)
