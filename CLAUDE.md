---
description: 
alwaysApply: true
---

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IKEA Buyback Portal - Angular 21.1.0 application for multi-market buyback services supporting Saudi Arabia and Bahrain with English/Arabic localization and RTL support. Uses ESI (Edge Side Includes) for IKEA global header/footer integration.

## Documentation Guidelines (CRITICAL)

**IMPORTANT**: All documentation MUST be created in the `docs/` folder following the established structure. NEVER create documentation files in the project root.

### Documentation Folder Structure

```
docs/
├── README.md                           # Documentation index
├── 01-architecture/                    # System architecture, design patterns
├── 02-core-concepts/                   # Core services, routing, translations
├── 03-features/                        # Feature-specific documentation
├── 04-ui-components/                   # UI components, SKAPA, styling
├── 05-development-guide/               # Development workflows, standards
├── 06-api-integration/                 # API docs (when implemented)
└── 07-deployment/                      # Build configs, deployment guides
```

### Where to Place New Documentation

**When creating new documentation, follow these rules:**

1. **Architecture changes** → `docs/01-architecture/{topic}.md`
   - Examples: new design patterns, architectural decisions, system diagrams

2. **Core services/concepts** → `docs/02-core-concepts/{topic}.md`
   - Examples: new services, utilities, base classes

3. **New features** → `docs/03-features/{feature-name}.md`
   - Examples: product-discovery.md, condition-assessment.md

4. **UI components/styling** → `docs/04-ui-components/{topic}.md`
   - Examples: new shared components, SKAPA usage, styling guides

5. **Development processes** → `docs/05-development-guide/{topic}.md`
   - Examples: testing guides, debugging tips, workflows

6. **API documentation** → `docs/06-api-integration/{topic}.md`
   - Examples: API endpoints, request/response formats, error codes

7. **Build/deployment** → `docs/07-deployment/{topic}.md`
   - Examples: deployment processes, CI/CD, environment configs

### Documentation File Naming

- **Use lowercase with hyphens**: `my-feature-guide.md` ✅
- **NOT**: `My_Feature_Guide.md` ❌
- **Be descriptive**: `http-interceptors.md` instead of `interceptors.md`
- **Follow existing patterns**: Check the folder first to match naming style

### Documentation Format

All documentation files should include:

```markdown
# Title

## Overview
Brief description of what this document covers

## [Relevant Sections]
Detailed content with code examples

## Usage Examples
Practical examples showing how to use/implement

## Related Documentation
Links to related docs in the docs/ folder
```

**NEVER** create `.md` files in project root except:
- `README.md` (main project readme)
- `CLAUDE.md` (this file - AI guidance)
- `PROJECT_STATUS.md` (project status overview)

## Essential Commands

### Development
```bash
npm start                    # Development server at localhost:4200
npm run watch               # Auto-rebuild on changes
```

### Building for Markets
```bash
# Saudi Arabia
npm run sa-prod             # Production English (/sa/en/buyback/)
npm run sa-prod-ar          # Production Arabic (/sa/ar/buyback/)
npm run sa-qa               # QA English
npm run sa-qa-ar            # QA Arabic

# Bahrain
npm run bh-prod             # Production English (/bh/en/buyback/)
npm run bh-prod-ar          # Production Arabic (/bh/ar/buyback/)
npm run bh-qa               # QA English
npm run bh-qa-ar            # QA Arabic
```

### Verification
```bash
npm run build               # Test build compilation
cat dist/buyback-portal/browser/index.html | grep "base href"  # Verify base-href
cat dist/buyback-portal/browser/index.html | grep "esi:include"  # Verify ESI headers
```

## Architecture Principles

### URL-Based Localization
The app uses URL paths for market/language selection: `/{market}/{lang}/{route}`

**Critical Pattern**: Routes are defined WITHOUT locale prefix. APP_BASE_HREF factory (in `app.config.ts`) extracts market/language from URL and sets base href dynamically. The factory also sets `dir="rtl"` for Arabic automatically.

Example URLs:
- `/sa/en/search` - Saudi Arabia, English
- `/sa/ar/buyback-list` - Saudi Arabia, Arabic (RTL)
- `/bh/en/summary` - Bahrain, English

**When navigating**: Use `this.router.navigate(['/search'])` - the base href handles locale automatically.

### Base Classes Pattern (CRITICAL)

