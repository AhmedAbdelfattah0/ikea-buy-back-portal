# Troubleshooting Guide

## Overview

This guide provides solutions to common issues you may encounter while developing the IKEA Buyback Portal. Issues are organized by category for easy reference.

## Quick Diagnostics

### Before Troubleshooting

1. **Check the console** - Open browser DevTools (F12) and check Console tab
2. **Check the network** - Look at Network tab for failed API calls
3. **Verify the URL** - Ensure you're using correct market/language format
4. **Clear cache** - Sometimes a hard refresh (Ctrl+Shift+R) helps
5. **Check build** - Run `npm run build` to catch TypeScript errors

### Common Commands

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
rm -rf .angular

# Hard refresh build
rm -rf dist
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

## Installation & Setup Issues

### Issue: `npm install` fails

**Symptoms**:
```bash
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions**:

1. **Clear npm cache**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Use correct Node version**:
```bash
# Check Node version (should be 18.x or 20.x)
node --version

# If wrong version, install correct one
nvm install 20
nvm use 20
npm install
```

3. **Force install** (last resort):
```bash
npm install --legacy-peer-deps
```

### Issue: `npm start` fails

**Symptoms**:
```bash
Error: Cannot find module '@angular/core'
```

**Solutions**:

1. **Reinstall dependencies**:
```bash
rm -rf node_modules
npm install
```

2. **Check angular.json**:
- Verify configuration is correct
- Check project name matches

3. **Clear Angular cache**:
```bash
rm -rf .angular
npm start
```

### Issue: Port 4200 already in use

**Symptoms**:
```bash
Port 4200 is already in use.
```

**Solutions**:

1. **Kill process on port 4200**:
```bash
# macOS/Linux
lsof -ti:4200 | xargs kill -9

# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

2. **Use different port**:
```bash
ng serve --port 4201
```

## Routing & Navigation Issues

### Issue: Routes not working / 404 errors

**Symptoms**:
- Navigating to `/sa/en/search` shows 404
- Routes don't load components

**Solutions**:

1. **Check URL format**:
```
✅ Correct: http://localhost:4200/sa/en/search
❌ Wrong:   http://localhost:4200/search
```

2. **Verify APP_BASE_HREF**:
```typescript
// app.config.ts
export function getBaseHref(): string {
  const pathSegments = window.location.pathname.split('/').filter(s => s);
  const market = pathSegments[0] || 'sa';
  const language = pathSegments[1] || 'en';
  return `/${market}/${language}/`;
}
```

3. **Check route configuration**:
```typescript
// app.routes.ts - Routes should NOT include :market/:lang
{
  path: 'search',  // ✅ Correct
  component: SearchComponent
}

{
  path: ':market/:lang/search',  // ❌ Wrong - handled by APP_BASE_HREF
  component: SearchComponent
}
```

4. **Verify router outlet**:
```html
<!-- App component should have router-outlet -->
<router-outlet></router-outlet>
```

### Issue: Navigation doesn't update URL

**Symptoms**:
- Clicking links doesn't change URL
- Components don't reload

**Solutions**:

1. **Use routerLink correctly**:
```html
<!-- ✅ Correct -->
<a [routerLink]="['/search']">Search</a>

<!-- ❌ Wrong -->
<a href="/search">Search</a>
```

2. **Use Router service**:
```typescript
// Inject Router
constructor(private router: Router) {}

// Navigate
this.router.navigate(['/search']);
```

### Issue: Locale not detected from URL

**Symptoms**:
- Wrong language displays
- Wrong market configuration loads

**Solutions**:

1. **Check URL segments**:
```typescript
// LocaleService should detect correctly
const pathSegments = window.location.pathname.split('/').filter(s => s);
const market = pathSegments[0];      // Should be 'sa' or 'bh'
const language = pathSegments[1];    // Should be 'en' or 'ar'
```

2. **Verify LocaleService initialization**:
```typescript
// LocaleService constructor
constructor() {
  this.detectLocaleFromUrl();
}
```

## Component Issues

### Issue: Component not rendering

**Symptoms**:
- Component selector shows nothing
- No errors in console

**Solutions**:

1. **Check component is imported**:
```typescript
// Parent component
import { MyComponent } from './my-component.component';

@Component({
  imports: [MyComponent]  // Must be in imports array
})
```

2. **Verify selector**:
```typescript
// Component
@Component({
  selector: 'app-my-component'  // Check spelling
})

// Template
<app-my-component></app-my-component>  // Must match
```

3. **Check standalone flag**:
```typescript
@Component({
  standalone: true,  // ✅ Required for standalone components
  imports: [CommonModule]
})
```

4. **Check CUSTOM_ELEMENTS_SCHEMA**:
```typescript
// For SKAPA components
@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Required for web components
})
```

