# Architecture Overview

## High-Level Architecture

The IKEA Buyback Portal follows a **layered architecture** with clear separation of concerns, implementing SOLID principles throughout.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │ ESI Headers  │      │
│  │  (Routes)    │  │   (UI/UX)    │  │   (IKEA)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Models     │  │  ViewModels  │  │   Services   │      │
│  │  (Domain)    │  │   (Logic)    │  │   (State)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     API      │  │  DataStore   │  │    Cache     │      │
│  │  (Backend)   │  │  (Storage)   │  │   (Memory)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Cross-Cutting Concerns                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routing    │  │ Localization │  │    Logging   │      │
│  │ (Navigation) │  │  (i18n/RTL)  │  │   (Errors)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Key Architectural Decisions

### 1. Standalone Components

**Decision**: Use Angular standalone components throughout the application.

**Rationale**:
- Simplifies dependency management
- Reduces boilerplate code (no NgModules)
- Better tree-shaking and bundle optimization
- Aligns with Angular's future direction

**Impact**:
- Each component declares its own dependencies
- Lazy loading is simpler and more explicit
- Better code organization and maintainability

### 2. Signal-Based State Management

**Decision**: Use Angular Signals for reactive state instead of RxJS-heavy patterns.

**Rationale**:
- Native Angular solution (no external dependencies)
- Better performance (fine-grained reactivity)
- Simpler mental model than complex Observable chains
- Easier debugging and testing

**Impact**:
- Services use signals for state (`signal`, `computed`, `effect`)
- Components subscribe to signals using `()` syntax
- Cleaner code with less boilerplate

### 3. URL-Based Localization

**Decision**: Encode market and language in URL path (`/{market}/{lang}/{route}`).

**Rationale**:
- SEO-friendly URLs
- Shareable links preserve language preference
- No need for cookies or localStorage for locale
- Clear and explicit locale selection

**Impact**:
- APP_BASE_HREF factory extracts locale from URL
- Routes defined without locale prefix
- Locale changes require page reload (intentional)

### 4. Custom Translation System

**Decision**: Build custom translation system instead of using Angular i18n or third-party libraries.

**Rationale**:
- Full control over translation logic
- No build-time complexity
- Simple constant files (easy to manage)
- Type-safe translations with TypeScript interfaces
- No external dependencies

**Impact**:
- Translation files are TypeScript constants
- Translations loaded dynamically based on URL
- Easy to add new locales
- Simple to understand and maintain

### 5. Feature-Based Folder Structure

**Decision**: Organize code by features rather than technical layers.

**Rationale**:
- Easier to locate related files
- Better encapsulation of feature logic
- Facilitates team collaboration (feature ownership)
- Scalable for large applications

**Impact**:
- Each feature has its own pages, components, services, models
- Clear boundaries between features
- Easier to add/remove features

### 6. SKAPA Design System Integration

**Decision**: Use SKAPA web components for all UI elements.

**Rationale**:
- Consistent IKEA branding
- Pre-built accessible components
- Maintained by design team
- Cross-framework compatibility

**Impact**:
- Web components imported in BaseComponent
- CUSTOM_ELEMENTS_SCHEMA required
- Event handling uses native DOM events
- Styling via CSS custom properties

## Component Communication Patterns

### 1. Parent-Child Communication

```typescript
// Parent passes data down via @Input
<app-child [data]="parentData"></app-child>

// Child emits events up via @Output
@Output() dataChanged = new EventEmitter<Data>();
```

### 2. Service-Based Communication

```typescript
// Shared service with signals
@Injectable({ providedIn: 'root' })
export class DataService {
  private _data = signal<Data[]>([]);
  public readonly data = this._data.asReadonly();

  updateData(newData: Data[]) {
    this._data.set(newData);
  }
}

// Components inject and use
constructor(private dataService: DataService) {
  effect(() => {
    console.log('Data changed:', this.dataService.data());
  });
}
```

### 3. Route-Based Communication

