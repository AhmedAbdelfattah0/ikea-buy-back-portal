# IKEA Buyback Portal - Documentation

Welcome to the IKEA Buyback Portal documentation. This comprehensive guide will help you understand, develop, and maintain the application.

## 📚 Documentation Index

### 1. [Architecture](./01-architecture/overview.md)
- [Overview](./01-architecture/overview.md) - High-level architecture and design decisions
- [Folder Structure](./01-architecture/folder-structure.md) - Project organization explained
- [SOLID Principles](./01-architecture/solid-principles.md) - How SOLID principles are applied
- [Component Architecture](./01-architecture/component-architecture.md) - Component design patterns
- [State Management](./01-architecture/state-management.md) - Signal-based state management guide
- [Dependency Injection](./01-architecture/dependency-injection.md) - DI patterns and best practices
- [ESI Integration](./01-architecture/esi-integration.md) - Edge Side Includes for header/footer

### 2. [Core Concepts](./02-core-concepts/routing-and-localization.md)
- [Routing & Localization](./02-core-concepts/routing-and-localization.md) - URL structure and locale handling
- [Translation System](./02-core-concepts/translation-system.md) - Custom translation implementation
- [Environment Configuration](./02-core-concepts/environment-configuration.md) - Multi-environment setup
- [Base Classes](./02-core-concepts/base-classes.md) - BaseComponent and BaseModel usage
- [Services Overview](./02-core-concepts/services-overview.md) - Core services explained

### 3. [Features](./03-features/product-discovery.md)
- [Product Discovery](./03-features/product-discovery.md) - Search and category browsing
- [Condition Assessment](./03-features/condition-assessment.md) - Product condition selection
- [Buyback List](./03-features/buyback-list.md) - Buyback list management
- [Offer Calculation](./03-features/offer-calculation.md) - Offer calculation logic
- [Submission Flow](./03-features/submission-flow.md) - Submission and confirmation

### 4. [UI Components](./04-ui-components/skapa-integration.md)
- [SKAPA Integration](./04-ui-components/skapa-integration.md) - Design system integration guide
- [SKAPA Packages](./04-ui-components/skapa-packages.md) - SKAPA package installation guide
- [Shared Components](./04-ui-components/shared-components.md) - Reusable component library
- [Shared Components Implementation](./04-ui-components/shared-components-implementation.md) - Modal, Toaster, ErrorMessage details
- [Styling Guide](./04-ui-components/styling-guide.md) - SCSS structure and theming

### 5. [Development Guide](./05-development-guide/getting-started.md)
- [Getting Started](./05-development-guide/getting-started.md) - Setup and installation
- [Development Workflow](./05-development-guide/development-workflow.md) - Daily development practices
- [Coding Standards](./05-development-guide/coding-standards.md) - TypeScript and naming conventions
- [Adding New Features](./05-development-guide/adding-new-features.md) - Step-by-step guide
- [Adding New Markets](./05-development-guide/adding-new-markets.md) - Market expansion guide
- [Troubleshooting](./05-development-guide/troubleshooting.md) - Common issues and solutions

### 6. [API Integration](./06-api-integration/api-overview.md)
- [API Overview](./06-api-integration/api-overview.md) - API structure and endpoints
- [Mock Services](./06-api-integration/mock-services.md) - Mock service implementation
- [HTTP Interceptors](./06-api-integration/http-interceptors.md) - Request/response handling
- [Error Handling](./06-api-integration/error-handling.md) - API error handling patterns

### 7. [Deployment](./07-deployment/build-configurations.md)
- [Build Configurations](./07-deployment/build-configurations.md) - Build configs explained
- [Build Scripts](./07-deployment/build-scripts.md) - npm build scripts reference
- [Deployment Guide](./07-deployment/deployment-guide.md) - Deployment steps per environment
- [Environment Variables](./07-deployment/environment-variables.md) - Environment-specific config

## 🚀 Quick Start

1. **Prerequisites**: Node.js 18+, npm 9+
2. **Installation**: `npm install`
3. **Development**: `npm start` then navigate to `http://localhost:4200/sa/en/search`
4. **Build**: `npm run build`

## 🛠 Technology Stack

- **Framework**: Angular v21.1.0
- **Language**: TypeScript 5.7+
- **Styling**: SCSS with SKAPA Design System
- **State Management**: Angular Signals
- **HTTP**: Angular HttpClient
- **Routing**: Angular Router with APP_BASE_HREF
- **Design System**: SKAPA (IKEA Design System)

## 🌍 Supported Locales

- **Saudi Arabia**: English (`/sa/en/`), Arabic (`/sa/ar/`)
- **Bahrain**: English (`/bh/en/`), Arabic (`/bh/ar/`)

## 📦 Project Structure

```
buyback-portal/
├── src/app/
│   ├── core/              # Core services, guards, interceptors
│   ├── features/          # Feature modules (5 features)
│   ├── shared/            # Shared components, base classes, constants
│   ├── layouts/           # Layout components
│   └── app.config.ts      # Application configuration
├── src/environments/      # Environment configurations
├── src/assets/           # Static assets and global styles
└── docs/                 # This documentation
```

## 🎯 Key Features

1. **Multi-language Support**: English and Arabic with RTL support
2. **Multi-market Support**: Saudi Arabia and Bahrain (extensible)
3. **URL-based Localization**: Locale determined from URL path
4. **SOLID Architecture**: Follows SOLID principles throughout
5. **Signal-based State**: Modern reactive state management
6. **Lazy Loading**: All feature modules are lazy-loaded
7. **Type Safety**: Full TypeScript with strict typing
8. **SKAPA Design System**: Consistent IKEA branding

## 👥 Team Contacts

- **Development Team**: [Your team contact]
- **Product Owner**: [Product owner contact]
- **Design Team**: [Design team contact]

## 📝 Contributing

Please read the [Development Workflow](./05-development-guide/development-workflow.md) and [Coding Standards](./05-development-guide/coding-standards.md) before contributing.

## 📄 License

Internal IKEA project - All rights reserved.

## 🆘 Need Help?

- Check [Troubleshooting Guide](./05-development-guide/troubleshooting.md)
- Review [API Documentation](./06-api-integration/api-overview.md)
- Contact the development team

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Angular Version**: 21.1.0
