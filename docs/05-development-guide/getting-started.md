# Getting Started

This guide will help you set up the IKEA Buyback Portal development environment and get your first build running.

## Prerequisites

### Required Software

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: v2.30.0 or higher
- **Code Editor**: VS Code recommended

### Check Your Versions

```bash
node --version  # Should be v18+
npm --version   # Should be v9+
git --version   # Should be v2.30+
```

### Recommended VS Code Extensions

- Angular Language Service
- ESLint
- Prettier
- SCSS IntelliSense
- Angular Snippets

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd buyback-portal
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Angular v21.1.0
- TypeScript
- SCSS tools
- Development dependencies

### 3. Verify Installation

```bash
# Check Angular CLI
npx ng version

# Should show:
# Angular CLI: 21.1.1
# Node: 22.17.1
# Package Manager: npm 10.9.2
```

## Running the Application

### Development Server

```bash
npm start
```

Or using Angular CLI directly:

```bash
ng serve
```

The application will be available at:
- **English (Saudi)**: http://localhost:4200/sa/en/search
- **Arabic (Saudi)**: http://localhost:4200/sa/ar/search
- **English (Bahrain)**: http://localhost:4200/bh/en/search
- **Arabic (Bahrain)**: http://localhost:4200/bh/ar/search

### Development Server Options

```bash
# Open browser automatically
npm start -- --open

# Run on different port
npm start -- --port 4300

# Enable HTTPS
npm start -- --ssl
```

## Build the Application

### Development Build

```bash
npm run build
```

Output: `dist/buyback-portal/browser/`

### Production Build (Saudi Arabia)

```bash
ng build --configuration=sa-prod
```

### Production Build (Bahrain)

```bash
ng build --configuration=bh-prod
```

## Project Structure Overview

```
buyback-portal/
├── src/
│   ├── app/                    # Application source
│   │   ├── core/              # Core services
│   │   ├── features/          # Feature modules
│   │   ├── shared/            # Shared code
│   │   ├── layouts/           # Layout components
│   │   ├── app.config.ts      # App configuration
│   │   └── app.routes.ts      # Route definitions
│   ├── assets/                # Static assets
│   ├── environments/          # Environment configs
│   └── styles.scss            # Global styles
├── docs/                      # Documentation
├── angular.json               # Angular configuration
├── package.json               # Dependencies
└── tsconfig.json             # TypeScript config
```

## Understanding the URL Structure

All routes follow this pattern:

```
/{market}/{lang}/{route}
```

Examples:
- `/sa/en/search` - Saudi Arabia, English, Search page
- `/sa/ar/categories` - Saudi Arabia, Arabic, Categories page
- `/bh/en/buyback-list` - Bahrain, English, Buyback list page
- `/bh/ar/summary` - Bahrain, Arabic, Summary page

## First Steps After Setup

### 1. Explore the Application

Navigate to different routes:

```
http://localhost:4200/sa/en/search
http://localhost:4200/sa/en/categories
http://localhost:4200/sa/en/buyback-list
http://localhost:4200/sa/en/summary
http://localhost:4200/sa/en/confirmation
```

### 2. Test RTL (Arabic)

```
http://localhost:4200/sa/ar/search
```

You should see:
- Text direction changed to RTL
- Arabic translations loaded
- Layout mirrored appropriately

### 3. Check Different Markets

```
http://localhost:4200/bh/en/search  # Bahrain market
```

You should see:
- Currency changed to BHD
- Market-specific translations

## Development Workflow

### 1. Create a New Feature

```bash
# Generate a component
ng generate component features/my-feature/components/my-component --standalone

# Generate a service
ng generate service features/my-feature/services/my-service

# Generate a model
ng generate class features/my-feature/models/my-model
```

### 2. Follow the Conventions

- **Components**: Extend `BaseComponent`
- **Models**: Extend `BaseModel`
- **Services**: Use `@Injectable({ providedIn: 'root' })`
- **Styles**: Use SCSS with global mixins

Example component:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../shared/base-classes/base.component';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss'
})
export class MyComponent extends BaseComponent {
  constructor() {
    super();
  }
}
```

### 3. Use Translations

```typescript
import { LocaleService } from './core/services/locale.service';

export class MyComponent {
  translations = computed(() => this.locale.translations());

  constructor(private locale: LocaleService) {}
}
```

```html
<h1>{{ translations().common.appTitle }}</h1>
<button>{{ translations().common.submit }}</button>
```

### 4. Format Code

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for development |
| `npm run build:prod` | Build for production |
| `ng generate component <name>` | Generate component |
| `ng generate service <name>` | Generate service |
| `npm run lint` | Lint code |
| `npm run format` | Format code |

## Environment Variables

The application uses different environments:

| Environment | File | Usage |
|------------|------|-------|
| Local | `environment.ts` | Development |
| SA QA | `environment.sa-qa.ts` | Saudi QA |
| SA Prod | `environment.sa-prod.ts` | Saudi Production |
| BH QA | `environment.bh-qa.ts` | Bahrain QA |
| BH Prod | `environment.bh-prod.ts` | Bahrain Production |

To build for specific environment:

```bash
ng build --configuration=sa-prod
ng build --configuration=bh-qa
```

## Hot Module Replacement (HMR)

The dev server supports HMR by default. Changes to:
- TypeScript files → Component hot reload
- SCSS files → Style hot reload
- HTML templates → Template hot reload

No page refresh needed!

## Debugging

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Go to Sources tab
3. Find your TypeScript files (webpack:// → src/)
4. Set breakpoints

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:4200/sa/en/search",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

Press F5 to start debugging.

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 4200
lsof -i :4200

# Kill the process
kill -9 <PID>

# Or use different port
npm start -- --port 4300
```

### node_modules Issues

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear Angular cache
rm -rf .angular/cache

# Rebuild
npm run build
```

### Style Not Loading

```bash
# Check SCSS compilation
ng build --verbose

# Check import paths in SCSS files
```

## Next Steps

1. Read [Development Workflow](./development-workflow.md)
2. Review [Coding Standards](./coding-standards.md)
3. Understand [Adding New Features](./adding-new-features.md)
4. Check [SKAPA Integration](../04-ui-components/skapa-integration.md)

## Getting Help

- **Documentation**: Check `/docs` folder
- **Code Examples**: Look at existing components
- **Team**: Contact development team
- **Issues**: Check [Troubleshooting Guide](./troubleshooting.md)

---

**Ready to start developing!** 🚀

Navigate to http://localhost:4200/sa/en/search and start exploring!