```typescript
// Navigate with state
this.router.navigate(['/summary'], { state: { data: buybackList } });

// Receive in target component
constructor(private router: Router) {
  const navigation = this.router.getCurrentNavigation();
  const data = navigation?.extras?.state?.['data'];
}
```

## Data Flow

```
User Action (Template)
    ↓
Component Method
    ↓
Service Call (with Signal Update)
    ↓
API Request (HTTP)
    ↓
Response Processing
    ↓
Signal Update
    ↓
Computed Signals Re-evaluate
    ↓
Template Re-renders
```

## Error Handling Strategy

### Layers of Error Handling

1. **HTTP Interceptor**: Catches all HTTP errors
2. **Service Layer**: Handles business logic errors
3. **Component Layer**: Displays user-friendly messages
4. **Global Error Handler**: Catches unhandled errors

```typescript
// HTTP Interceptor
export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Log error
      // Transform to user-friendly message
      // Dispatch to error service
      return throwError(() => error);
    })
  );
};

// Service Layer
getData(): Observable<Data> {
  return this.http.get<Data>(url).pipe(
    catchError(error => {
      this.errorService.handleError(error);
      return of(null); // or throwError
    })
  );
}

// Component Layer
loadData() {
  this.service.getData().subscribe({
    next: data => this.data.set(data),
    error: err => this.showError(err)
  });
}
```

## Performance Considerations

### 1. Lazy Loading

All feature modules are lazy-loaded to reduce initial bundle size.

### 2. OnPush Change Detection

Components use `ChangeDetectionStrategy.OnPush` where possible.

### 3. Signal-Based Reactivity

Signals provide fine-grained reactivity, updating only what changed.

### 4. Computed Values

Expensive calculations are memoized using `computed()`.

### 5. TrackBy Functions

Lists use `trackBy` to minimize DOM updates.

```typescript
trackByItemNo(index: number, item: Product): string {
  return item.itemNo;
}
```

## Security Considerations

### 1. XSS Protection

- Angular's built-in sanitization
- No `innerHTML` usage without sanitization
- Proper data binding (`{{ }}` vs `[innerHTML]`)

### 2. CSRF Protection

- CSRF tokens in HTTP requests
- Interceptor adds tokens automatically

### 3. Data Validation

- Client-side validation (user experience)
- Server-side validation (security)
- Never trust client data

### 4. Environment-Specific Configs

- Sensitive data in environment files
- Different configs per environment
- No secrets in code

## Scalability Patterns

### 1. Feature Modules

Easy to add new features without affecting existing code.

### 2. Service Abstraction

Services can be swapped (mock → real API) without component changes.

### 3. Configuration-Driven

Behavior controlled by configuration, not hardcoded logic.

### 4. Market Expansion

Adding new markets requires:
- New environment files
- New translation files
- Update locale validation
- No code changes

## Testing Strategy

### Unit Tests

- Services: Business logic testing
- Components: Template interaction testing
- Pipes: Transformation testing
- Utilities: Helper function testing

### Integration Tests

- Feature flows: Multi-component interactions
- API integration: Service + HTTP testing
- State management: Signal updates testing

### E2E Tests

- User journeys: Complete workflows
- Cross-browser: Browser compatibility
- Locale testing: RTL/LTR, translations

## Monitoring & Logging

### Application Logs

```typescript
// Log levels
enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR
}

// Logger service
this.logger.info('User action', { action: 'submit', data });
this.logger.error('API error', error);
```

### Performance Monitoring

- Bundle size tracking
- Load time metrics
- API response times
- User interaction metrics

### Error Tracking

- Global error handler
- HTTP error interceptor
- User error reporting
- Stack trace collection

## Future Enhancements

1. **Progressive Web App (PWA)**: Offline support
2. **Server-Side Rendering (SSR)**: SEO and performance
3. **Service Workers**: Caching strategies
4. **Analytics Integration**: User behavior tracking
5. **A/B Testing**: Feature experimentation
6. **Micro-frontends**: Feature independence

---

**Next**: [Folder Structure](./folder-structure.md)