### Issue: Component template not updating

**Symptoms**:
- Changes to HTML don't show
- Old template still displays

**Solutions**:

1. **Hard refresh browser**:
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (macOS)
```

2. **Clear Angular cache**:
```bash
rm -rf .angular
npm start
```

3. **Check file paths**:
```typescript
@Component({
  templateUrl: './my-component.component.html',  // Verify path is correct
  styleUrl: './my-component.component.scss'
})
```

### Issue: Styles not applying

**Symptoms**:
- CSS classes don't work
- Styles not visible

**Solutions**:

1. **Check SCSS import paths**:
```scss
// Component SCSS
@use '../../../../../assets/global/variables' as *;
@use '../../../../../assets/global/mixins' as *;

// Count ../ correctly based on component depth
```

2. **Verify class names**:
```html
<!-- Template -->
<div class="my-component">  <!-- Must match SCSS -->

<!-- SCSS -->
.my-component {  /* Must match template */
  padding: $spacing-md;
}
```

3. **Check specificity**:
```scss
// If styles not applying, increase specificity
.my-component {
  &__item {  // More specific
    color: red;
  }
}
```

4. **Check for typos**:
```scss
// ❌ Wrong
.my-componet { }  // Typo

// ✅ Correct
.my-component { }
```

## Signal Issues

### Issue: Signals not updating UI

**Symptoms**:
- Changing signal value doesn't update template
- UI is stale

**Solutions**:

1. **Call signal as function in template**:
```html
<!-- ✅ Correct -->
{{ mySignal() }}

<!-- ❌ Wrong -->
{{ mySignal }}
```

2. **Use set() or update() to change values**:
```typescript
// ✅ Correct
this.mySignal.set(newValue);
this.mySignal.update(current => current + 1);

// ❌ Wrong
this.mySignal = newValue;  // This doesn't work!
this.mySignal() = newValue;  // This doesn't work!
```

3. **Don't mutate signal values directly**:
```typescript
// ❌ Wrong - Direct mutation
this.items().push(newItem);  // Doesn't trigger updates!

// ✅ Correct - Use update()
this.items.update(items => [...items, newItem]);
```

### Issue: Computed signals not recomputing

**Symptoms**:
- Computed value doesn't update when dependencies change

**Solutions**:

1. **Ensure dependencies are signals**:
```typescript
// ✅ Correct
firstName = signal('John');
lastName = signal('Doe');
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);

// ❌ Wrong - dependencies aren't signals
firstName = 'John';  // Regular variable
fullName = computed(() => `${this.firstName} ${this.lastName}`);
```

2. **Call signals as functions**:
```typescript
// ✅ Correct
computed(() => this.items().length)

// ❌ Wrong
computed(() => this.items.length)  // Missing ()
```

### Issue: Effect running too many times

**Symptoms**:
- effect() callback executes repeatedly
- Infinite loop

**Solutions**:

1. **Don't update signals in effect**:
```typescript
// ❌ Wrong - Creates infinite loop
effect(() => {
  this.count.set(this.count() + 1);  // Don't do this!
});

// ✅ Correct - Read signals only
effect(() => {
  console.log('Count changed:', this.count());
});
```

2. **Use allowSignalWrites for updates**:
```typescript
effect(() => {
  // Only when necessary
  this.logCount();
}, { allowSignalWrites: true });
```

## Translation Issues

### Issue: Translations not showing

**Symptoms**:
- Translation keys show instead of text
- Blank text where translations should be

**Solutions**:

1. **Check translation keys exist**:
```typescript
// en-sa.constants.ts
export const EN_SA_TRANSLATIONS = {
  myFeature: {
    title: 'My Feature'  // Key must exist
  }
};
```

2. **Verify key path in template**:
```html
<!-- ✅ Correct -->
{{ translations().myFeature.title }}

<!-- ❌ Wrong - typo -->
{{ translations().myFeatue.title }}
```

3. **Check LocaleService**:
```typescript
// Component
translations = computed(() => this.locale.translations());

