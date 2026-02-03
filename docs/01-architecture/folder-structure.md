# Folder Structure

## Overview

The IKEA Buyback Portal follows a **feature-based folder structure** that organizes code by business domain rather than technical layer. This makes the codebase more maintainable and easier to navigate.

## Complete Structure

```
buyback-portal/
├── src/
│   ├── app/
│   │   ├── core/                           # Core singleton services
│   │   │   ├── services/
│   │   │   │   ├── locale.service.ts       # Market/language management
│   │   │   │   ├── datastore.service.ts    # localStorage/sessionStorage
│   │   │   │   ├── utility.service.ts      # Common utilities
│   │   │   │   ├── api.service.ts          # API endpoint registry
│   │   │   │   └── loader.service.ts       # SKAPA skeleton loader state
│   │   │   ├── interceptors/               # HTTP interceptors (pending)
│   │   │   │   ├── http-headers.interceptor.ts
│   │   │   │   └── error-handling.interceptor.ts
│   │   │   ├── guards/                     # Route guards (pending)
│   │   │   │   └── locale.guard.ts
│   │   │   └── models/                     # Core data models
│   │   │       └── api-response.model.ts
│   │   │
│   │   ├── features/                       # Feature modules
│   │   │   ├── product-discovery/          # Reusable product UI components
│   │   │   │   ├── components/             # Product-related UI components
│   │   │   │   │   ├── category-tree/
│   │   │   │   │   │   ├── category-tree.component.ts
│   │   │   │   │   │   ├── category-tree.component.html
│   │   │   │   │   │   └── category-tree.component.scss
│   │   │   │   │   ├── condition-selector/
│   │   │   │   │   │   ├── condition-selector.component.ts
│   │   │   │   │   │   ├── condition-selector.component.html
│   │   │   │   │   │   └── condition-selector.component.scss
│   │   │   │   │   └── product-grid/
│   │   │   │   │       ├── product-grid.component.ts
│   │   │   │   │       ├── product-grid.component.html
│   │   │   │   │       └── product-grid.component.scss
│   │   │   │   └── services/               # Product & category services
│   │   │   │       ├── product.service.ts
│   │   │   │       └── category.service.ts
│   │   │   │
│   │   │   └── buyback-list/               # Main single-page application
│   │   │       ├── pages/
│   │   │       │   └── buyback-list/       # Main SPA page (all views)
│   │   │       │       ├── buyback-list.component.ts
│   │   │       │       ├── buyback-list.component.html
│   │   │       │       └── buyback-list.component.scss
│   │   │       ├── components/
│   │   │       │   ├── buyback-sidebar/    # Sidebar with list summary
│   │   │       │   ├── estimation/         # Estimation view component
│   │   │       │   └── confirmation/       # Confirmation view component
│   │   │       └── services/
│   │   │           ├── buyback-list.service.ts
│   │   │           └── submission.service.ts
│   │   │
│   │   ├── shared/                         # Shared across app
│   │   │   ├── components/                 # Reusable UI components
│   │   │   │   ├── loading-spinner/        (pending)
│   │   │   │   ├── error-message/          (pending)
│   │   │   │   ├── modal/                  (pending)
│   │   │   │   └── toaster/                (pending)
│   │   │   ├── base-classes/
│   │   │   │   ├── base.component.ts       # Base component with cleanup
│   │   │   │   └── base.model.ts           # Base model with utilities
│   │   │   ├── constants/
│   │   │   │   ├── app.constants.ts        # App-wide constants
│   │   │   │   ├── routes.constants.ts     # Route paths
│   │   │   │   └── translations/
│   │   │   │       ├── en-sa.constants.ts  # English - Saudi Arabia
│   │   │   │       ├── ar-sa.constants.ts  # Arabic - Saudi Arabia
│   │   │   │       ├── en-bh.constants.ts  # English - Bahrain
│   │   │   │       ├── ar-bh.constants.ts  # Arabic - Bahrain
│   │   │   │       └── index.ts            # Translation loader
│   │   │   ├── pipes/                      # Custom pipes (pending)
│   │   │   │   ├── currency-format.pipe.ts
│   │   │   │   └── translate.pipe.ts
│   │   │   ├── directives/                 # Custom directives (pending)
│   │   │   │   └── rtl-support.directive.ts
│   │   │   └── interfaces/
│   │   │       ├── locale-config.interface.ts
│   │   │       └── translation.interface.ts
│   │   │
│   │   ├── layouts/                        # Layout components (pending)
│   │   │   ├── main-layout/
│   │   │   │   ├── main-layout.component.ts
│   │   │   │   ├── header/
│   │   │   │   └── footer/
│   │   │   └── empty-layout/
│   │   │
│   │   ├── app.component.ts                # Root component
│   │   ├── app.config.ts                   # App configuration + providers
│   │   └── app.routes.ts                   # Route definitions
│   │
│   ├── environments/                       # Environment configurations
│   │   ├── environment.ts                  # Local development
│   │   ├── environment.sa-qa.ts            # Saudi Arabia - QA
│   │   ├── environment.sa-prod.ts          # Saudi Arabia - Production
│   │   ├── environment.bh-qa.ts            # Bahrain - QA
│   │   ├── environment.bh-prod.ts          # Bahrain - Production
│   │   └── environment.model.ts            # Environment interface
│   │
│   ├── assets/                             # Static assets
│   │   ├── global/                         # Global SCSS
│   │   │   ├── _variables.scss             # SCSS variables
│   │   │   ├── _mixins.scss                # SCSS mixins
│   │   │   ├── _common.scss                # Common styles
│   │   │   └── _rtl.scss                   # RTL-specific styles
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── index.html                          # Main HTML file
│   └── styles.scss                         # Global styles entry
│
├── docs/                                   # Comprehensive documentation
│   ├── README.md                           # Documentation index
│   ├── 01-architecture/
│   │   ├── overview.md
│   │   ├── folder-structure.md             # This file
│   │   ├── solid-principles.md
│   │   ├── component-architecture.md
│   │   ├── state-management.md
│   │   ├── dependency-injection.md
│   │   └── esi-integration.md
│   ├── 02-core-concepts/
│   │   ├── routing-and-localization.md
│   │   ├── translation-system.md
│   │   ├── environment-configuration.md
│   │   ├── base-classes.md
│   │   └── services-overview.md
│   ├── 03-features/
│   │   ├── buyback-list.md                 # Main SPA documentation
│   │   ├── confirmation-page.md
│   │   ├── product-discovery.md
│   │   └── submission-flow.md
│   ├── 04-ui-components/
│   │   ├── skapa-integration.md
│   │   ├── skapa-packages.md
│   │   └── shared-components-implementation.md
│   ├── 05-development-guide/
│   │   ├── getting-started.md
│   │   ├── development-workflow.md
│   │   ├── adding-new-features.md
│   │   └── troubleshooting.md
│   ├── 06-api-integration/                 (pending implementation)
│   │   ├── api-overview.md
│   │   ├── mock-services.md
│   │   └── http-interceptors.md
│   └── 07-deployment/
│       ├── build-configurations.md
│       ├── build-scripts.md
│       └── deployment-guide.md
│
├── angular.json                            # Angular CLI configuration
├── tsconfig.json                           # TypeScript configuration
├── tsconfig.app.json                       # App TypeScript config
├── package.json                            # Dependencies
├── package-lock.json                       # Locked dependencies
└── PROJECT_STATUS.md                       # Current project status

```

