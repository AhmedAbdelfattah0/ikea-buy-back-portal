# Build Configurations

## Overview

The IKEA Buyback Portal supports multiple build configurations for different markets, environments, and languages. Each configuration uses the appropriate environment file and index.html template.

## Available Configurations

### Development

**Configuration**: `development`

```bash
npm start
# or
ng serve --configuration=development
```

**Details**:
- Environment: `environment.ts`
- Index: `src/index.html`
- Optimization: Disabled
- Source maps: Enabled
- Live reload: Enabled

**Use for**: Local development

---

### Saudi Arabia - Production

**English Configuration**: `sa-prod`

```bash
ng build --configuration=sa-prod
```

**Details**:
- Environment: `environment.sa-prod.ts`
- Index: `src/index.sa.html`
- ESI Header: `https://www.ikea.com/sa/en/header-footer/...`
- Language: English (`lang="en"`)
- Market: Saudi Arabia
- Currency: SAR (ر.س)

**Arabic Configuration**: `sa-prod-ar`

```bash
ng build --configuration=sa-prod-ar
```

**Details**:
- Environment: `environment.sa-prod.ts`
- Index: `src/index.sa.ar.html`
- ESI Header: `https://www.ikea.com/sa/ar/header-footer/...`
- Language: Arabic (`lang="ar"`)
- Direction: RTL
- Market: Saudi Arabia
- Currency: SAR (ر.س)

---

### Saudi Arabia - QA

**English Configuration**: `sa-qa`

```bash
ng build --configuration=sa-qa
```

**Details**:
- Environment: `environment.sa-qa.ts`
- Index: `src/index.sa.html`
- ESI Header: `https://www.ikea.com/sa/en/header-footer/...`
- Language: English
- Market: Saudi Arabia (QA environment)

**Arabic Configuration**: `sa-qa-ar`

```bash
ng build --configuration=sa-qa-ar
```

**Details**:
- Environment: `environment.sa-qa.ts`
- Index: `src/index.sa.ar.html`
- ESI Header: `https://www.ikea.com/sa/ar/header-footer/...`
- Language: Arabic
- Direction: RTL
- Market: Saudi Arabia (QA environment)

---

### Bahrain - Production

**English Configuration**: `bh-prod`

```bash
ng build --configuration=bh-prod
```

**Details**:
- Environment: `environment.bh-prod.ts`
- Index: `src/index.bh.html`
- ESI Header: `https://www.ikea.com/bh/en/header-footer/...`
- Language: English
- Market: Bahrain
- Currency: BHD (د.ب)

**Arabic Configuration**: `bh-prod-ar`

```bash
ng build --configuration=bh-prod-ar
```

**Details**:
- Environment: `environment.bh-prod.ts`
- Index: `src/index.bh.ar.html`
- ESI Header: `https://www.ikea.com/bh/ar/header-footer/...`
- Language: Arabic
- Direction: RTL
- Market: Bahrain
- Currency: BHD (د.ب)

---

### Bahrain - QA

**English Configuration**: `bh-qa`

```bash
ng build --configuration=bh-qa
```

**Details**:
- Environment: `environment.bh-qa.ts`
- Index: `src/index.bh.html`
- ESI Header: `https://www.ikea.com/bh/en/header-footer/...`
- Language: English
- Market: Bahrain (QA environment)

**Arabic Configuration**: `bh-qa-ar`

```bash
ng build --configuration=bh-qa-ar
```

**Details**:
- Environment: `environment.bh-qa.ts`
- Index: `src/index.bh.ar.html`
- ESI Header: `https://www.ikea.com/bh/ar/header-footer/...`
- Language: Arabic
- Direction: RTL
- Market: Bahrain (QA environment)

## Configuration Matrix

| Market | Environment | Language | Configuration | Index File        | Environment File       |
|--------|-------------|----------|---------------|-------------------|------------------------|
| SA     | Production  | English  | `sa-prod`     | `index.sa.html`   | `environment.sa-prod.ts` |
| SA     | Production  | Arabic   | `sa-prod-ar`  | `index.sa.ar.html`| `environment.sa-prod.ts` |
| SA     | QA          | English  | `sa-qa`       | `index.sa.html`   | `environment.sa-qa.ts`   |
| SA     | QA          | Arabic   | `sa-qa-ar`    | `index.sa.ar.html`| `environment.sa-qa.ts`   |
| BH     | Production  | English  | `bh-prod`     | `index.bh.html`   | `environment.bh-prod.ts` |
| BH     | Production  | Arabic   | `bh-prod-ar`  | `index.bh.ar.html`| `environment.bh-prod.ts` |
| BH     | QA          | English  | `bh-qa`       | `index.bh.html`   | `environment.bh-qa.ts`   |
| BH     | QA          | Arabic   | `bh-qa-ar`    | `index.bh.ar.html`| `environment.bh-qa.ts`   |

## Build Output

### Bundle Structure

After building, the output is generated in `dist/buyback-portal/browser/`:

```
dist/buyback-portal/browser/
├── index.html                    # Market/language specific
├── main-[hash].js                # Main application bundle
├── styles-[hash].css             # Global styles
├── chunk-[hash].js               # Shared chunks
├── confirmation-component-[hash].js    # Lazy loaded routes
├── search-component-[hash].js
├── buyback-list-component-[hash].js
├── summary-component-[hash].js
└── category-browse-component-[hash].js
```

### Bundle Sizes

**Initial Bundle** (~244 KB raw, ~67 KB gzipped):
- `main.js` - Application code
- `chunk.js` - Angular framework
- `styles.css` - Global styles

**Lazy Chunks** (~1-2 KB each):
- Each route component is lazy loaded
- Loaded on-demand when user navigates
- Improves initial page load time

## Build Optimization

### Production Optimizations

All production configurations include:

```json
{
  "optimization": true,        // Minification, tree-shaking
  "outputHashing": "all",      // Cache busting with hashes
  "sourceMap": false,          // No source maps in production
  "namedChunks": false,        // Smaller chunk names
  "aot": true,                 // Ahead-of-time compilation
  "extractLicenses": true      // Extract license info
}
```

### Bundle Budgets

Budget limits defined in `angular.json`:

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "500kB",
    "maximumError": "1MB"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "4kB",
    "maximumError": "8kB"
  }
]
```

**Warning**: Build warns if bundle exceeds 500KB
**Error**: Build fails if bundle exceeds 1MB

## Deployment Scripts

### Build All Configurations

```bash
#!/bin/bash
# build-all.sh

echo "Building all configurations..."

# Saudi Arabia
ng build --configuration=sa-prod
ng build --configuration=sa-prod-ar
ng build --configuration=sa-qa
ng build --configuration=sa-qa-ar

# Bahrain
ng build --configuration=bh-prod
ng build --configuration=bh-prod-ar
ng build --configuration=bh-qa
ng build --configuration=bh-qa-ar

echo "All builds completed!"
```

### Deploy Script Example

```bash
#!/bin/bash
# deploy-sa-prod.sh

# Build both English and Arabic
ng build --configuration=sa-prod
mv dist/buyback-portal dist/sa-en

ng build --configuration=sa-prod-ar
mv dist/buyback-portal dist/sa-ar

# Deploy to S3 or CDN
aws s3 sync dist/sa-en/browser/ s3://ikea-buyback-sa-prod/en/
aws s3 sync dist/sa-ar/browser/ s3://ikea-buyback-sa-prod/ar/

# Invalidate CDN cache
aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
```

## Environment-Specific Settings

### API Base URLs

| Environment | Market | Base URL |
|-------------|--------|----------|
| Development | - | `http://localhost:3000` |
| QA | SA | `https://qa-api.ikea.sa` |
| QA | BH | `https://qa-api.ikea.bh` |
| Production | SA | `https://api.ikea.sa` |
| Production | BH | `https://api.ikea.bh` |

### Feature Flags

Environment files can include feature flags:

```typescript
export const environment = {
  production: true,
  market: 'sa',
  features: {
    enableNewSearch: true,
    enableBulkUpload: false,
    maxBuybackItems: 50
  }
};
```

## Build Performance

### Tips for Faster Builds

1. **Use development mode** for local development:
```bash
npm start  # Faster than production builds
```

2. **Build specific configuration**:
```bash
ng build --configuration=sa-prod  # Only what you need
```

3. **Use build cache**:
```bash
# Angular caches builds in .angular/cache
# Don't delete unless troubleshooting
```

4. **Parallel builds** (if deploying multiple):
```bash
# Build in parallel using background jobs
ng build --configuration=sa-prod &
ng build --configuration=bh-prod &
wait
```

## Verifying Builds

### Check Build Output

```bash
# After building
ls -lh dist/buyback-portal/browser/

# Check index.html has correct ESI includes
cat dist/buyback-portal/browser/index.html | grep esi:include

# Verify bundle sizes
du -sh dist/buyback-portal/browser/*.js
```

### Test Built Application Locally

```bash
# Install http-server
npm install -g http-server

# Serve built files
cd dist/buyback-portal/browser
http-server -p 8080

# Navigate to:
# http://localhost:8080
```

**Note**: ESI includes won't work, but you can verify the application loads.

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/deploy-sa-prod.yml
name: Deploy SA Production

on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build SA English
        run: ng build --configuration=sa-prod

      - name: Deploy SA English
        run: |
          # Deploy to S3/CDN
          aws s3 sync dist/buyback-portal/browser/ s3://bucket/

      - name: Build SA Arabic
        run: ng build --configuration=sa-prod-ar

      - name: Deploy SA Arabic
        run: |
          # Deploy to S3/CDN
          aws s3 sync dist/buyback-portal/browser/ s3://bucket-ar/
```

## Troubleshooting Builds

### Build fails with memory error

```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 ng build --configuration=sa-prod
```

### Build slow

```bash
# Clear Angular cache
rm -rf .angular
ng build --configuration=sa-prod
```

### Wrong environment loaded

```bash
# Verify file replacement
cat angular.json | grep -A 5 "sa-prod"

# Check environment file exists
ls -la src/environments/environment.sa-prod.ts
```

---

**Next**: [Deployment Guide](./deployment-guide.md)