// Constructor
constructor(private locale: LocaleService) {}
```

4. **Verify all locale files updated**:
```
✅ en-sa.constants.ts - Added
✅ ar-sa.constants.ts - Added
✅ en-bh.constants.ts - Added
✅ ar-bh.constants.ts - Added
```

### Issue: Arabic translations not showing

**Symptoms**:
- English works, Arabic doesn't
- Arabic shows English text

**Solutions**:

1. **Check ar-sa.constants.ts exists and is correct**:
```typescript
export const AR_SA_TRANSLATIONS = {
  myFeature: {
    title: 'ميزتي'  // Arabic text
  }
};
```

2. **Verify locale detection**:
```
URL: /sa/ar/search
Language should be: 'ar'
```

3. **Check translation loader**:
```typescript
// translations/index.ts
export function getTranslations(market: string, language: string) {
  const key = `${language}-${market}`;
  const translationMap = {
    'ar-sa': AR_SA_TRANSLATIONS  // Must include Arabic
  };
  return translationMap[key] || EN_SA_TRANSLATIONS;
}
```

## RTL (Right-to-Left) Issues

### Issue: Arabic layout not mirrored

**Symptoms**:
- Arabic text displays left-to-right
- Layout doesn't flip for Arabic

**Solutions**:

1. **Check dir attribute**:
```typescript
// APP_BASE_HREF factory should set dir
if (finalLanguage === 'ar') {
  document.documentElement.setAttribute('dir', 'rtl');
  document.documentElement.setAttribute('lang', 'ar');
}
```

2. **Use logical properties**:
```scss
// ✅ Correct - Logical properties
.card {
  margin-inline-start: $spacing-md;  // Left in LTR, right in RTL
  padding-inline-end: $spacing-lg;   // Right in LTR, left in RTL
}

// ❌ Wrong - Physical properties
.card {
  margin-left: $spacing-md;   // Always left
  padding-right: $spacing-lg;  // Always right
}
```

3. **Check RTL styles**:
```scss
// _rtl.scss should have overrides
[dir='rtl'] {
  .my-component {
    // RTL-specific styles
  }
}
```

### Issue: Icons not flipping in RTL

**Symptoms**:
- Arrow icons point wrong direction in Arabic

**Solutions**:

```scss
[dir='rtl'] {
  .icon-arrow-right,
  .icon-arrow-left {
    transform: scaleX(-1);  // Flip horizontally
  }
}
```

## SKAPA Component Issues

### Issue: SKAPA components not rendering

**Symptoms**:
- `<skapa-button>` shows nothing
- Web components don't work

**Solutions**:

1. **Add CUSTOM_ELEMENTS_SCHEMA**:
```typescript
@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Required!
})
```

2. **Import CUSTOM_ELEMENTS_SCHEMA**:
```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
```

3. **Check SKAPA package installed**:
```bash
npm list @ikea/skapa
```

### Issue: SKAPA component events not firing

**Symptoms**:
- Clicking SKAPA button doesn't trigger handler
- Events don't work

**Solutions**:

1. **Use correct event syntax**:
```html
<!-- ✅ Correct -->
<skapa-button (click)="onClick()">Click</skapa-button>

<!-- ❌ Wrong -->
<skapa-button on-click="onClick()">Click</skapa-button>
```

2. **Check method exists**:
```typescript
onClick(): void {
  console.log('Clicked!');
}
```

## Service & State Issues

### Issue: Service state not persisting

**Symptoms**:
- Data lost on page refresh
- localStorage not working

**Solutions**:

1. **Check DatastoreService usage**:
```typescript
// Save to storage
this.datastore.set('myKey', this.items());

// Load from storage
const stored = this.datastore.get<MyType>('myKey');
```

2. **Verify localStorage is available**:
```typescript
try {
  this.datastore.set('test', 'value');
} catch (error) {
  console.error('localStorage not available:', error);
}
```

3. **Check private browsing**:
- localStorage might be disabled in private/incognito mode

### Issue: Service not injected

**Symptoms**:
```
NullInjectorError: No provider for MyService
```

**Solutions**:

1. **Add providedIn: 'root'**:
```typescript
@Injectable({ providedIn: 'root' })  // ✅ Required
export class MyService { }
```

2. **Or provide in component**:
```typescript
@Component({
  providers: [MyService]  // Alternative
})
```

## API & HTTP Issues

### Issue: API calls failing

**Symptoms**:
- Network errors in console
- No data loaded

**Solutions**:

1. **Check API endpoint**:
```typescript
// APIService
readonly endpoints = {
  products: `${this.baseUrl}/api/products`  // Verify URL
};
```

2. **Check environment configuration**:
```typescript
// environment.ts
export const environment = {
  apiBaseUrl: 'http://localhost:3000'  // Verify base URL
};
```

3. **Check CORS**:
- If calling external API, ensure CORS is enabled
- Check browser console for CORS errors

4. **Check network tab**:
- Open DevTools → Network
- Look for failed requests (red)
- Check request/response

### Issue: HTTP interceptors not working

**Symptoms**:
- Headers not added to requests
- Errors not handled

**Solutions**:

1. **Verify interceptor provided**:
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        httpHeadersInterceptor,
        errorHandlingInterceptor
      ])
    )
  ]
};
```

2. **Check interceptor implementation**:
```typescript
export const httpHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({
    setHeaders: {
      'Content-Type': 'application/json'
    }
  });
  return next(cloned);
};
```