## Folder Breakdown

### `/src/app/core/`

**Purpose**: Singleton services that are used throughout the entire application.

**Rules**:
- Only services that are `providedIn: 'root'`
- NO components
- NO feature-specific logic
- Should be imported by multiple features

**Contains**:
- `services/` - Core services (Locale, Datastore, Utility, API, Loader)
- `interceptors/` - HTTP interceptors (pending)
- `guards/` - Route guards (pending)
- `models/` - Core data models

**Example**:
```typescript
// ✅ GOOD - Core service used by multiple features
export class LocaleService {
  providedIn: 'root'
}

// ❌ BAD - Feature-specific service
export class ProductSearchService {
  // Should be in features/product-discovery/services/
}
```

### `/src/app/features/`

**Purpose**: Feature modules organized by business domain.

**Rules**:
- Each feature is self-contained
- Features can have their own services, components, models
- Features should not directly import from other features
- Use shared code for cross-feature functionality

**Structure per feature**:
```
feature-name/
├── pages/              # Routable page components
├── components/         # Feature-specific components
├── services/           # Feature-specific services
└── models/             # Business logic models
```

**Example - Product Discovery**:
```
product-discovery/
├── pages/
│   ├── search/                    # /search route
│   └── category-browse/           # /categories route
├── components/
│   ├── search-bar/                # Search input component
│   ├── category-selector/         # Category tree component
│   ├── product-grid/              # Grid layout
│   └── product-card/              # Individual product card
├── services/
│   ├── product-search.service.ts  # Search API calls
│   └── category.service.ts        # Category hierarchy
└── models/
    ├── product.model.ts           # Product business logic
    └── category.model.ts          # Category business logic
```

