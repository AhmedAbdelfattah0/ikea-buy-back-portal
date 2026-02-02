# Development Workflow

## Overview

This guide outlines the recommended development workflow for the IKEA Buyback Portal, from starting a new task to deploying to production.

## Daily Workflow

### 1. Start of Day

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Start development server
npm start

# Verify everything works
# Navigate to http://localhost:4200/sa/en/search
```

### 2. Working on a Task

#### Choose a Task

- Check project board or task tracker
- Understand requirements
- Review related documentation
- Ask questions if unclear

#### Create a Branch

```bash
# Feature branch
git checkout -b feature/product-search-improvements

# Bug fix branch
git checkout -b fix/buyback-list-total-calculation

# Documentation branch
git checkout -b docs/update-api-integration
```

**Naming Convention**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

### 3. Development Loop

```
1. Write code
   ↓
2. Test in browser (http://localhost:4200/sa/en/...)
   ↓
3. Test RTL (http://localhost:4200/sa/ar/...)
   ↓
4. Run build (npm run build)
   ↓
5. Fix any errors
   ↓
6. Repeat
```

#### Hot Reload

Angular CLI provides hot module replacement (HMR):
- **TypeScript changes** → Component reload
- **SCSS changes** → Style reload
- **Template changes** → Template reload

No manual browser refresh needed!

### 4. Code Quality Checks

Before committing:

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Build to ensure no errors
npm run build
```

### 5. Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: Add IKEA Family discount toggle to buyback list

- Implemented toggle component
- Connected to offer calculation service
- Added translations for EN/AR
- Tested RTL layout

Closes #123"
```

**Commit Message Format**:
```
<type>: <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build/config changes

### 6. Push and Create Pull Request

```bash
# Push branch
git push origin feature/product-search-improvements

# Create PR on GitHub/GitLab
# - Add description
# - Link related issues
# - Request reviewers
# - Add labels
```

## Feature Development Workflow

### Step 1: Plan

1. **Read documentation** - Architecture, SOLID principles
2. **Understand requirements** - What needs to be built
3. **Design approach** - Component structure, state management
4. **Identify dependencies** - Services, models needed

### Step 2: Create Structure

```bash
# Generate page component
ng generate component features/my-feature/pages/my-page --standalone

# Generate service
ng generate service features/my-feature/services/my-service

# Generate model
ng generate class features/my-feature/models/my-model
```

### Step 3: Implement Base

1. **Extend BaseComponent**
```typescript
export class MyPageComponent extends BaseComponent implements OnInit {
  constructor() {
    super();
  }
}
```

2. **Add to routes**
```typescript
// app.routes.ts
{
  path: 'my-page',
  loadComponent: () => import('./features/my-feature/pages/my-page/my-page.component')
    .then(m => m.MyPageComponent)
}
```

3. **Add translations**
```typescript
// translations/en-sa.constants.ts
myFeature: {
  title: 'My Feature',
  description: 'Feature description'
}
```

### Step 4: Build Incrementally

1. **Start with UI** - Create template structure
2. **Add state** - Signals for reactive data
3. **Implement logic** - Business logic in models
4. **Connect services** - API calls, data management
5. **Add styles** - SCSS following guidelines
6. **Handle errors** - Error states and messages
7. **Add loading states** - SKAPA skeleton loaders

### Step 5: Test

1. **Test in English** - `/sa/en/my-page`
2. **Test in Arabic** - `/sa/ar/my-page`
3. **Test responsive** - Mobile, tablet, desktop
4. **Test edge cases** - Empty states, errors
5. **Test navigation** - To/from other pages

## Code Review Process

### Submitting for Review

**PR Checklist**:
- [ ] Code builds successfully
- [ ] No console errors or warnings
- [ ] Tested in EN and AR (LTR and RTL)
- [ ] Tested responsive breakpoints
- [ ] Code follows style guide
- [ ] Comments added where needed
- [ ] Translations added for all text
- [ ] Documentation updated (if needed)

### Reviewing Code

**Review Checklist**:
- [ ] Follows SOLID principles
- [ ] Uses signals correctly
- [ ] Extends BaseComponent/BaseModel
- [ ] Proper error handling
- [ ] RTL support implemented
- [ ] No hardcoded strings
- [ ] Uses SKAPA components
- [ ] SCSS follows guidelines
- [ ] No console.log statements left
- [ ] Security considerations addressed

### Addressing Feedback

```bash
# Make requested changes
git add .
git commit -m "refactor: Address PR feedback

- Extract validation to model
- Fix RTL margin issue
- Add error handling for API call"

git push origin feature/my-feature
```

## Testing Workflow

### Manual Testing

#### English (LTR)
```bash
# Start dev server
npm start

# Test URLs
http://localhost:4200/sa/en/search
http://localhost:4200/sa/en/categories
http://localhost:4200/sa/en/buyback-list
http://localhost:4200/sa/en/summary
http://localhost:4200/sa/en/confirmation
```

#### Arabic (RTL)
```bash
# Test Arabic versions
http://localhost:4200/sa/ar/search
http://localhost:4200/sa/ar/categories
http://localhost:4200/sa/ar/buyback-list
```

#### Responsive Testing

**Chrome DevTools**:
1. Open DevTools (F12)
2. Click device toolbar icon
3. Test breakpoints:
   - Mobile (320px, 375px, 414px)
   - Tablet (768px)
   - Desktop (1024px, 1440px)

### Testing Checklist

**For Each Feature**:
- [ ] Works in English (SA)
- [ ] Works in Arabic (SA)
- [ ] Works in English (BH)
- [ ] Works in Arabic (BH)
- [ ] Works on mobile
- [ ] Works on tablet
- [ ] Works on desktop
- [ ] Handles empty states
- [ ] Handles error states
- [ ] Handles loading states
- [ ] Navigation works correctly
- [ ] Data persists (if applicable)

## Build and Deploy Workflow

### Local Build

```bash
# Development build
npm run build

# Production build (Saudi Arabia)
ng build --configuration=sa-prod

# Production build (Bahrain)
ng build --configuration=bh-prod

# QA build
ng build --configuration=sa-qa
```

### Build Output

```
dist/buyback-portal/browser/
├── index.html
├── main-[hash].js
├── styles-[hash].css
├── polyfills-[hash].js
└── [lazy-chunks]
```

### Environment-Specific Builds

```bash
# For Saudi Arabia QA
ng build --configuration=sa-qa
# Uses: environment.sa-qa.ts
# Base URL: https://qa-api.ikea.sa

# For Bahrain Production
ng build --configuration=bh-prod
# Uses: environment.bh-prod.ts
# Base URL: https://api.ikea.bh
```

### Deploy to Environment

```bash
# Build for target environment
ng build --configuration=sa-prod

# Deploy built files (example with AWS S3)
aws s3 sync dist/buyback-portal/browser/ s3://ikea-buyback-sa-prod/

# Invalidate CDN cache (if using CloudFront)
aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
```

## Debugging Workflow

### Browser DevTools

#### Console Errors

```typescript
// Add debugging
console.log('Current state:', this.items());
console.log('Offer calculation:', this.offer());

// Use debugger
debugger; // Pauses execution

// Remove before committing!
```

#### Network Tab

- Check API calls
- Verify request/response
- Check headers
- Monitor loading times

#### Angular DevTools

Install Angular DevTools extension:
- View component tree
- Inspect signals
- Monitor change detection
- Profile performance

### Common Debugging Scenarios

#### Component Not Rendering

**Check**:
1. Is component in imports array?
2. Is selector correct?
3. Is route configured?
4. Check console for errors

#### Signals Not Updating

**Check**:
1. Using set() or update()?
2. Calling signal as function: `value()`?
3. Using computed correctly?

#### Styles Not Applying

**Check**:
1. SCSS import paths correct?
2. Class names correct?
3. Specificity issues?
4. Check browser DevTools → Elements → Styles

#### API Call Failing

**Check**:
1. Correct endpoint URL?
2. Network tab in DevTools
3. CORS issues?
4. Request headers correct?
5. Check API service configuration

## Performance Optimization

### During Development

```typescript
// Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Use trackBy in loops
@for (item of items(); track item.id) {
  <app-product-card [product]="item" />
}

// Lazy load routes
{
  path: 'search',
  loadComponent: () => import('./pages/search/search.component')
    .then(m => m.SearchComponent)
}

// Use computed for derived values
totalPrice = computed(() =>
  this.items().reduce((sum, item) => sum + item.price, 0)
);
```

### Build Optimization

```bash
# Production build is optimized by default
ng build --configuration=sa-prod

# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/buyback-portal/browser/stats.json
```

## Best Practices

### ✅ Do's

1. **Commit frequently** - Small, logical commits
2. **Write descriptive commit messages** - Explain why, not what
3. **Test before committing** - Build, test EN/AR
4. **Keep PRs focused** - One feature/fix per PR
5. **Update documentation** - Keep docs in sync
6. **Follow naming conventions** - Consistent patterns
7. **Use TypeScript types** - No `any`

### ❌ Don'ts

1. **Don't commit broken code** - Always build first
2. **Don't commit console.log** - Remove debugging
3. **Don't skip code review** - Always get review
4. **Don't ignore warnings** - Fix TypeScript warnings
5. **Don't hardcode values** - Use environment configs
6. **Don't skip RTL testing** - Always test Arabic
7. **Don't push directly to main** - Use feature branches

## Git Workflow

### Branch Strategy

```
main (production)
  ├── develop (integration)
  │   ├── feature/product-search
  │   ├── feature/buyback-list
  │   └── fix/offer-calculation
  └── hotfix/critical-bug
```

### Merging Strategy

```bash
# Update your branch with latest develop
git checkout develop
git pull origin develop
git checkout feature/my-feature
git merge develop

# Resolve conflicts if any
git add .
git commit -m "merge: Merge develop into feature/my-feature"

# Push and create PR
git push origin feature/my-feature
```

---

**Next**: [Coding Standards](./coding-standards.md)