## Build & Production Issues

### Issue: Build fails with TypeScript errors

**Symptoms**:
```bash
Error: src/app/my-component.ts:10:5 - error TS2322: Type 'string' is not assignable to type 'number'
```

**Solutions**:

1. **Fix type errors**:
```typescript
// ❌ Wrong
const age: number = "25";

// ✅ Correct
const age: number = 25;
```

2. **Check tsconfig.json**:
```json
{
  "compilerOptions": {
    "strict": false  // Relaxed mode for this project
  }
}
```

3. **Run tsc to find all errors**:
```bash
npx tsc --noEmit
```

### Issue: Build output too large

**Symptoms**:
- dist/ folder is huge
- Slow page load

**Solutions**:

1. **Check for large dependencies**:
```bash
npm install webpack-bundle-analyzer
ng build --stats-json
npx webpack-bundle-analyzer dist/buyback-portal/browser/stats.json
```

2. **Lazy load routes**:
```typescript
{
  path: 'search',
  loadComponent: () => import('./pages/search/search.component')
    .then(m => m.SearchComponent)  // ✅ Lazy loaded
}
```

3. **Remove unused imports**:
```typescript
// ❌ Wrong - Importing everything
import * as _ from 'lodash';

// ✅ Correct - Import only what you need
import { debounce } from 'lodash';
```

### Issue: Production build different from dev

**Symptoms**:
- Works in dev, breaks in prod
- Different behavior after `ng build`

**Solutions**:

1. **Check environment files**:
```typescript
// Ensure correct environment is used
ng build --configuration=production
```

2. **Test production build locally**:
```bash
ng build --configuration=production
npx http-server dist/buyback-portal/browser
```

3. **Check for dev-only code**:
```typescript
// ❌ Wrong
if (!environment.production) {
  // Code that breaks in prod
}

// ✅ Better
if (environment.development) {
  // Development-only code
}
```

## Memory Leaks

### Issue: Memory increasing over time

**Symptoms**:
- Browser slows down
- Memory usage increases

**Solutions**:

1. **Always extend BaseComponent**:
```typescript
export class MyComponent extends BaseComponent implements OnDestroy {
  constructor() {
    super();  // ✅ Call super()
  }
}
```

2. **Use takeUntil for subscriptions**:
```typescript
// ✅ Correct
this.service.getData()
  .pipe(takeUntil(this.ngUnSubscribe))
  .subscribe(data => { });

// ❌ Wrong - Memory leak!
this.service.getData()
  .subscribe(data => { });  // No unsubscribe
```

3. **Check for intervals/timeouts**:
```typescript
// Component
private intervalId: any;

ngOnInit() {
  this.intervalId = setInterval(() => { }, 1000);
}

ngOnDestroy() {
  if (this.intervalId) {
    clearInterval(this.intervalId);  // ✅ Clean up
  }
  super.ngOnDestroy();
}
```

## Performance Issues

### Issue: Slow rendering / UI freezing

**Symptoms**:
- Page takes long to render
- UI feels sluggish

**Solutions**:

1. **Use OnPush change detection**:
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush  // ✅ Faster
})
```

2. **Use trackBy in loops**:
```html
<!-- ✅ Correct -->
@for (item of items(); track item.id) {
  <app-item [item]="item"></app-item>
}

<!-- ❌ Wrong -->
@for (item of items(); track $index) {  // Less efficient
  <app-item [item]="item"></app-item>
}
```

3. **Avoid heavy computations in templates**:
```typescript
// ❌ Wrong - Computed every time
{{ expensiveCalculation(items()) }}

// ✅ Correct - Use computed signal
expensiveValue = computed(() => this.expensiveCalculation(this.items()));
{{ expensiveValue() }}
```

4. **Lazy load images**:
```html
<img [src]="imageUrl" loading="lazy" />
```

## Getting More Help

### Debug Checklist

1. ✅ Check browser console for errors
2. ✅ Check network tab for failed requests
3. ✅ Verify URL format (/{market}/{lang}/{route})
4. ✅ Run `npm run build` to check for TypeScript errors
5. ✅ Clear cache and hard refresh
6. ✅ Check this troubleshooting guide
7. ✅ Search error message online
8. ✅ Check Angular documentation

### Useful Resources

- **Angular Documentation**: https://angular.dev
- **SKAPA Documentation**: [Internal IKEA docs]
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **RxJS Documentation**: https://rxjs.dev

### Project-Specific Help

- **Architecture**: See `docs/01-architecture/overview.md`
- **Core Concepts**: See `docs/02-core-concepts/`
- **Features**: See `docs/03-features/`
- **Development Guide**: See `docs/05-development-guide/`

---

**Can't find your issue?** Check the related documentation files or contact the development team.