### `/src/app/features/` - Feature Breakdown

This application is a **single-page application (SPA)** with all functionality contained in the `buyback-list` page component.

#### 1. `product-discovery/`

**Purpose**: Reusable UI components for product browsing and selection.

**Components**:
- `category-tree/` - Hierarchical category navigation tree
- `condition-selector/` - Modal for selecting product condition (Like New, Very Good, Well Used)
- `product-grid/` - Grid display of products with filtering

**Services**:
- `product.service.ts` - Product data, search, filtering, sorting
- `category.service.ts` - Category hierarchy, navigation state

**Note**: This feature has NO pages - only reusable components used by buyback-list.

#### 2. `buyback-list/`

**Purpose**: The main single-page application containing all buyback flow functionality.

**Pages**:
- `buyback-list/` - **Main SPA page** with three views:
  1. **Browse View**: Category tree + Product grid + Buyback sidebar
  2. **Estimation View**: Review items, enter email/store, submit
  3. **Confirmation View**: Success page with quotation number

**Components**:
- `buyback-sidebar/` - Right sidebar showing selected items and total estimate
- `estimation/` - In-page estimation and submission form view
- `confirmation/` - In-page confirmation success view

**Services**:
- `buyback-list.service.ts` - Manage list state, add/remove items, persist to storage
- `submission.service.ts` - Submit buyback request, generate quotation number

**View State Management**:
The main page uses signals to toggle between the three views:
- `showEstimation` - Boolean to show estimation view
- `showConfirmation` - Boolean to show confirmation view
- Default state shows browse view

### `/src/app/shared/`

**Purpose**: Code shared across multiple features.

**Rules**:
- Must be used by at least 2 features
- Should be generic and reusable
- No feature-specific logic

**Contains**:
- `components/` - Reusable UI components
- `base-classes/` - Base component and model classes
- `constants/` - App-wide constants and translations
- `pipes/` - Custom pipes
- `directives/` - Custom directives
- `interfaces/` - TypeScript interfaces

**Example**:
```typescript
// ✅ GOOD - Reusable modal component
@Component({ selector: 'app-modal' })
export class ModalComponent { }

// ❌ BAD - Feature-specific component
@Component({ selector: 'app-product-search-modal' })
export class ProductSearchModalComponent { }
// Should be in features/product-discovery/components/
```

### `/src/app/layouts/`

**Purpose**: Layout wrapper components.

**Layouts**:
- `main-layout/` - Standard layout with header and footer
- `empty-layout/` - Minimal layout (for confirmation page)

**Structure**:
```
main-layout/
├── main-layout.component.ts
├── header/                    # Header component
└── footer/                    # Footer component
```

### `/src/environments/`

**Purpose**: Environment-specific configurations.