**Every component MUST extend BaseComponent**:
```typescript
export class MyComponent extends BaseComponent implements OnInit {
  constructor() {
    super(); // REQUIRED
  }
}
```
BaseComponent provides automatic subscription cleanup via `ngUnSubscribe` Subject. Always use `takeUntil(this.ngUnSubscribe)` for observables.

**Business logic MUST go in models extending BaseModel**:
```typescript
export class MyModel extends BaseModel {
  calculateSomething(): number {
    // Access utility service via this.utility
    return this.utility.formatNumber(123);
  }
}
```
Models handle business logic. Components only handle UI/presentation.

### Signal-Based State Management

The entire application uses Angular Signals (NOT RxJS-heavy patterns):

**Service Pattern**:
```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private _items = signal<Item[]>([]);
  readonly items = this._items.asReadonly();  // Expose as readonly
  readonly count = computed(() => this._items().length);

  addItem(item: Item): void {
    this._items.update(items => [...items, item]);  // NEVER mutate directly
  }
}
```

**Component Pattern**:
```typescript
export class MyComponent extends BaseComponent {
  items = computed(() => this.myService.items());

  // In template: {{ items() }} - call as function
}
```

**CRITICAL**: Never mutate signals directly (`items().push(x)` won't work). Use `set()` or `update()`.

### Translation System

Custom translation system using TypeScript constants (NO i18n libraries):

**Pattern**:
```typescript
// In component
translations = computed(() => this.locale.translations());

// In template
{{ translations().productDiscovery.searchPlaceholder }}
```

**Translation files location**: `src/app/shared/constants/translations/`
- `en-sa.constants.ts` - Saudi Arabia English
- `ar-sa.constants.ts` - Saudi Arabia Arabic
- `en-bh.constants.ts` - Bahrain English
- `ar-bh.constants.ts` - Bahrain Arabic

**When adding new text**: Add to ALL 4 translation files to maintain type safety.

### ESI Integration (CRITICAL)

The app does NOT have custom header/footer components. IKEA global header/footer are injected via ESI includes.

**Index files**: Separate index.html for each market/language:
- `src/index.sa.html` - Saudi Arabia English
- `src/index.sa.ar.html` - Saudi Arabia Arabic (lang="ar")
- `src/index.bh.html` - Bahrain English
- `src/index.bh.ar.html` - Bahrain Arabic (lang="ar")

**ESI tags** in index files:
```html
<esi:include src="https://www.ikea.com/sa/en/header-footer/header-fragment-recursive.html?page-type=CART">
</esi:include>
```

**IMPORTANT**: ESI includes only work in production with ESI processor. During development, header/footer won't display (this is expected).

**App component structure**: Just `<router-outlet></router-outlet>` - no layout wrapper.

### Build Configurations

Each market/language combination has dedicated build configuration in `angular.json`:

**Pattern**: Configuration name = `{market}-{env}` or `{market}-{env}-ar`

Examples:
- `sa-prod` - Uses `environment.sa-prod.ts` + `index.sa.html`
- `sa-prod-ar` - Uses `environment.sa-prod.ts` + `index.sa.ar.html` (Arabic)
- `bh-qa` - Uses `environment.bh-qa.ts` + `index.bh.html`

**Each configuration sets**:
- Environment file replacement
- Index file (market/language specific)
- Production optimizations (AOT, minification, etc.)

**Base href** is set via npm script (not angular.json) to match deployment path.

### Environment Configuration

Environment files in `src/environments/`:
- `environment.ts` - Development (default)
- `environment.sa-qa.ts` - Saudi QA
- `environment.sa-prod.ts` - Saudi Production
- `environment.bh-qa.ts` - Bahrain QA
- `environment.bh-prod.ts` - Bahrain Production

**Pattern**:
```typescript
export const environment: Environment = {
  production: true,
  market: 'sa',
  apiBaseUrl: 'https://api.ikea.sa',
  currency: { code: 'SAR', symbol: 'ر.س' },
  supportedLanguages: ['en', 'ar'],
  defaultLanguage: 'en'
};
```

## Feature Module Structure

Feature-based organization (NOT technical layer organization):

```
features/{feature-name}/
├── pages/              # Route components (extend BaseComponent)
├── components/         # Feature-specific components
├── services/           # Feature state (signal-based)
└── models/             # Business logic (extend BaseModel)
```

**When creating new features**:
1. Create page component extending BaseComponent
2. Create service with signal-based state
3. Put business logic in model classes
4. Add lazy route in `app.routes.ts`
5. Add translations to all 4 locale files

## Core Services

Located in `src/app/core/services/`:

**LocaleService** - Market/language management
- Provides `currentMarket()`, `currentLanguage()`, `translations()`
- Automatically detects from URL
- Sets RTL direction

**DatastoreService** - localStorage/sessionStorage wrapper
- Methods: `get<T>()`, `set()`, `remove()`, `clear()`
- Type-safe with generics

**UtilityService** - Common utilities
- Formatting (dates, currency, numbers)
- Debounce, throttle
- String manipulation

**APIService** - Centralized API endpoints
- Registry pattern for all API URLs
- Environment-based base URL

**LoaderService** - SKAPA skeleton loader state
- Signal-based loading state management

## RTL Support

**Automatic RTL detection**: APP_BASE_HREF factory sets `dir="rtl"` for Arabic URLs.

**SCSS patterns for RTL**:
```scss
// Use logical properties (auto RTL)
.card {
  margin-inline-start: $spacing-md;  // Left in LTR, right in RTL
  padding-inline-end: $spacing-lg;   // Right in LTR, left in RTL
}

// RTL-specific overrides (if needed)
[dir='rtl'] {
  .icon-arrow {
    transform: scaleX(-1);  // Flip arrows
  }
}
```

**NEVER use `margin-left` or `margin-right`** - always use `margin-inline-start/end` for RTL compatibility.

## Modern Angular Control Flow

Use `@if`, `@for`, `@switch` syntax (NOT *ngIf, *ngFor):

```html
@if (isLoading()) {
  <skapa-skeleton variant="card"></skapa-skeleton>
} @else if (items().length === 0) {
  <app-empty-state></app-empty-state>
} @else {
  @for (item of items(); track item.id) {
    <app-item-card [item]="item"></app-item-card>
  }
}
```

**ALWAYS use `track` in @for loops** for performance.

## SKAPA Design System

Web components for UI elements. Components require `CUSTOM_ELEMENTS_SCHEMA`:

```typescript
@Component({
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Required for SKAPA
})
```

**Loading states**: Use SKAPA skeleton loaders (NOT spinners):
```html
<skapa-skeleton variant="card"></skapa-skeleton>
```

**Prices (CRITICAL)**: ALL prices and totals MUST use `skapa-price`. Never render prices as plain text or via `formatCurrency()`. Use `utility.splitPriceForSkapa(amount)` to get the parts, then bind them:
```html
<skapa-price
  size="small"
  currency-position="leading"
  currency-spacing="thin"
  [integerValue]="getPriceParts(amount).integerValue"
  [decimalValue]="getPriceParts(amount).decimalValue"
  [decimalSign]="getPriceParts(amount).decimalSign"
  [currencyLabel]="getPriceParts(amount).currencyLabel">
</skapa-price>
```
Use `size="small"` for per-item prices and `size="medium"` for totals/summaries. The helper in the component:
```typescript
getPriceParts(price: number) {
  return this.utility.splitPriceForSkapa(price);
}
```

## Constants and Configuration

**App constants**: `src/app/shared/constants/app.constants.ts`
**Route constants**: `src/app/shared/constants/routes.constants.ts`
**Storage keys**: Defined in app constants to avoid string literals

## Documentation Maintenance

**When implementing new features or making changes:**

1. **Always update documentation** in `docs/` folder alongside code changes
2. **Create new documentation files** for new features/components/services
3. **Update existing docs** when modifying behavior or APIs
4. **Add usage examples** to help other developers understand implementation
5. **Link related docs** at the bottom of each documentation file
6. **Update `docs/README.md`** index when adding new documentation files

**Documentation is as important as code** - treat it as a first-class deliverable.

## Adding New Market Support

To add a new market (e.g., Kuwait):

1. Create index files: `index.kw.html`, `index.kw.ar.html` with ESI includes for `/kw/en/` and `/kw/ar/`
2. Create environment files: `environment.kw-qa.ts`, `environment.kw-prod.ts`
3. Add build configurations in `angular.json` (8 configs: kw-qa, kw-qa-ar, kw-prod, kw-prod-ar)
4. Add npm scripts in `package.json` with correct base-href (`/kw/en/buyback/`, `/kw/ar/buyback/`)
5. Create translation files: `en-kw.constants.ts`, `ar-kw.constants.ts`
6. Update LocaleService to include 'kw' in `validMarkets`
7. Update translation loader to map new locale keys
8. **Create documentation**: `docs/05-development-guide/adding-market-kw.md`

## Code Generation

**Standalone components** (default):
```bash
ng generate component features/my-feature/pages/my-page --standalone
ng generate service features/my-feature/services/my-service
```

**Component structure order** (follow this pattern):
1. @Input decorators
2. @Output decorators
3. Signals (state)
4. Computed values
5. Constructor with DI
6. Lifecycle hooks
7. Public methods
8. Private methods

## Critical File Paths

- **Base classes**: `src/app/shared/base-classes/`
- **Core services**: `src/app/core/services/`
- **Translations**: `src/app/shared/constants/translations/`
- **Environments**: `src/environments/`
- **Global SCSS**: `src/assets/global/` (variables, mixins, common, rtl)
- **Index templates**: `src/index.{market}.html` or `src/index.{market}.ar.html`

## Documentation

Comprehensive documentation in `docs/` folder:
- `docs/01-architecture/` - System architecture, SOLID principles, ESI integration
- `docs/02-core-concepts/` - Routing, translations, services, base classes
- `docs/03-features/` - Feature-specific documentation
- `docs/04-ui-components/` - SKAPA integration, styling guide
- `docs/05-development-guide/` - Workflows, standards, troubleshooting
- `docs/07-deployment/` - Build configurations, deployment guide

**When adding features**: Update feature documentation in `docs/03-features/`.

## TypeScript Configuration

Relaxed strict mode (NOT full strict):
```json
{
  "strict": false,
  "noImplicitAny": false,
  "strictNullChecks": false
}
```

**Still required**: Explicit types on function parameters and return values.

## Common Pitfalls

1. **Forgetting to extend BaseComponent** - All components MUST extend it
2. **Calling super() in constructor** - Required when extending BaseComponent
3. **Direct signal mutation** - Use `set()` or `update()`, never mutate arrays/objects directly
4. **Missing track in @for** - Always include track by id or $index
5. **Using left/right margins** - Use logical properties for RTL support
6. **Hardcoded strings** - Always use translation system
7. **Missing CUSTOM_ELEMENTS_SCHEMA** - Required for SKAPA components
8. **Not calling signals as functions in templates** - `{{ mySignal() }}` not `{{ mySignal }}`
9. **Creating header/footer components** - Use ESI includes only
10. **Wrong base-href in builds** - Each market/language has specific path
11. **Rendering prices as plain text** - ALL prices and totals MUST use `skapa-price`, never `formatCurrency()` or string interpolation

## Project Status

- **Phase**: Skeleton complete, ready for feature implementation
- **Core Infrastructure**: 100% complete
- **Documentation**: 27 files complete
- **Build System**: All 8 configurations tested and working
- **Bundle Size**: 244 KB initial (67 KB gzipped), ~1 KB per lazy route

## Quick Reference Links

### Root Documentation
- **Project status**: `PROJECT_STATUS.md`
- **Documentation index**: `docs/README.md` - **START HERE** for all documentation

### Most Important Docs
- **Architecture overview**: `docs/01-architecture/overview.md`
- **ESI integration**: `docs/01-architecture/esi-integration.md`
- **Routing & localization**: `docs/02-core-concepts/routing-and-localization.md`
- **Translation system**: `docs/02-core-concepts/translation-system.md`
- **Development workflow**: `docs/05-development-guide/development-workflow.md`
- **Getting started**: `docs/05-development-guide/getting-started.md`
- **Troubleshooting**: `docs/05-development-guide/troubleshooting.md`

### Implementation Guides
- **Build scripts**: `docs/07-deployment/build-scripts.md`
- **Build configurations**: `docs/07-deployment/build-configurations.md`
- **SKAPA packages**: `docs/04-ui-components/skapa-packages.md`
- **Shared components**: `docs/04-ui-components/shared-components-implementation.md`
- **HTTP interceptors**: `docs/06-api-integration/http-interceptors.md` (when created)

**Remember**: ALL documentation files are in `docs/` folder. Check `docs/README.md` for complete index.