**Files**:
- `environment.ts` - Local development (default)
- `environment.sa-qa.ts` - Saudi Arabia QA
- `environment.sa-prod.ts` - Saudi Arabia Production
- `environment.bh-qa.ts` - Bahrain QA
- `environment.bh-prod.ts` - Bahrain Production
- `environment.model.ts` - TypeScript interface

**Usage**:
```typescript
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiBaseUrl;
```

### `/src/assets/`

**Purpose**: Static files and global styles.

**Structure**:
- `global/` - Global SCSS files (variables, mixins, common, RTL)
- `images/` - Image assets
- `icons/` - Icon assets

**SCSS Imports**:
```scss
// In component SCSS files
@use '../../../../../assets/global/variables' as *;
@use '../../../../../assets/global/mixins' as *;
```

### `/docs/`

**Purpose**: Comprehensive project documentation.

**Sections**:
1. **Architecture** - High-level design, SOLID principles
2. **Core Concepts** - Routing, translations, services, base classes
3. **Features** - Feature-specific documentation
4. **UI Components** - SKAPA integration, shared components
5. **Development Guide** - Getting started, workflow, standards
6. **API Integration** - API structure, mocks, interceptors
7. **Deployment** - Build configs, deployment process

## Navigation Paths

### Importing from Different Levels

```typescript
// From feature component to core service
import { LocaleService } from '../../../../core/services/locale.service';

// From feature component to shared component
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

// From feature component to base class
import { BaseComponent } from '../../../../shared/base-classes/base.component';

// From feature component to another feature (❌ AVOID)
// Features should not directly import from other features
```

### SCSS Import Paths

```scss
// From deeply nested component (features/buyback-list/pages/buyback-list/)
@use '../../../../../assets/global/variables' as *;

// From top-level component (app.component.scss)
@use '../assets/global/variables' as *;

// Global styles entry (src/styles.scss)
@use 'assets/global/variables' as *;
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component | `name.component.ts` | `search.component.ts` |
| Service | `name.service.ts` | `locale.service.ts` |
| Model | `name.model.ts` | `product.model.ts` |
| Interface | `name.interface.ts` | `locale-config.interface.ts` |
| Constants | `name.constants.ts` | `app.constants.ts` |
| Pipe | `name.pipe.ts` | `currency-format.pipe.ts` |
| Directive | `name.directive.ts` | `rtl-support.directive.ts` |
| Guard | `name.guard.ts` | `locale.guard.ts` |
| Interceptor | `name.interceptor.ts` | `http-headers.interceptor.ts` |

## Best Practices

### ✅ Do's

1. **Keep features isolated** - No cross-feature imports
2. **Use shared for reusable code** - DRY principle
3. **Organize by feature, not by type** - Business domains over technical layers
4. **Keep folder depth reasonable** - Max 5-6 levels
5. **Use index.ts for barrel exports** - Simplify imports
6. **Document folder purpose** - README in complex folders

### ❌ Don'ts

1. **Don't create deep nesting** - Refactor if too deep
2. **Don't mix concerns** - Keep folders focused
3. **Don't duplicate code** - Move to shared if used twice
4. **Don't put everything in shared** - Only truly shared code
5. **Don't create "utils" folders** - Use descriptive names

## Adding New Features

### Step 1: Create Feature Folder

```bash
src/app/features/new-feature/
├── pages/
├── components/
├── services/
└── models/
```

### Step 2: Create Feature Page Component

```bash
ng generate component features/new-feature/pages/feature-page --standalone
```

### Step 3: Add Route

```typescript
// app.routes.ts
{
  path: 'new-feature',
  loadComponent: () => import('./features/new-feature/pages/feature-page/feature-page.component')
    .then(m => m.FeaturePageComponent)
}
```

### Step 4: Create Feature-Specific Services

```bash
ng generate service features/new-feature/services/new-feature
```

### Step 5: Create Models

```bash
ng generate class features/new-feature/models/new-feature-model
```

---

**Next**: [Component Architecture](./component-architecture.md)
