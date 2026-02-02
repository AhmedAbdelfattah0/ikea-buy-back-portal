# Build Scripts Reference

## Overview

The IKEA Buyback Portal includes npm scripts for building all market/environment/language combinations. Each script sets the correct `base-href` and uses the appropriate build configuration.

## Available Build Scripts

### Saudi Arabia

#### Production

```bash
# English
npm run sa-prod
# Output: /sa/en/buyback/ base-href
# Environment: environment.sa-prod.ts
# Index: index.sa.html

# Arabic
npm run sa-prod-ar
# Output: /sa/ar/buyback/ base-href
# Environment: environment.sa-prod.ts
# Index: index.sa.ar.html
```

#### QA

```bash
# English
npm run sa-qa
# Output: /sa/en/buyback/ base-href
# Environment: environment.sa-qa.ts
# Index: index.sa.html

# Arabic
npm run sa-qa-ar
# Output: /sa/ar/buyback/ base-href
# Environment: environment.sa-qa.ts
# Index: index.sa.ar.html
```

---

### Bahrain

#### Production

```bash
# English
npm run bh-prod
# Output: /bh/en/buyback/ base-href
# Environment: environment.bh-prod.ts
# Index: index.bh.html

# Arabic
npm run bh-prod-ar
# Output: /bh/ar/buyback/ base-href
# Environment: environment.bh-prod.ts
# Index: index.bh.ar.html
```

#### QA

```bash
# English
npm run bh-qa
# Output: /bh/en/buyback/ base-href
# Environment: environment.bh-qa.ts
# Index: index.bh.html

# Arabic
npm run bh-qa-ar
# Output: /bh/ar/buyback/ base-href
# Environment: environment.bh-qa.ts
# Index: index.bh.ar.html
```

---

### Development

```bash
# Start development server
npm start
# or
npm run start

# Build with development configuration
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch
```

## Script Details

### Base HREF

Each build script sets the `base-href` to match the deployed URL structure:

```
/{market}/{language}/buyback/
```

Examples:
- `/sa/en/buyback/` - Saudi Arabia English
- `/sa/ar/buyback/` - Saudi Arabia Arabic
- `/bh/en/buyback/` - Bahrain English
- `/bh/ar/buyback/` - Bahrain Arabic

### Build Configuration

The `-c` or `--configuration` flag specifies which angular.json configuration to use:

```bash
npm run sa-prod
# Executes: ng build --base-href=/sa/en/buyback/ --c=sa-prod
```

This configuration determines:
- Which environment file to use
- Which index.html file to use
- Optimization settings (minification, AOT, etc.)

## Build Output

All builds output to: `dist/buyback-portal/browser/`

### Output Structure

```
dist/buyback-portal/browser/
├── index.html                    # Market/language specific
├── main-[hash].js                # Main application bundle (~117 KB)
├── chunk-[hash].js               # Framework chunk (~118 KB)
├── styles-[hash].css             # Global styles (~8.5 KB)
└── [lazy-chunks].js              # Route components (~1 KB each)
```

### Bundle Sizes

**Initial Bundle**: ~244 KB raw, ~67 KB gzipped
- Framework and app code
- Global styles

**Lazy Chunks**: ~1 KB each
- Search page
- Category browse page
- Buyback list page
- Summary page
- Confirmation page

## Usage Examples

### Build for Saudi Production

```bash
# Build English version
npm run sa-prod

# Build Arabic version
npm run sa-prod-ar

# Or build both sequentially
npm run sa-prod && npm run sa-prod-ar
```

### Build All Configurations

```bash
# Build all 8 configurations
npm run sa-qa && \
npm run sa-qa-ar && \
npm run sa-prod && \
npm run sa-prod-ar && \
npm run bh-qa && \
npm run bh-qa-ar && \
npm run bh-prod && \
npm run bh-prod-ar
```

### Build Script for CI/CD

```bash
#!/bin/bash
# build-all.sh

echo "Building all configurations..."

# Saudi Arabia
npm run sa-prod
npm run sa-prod-ar
npm run sa-qa
npm run sa-qa-ar

# Bahrain
npm run bh-prod
npm run bh-prod-ar
npm run bh-qa
npm run bh-qa-ar

echo "All builds completed!"
```

## Deployment Workflow

### 1. Build

```bash
# Build for target environment
npm run sa-prod
```

### 2. Verify Output

```bash
# Check build output
ls -lh dist/buyback-portal/browser/

# Verify base-href
cat dist/buyback-portal/browser/index.html | grep "base href"

# Verify ESI includes
cat dist/buyback-portal/browser/index.html | grep "esi:include"
```

### 3. Deploy

```bash
# Example: Deploy to S3
aws s3 sync dist/buyback-portal/browser/ s3://ikea-buyback-sa-prod/en/

# Example: Deploy to server
scp -r dist/buyback-portal/browser/* user@server:/var/www/buyback/sa/en/
```

## Build Verification Checklist

After running a build script, verify:

- [ ] Build completed without errors
- [ ] Output directory exists: `dist/buyback-portal/browser/`
- [ ] `index.html` has correct `base href` (e.g., `/sa/en/buyback/`)
- [ ] `index.html` has correct `lang` attribute (e.g., `lang="ar"` for Arabic)
- [ ] ESI includes point to correct market/language
- [ ] Bundle sizes are within limits (~250 KB total)
- [ ] Lazy chunks are generated for each route

## Troubleshooting

### Build fails

```bash
# Clear cache and retry
rm -rf .angular dist node_modules
npm install
npm run sa-prod
```

### Wrong base-href in output

Check package.json script:
```json
"sa-prod": "ng build --base-href=/sa/en/buyback/ --c=sa-prod"
                                    ^^^^^^^^^^^ Must match deployment path
```

### Wrong language in index.html

Check angular.json configuration:
```json
"sa-prod-ar": {
  "index": {
    "input": "src/index.sa.ar.html"  // Must use Arabic index file
  }
}
```

### Build succeeds but ESI headers missing

This is expected in local build. ESI includes are processed by the CDN/server in production.

To verify ESI includes exist:
```bash
cat dist/buyback-portal/browser/index.html | grep "esi:include"
```

## Performance Tips

### Parallel Builds

Build multiple configurations in parallel:

```bash
# Using background jobs (macOS/Linux)
npm run sa-prod & npm run bh-prod & wait

# Using parallel command (if installed)
parallel ::: "npm run sa-prod" "npm run bh-prod"
```

### Incremental Builds

During development, use watch mode:

```bash
npm run watch
# Auto-rebuilds on file changes
```

### Build Cache

Angular CLI caches builds in `.angular/cache/`. Don't delete unless troubleshooting.

## Complete Script Reference

| Script | Command | Market | Lang | Env | Base HREF |
|--------|---------|--------|------|-----|-----------|
| `sa-prod` | `ng build --base-href=/sa/en/buyback/ --c=sa-prod` | SA | EN | Prod | /sa/en/buyback/ |
| `sa-prod-ar` | `ng build --base-href=/sa/ar/buyback/ --c=sa-prod-ar` | SA | AR | Prod | /sa/ar/buyback/ |
| `sa-qa` | `ng build --base-href=/sa/en/buyback/ --c=sa-qa` | SA | EN | QA | /sa/en/buyback/ |
| `sa-qa-ar` | `ng build --base-href=/sa/ar/buyback/ --c=sa-qa-ar` | SA | AR | QA | /sa/ar/buyback/ |
| `bh-prod` | `ng build --base-href=/bh/en/buyback/ --c=bh-prod` | BH | EN | Prod | /bh/en/buyback/ |
| `bh-prod-ar` | `ng build --base-href=/bh/ar/buyback/ --c=bh-prod-ar` | BH | AR | Prod | /bh/ar/buyback/ |
| `bh-qa` | `ng build --base-href=/bh/en/buyback/ --c=bh-qa` | BH | EN | QA | /bh/en/buyback/ |
| `bh-qa-ar` | `ng build --base-href=/bh/ar/buyback/ --c=bh-qa-ar` | BH | AR | QA | /bh/ar/buyback/ |

## Adding New Market

To add support for a new market (e.g., Kuwait):

### 1. Create index files
```bash
touch src/index.kw.html
touch src/index.kw.ar.html
```

### 2. Add angular.json configurations
```json
"kw-prod": { /* config */ },
"kw-prod-ar": { /* config */ }
```

### 3. Add npm scripts
```json
"kw-prod": "ng build --base-href=/kw/en/buyback/ --c=kw-prod",
"kw-prod-ar": "ng build --base-href=/kw/ar/buyback/ --c=kw-prod-ar"
```

### 4. Create environment files
```bash
touch src/environments/environment.kw-prod.ts
touch src/environments/environment.kw-qa.ts
```

## Additional Scripts

```bash
# Run tests
npm test

# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint
```

---

**For detailed build configuration documentation, see**: [docs/07-deployment/build-configurations.md](docs/07-deployment/build-configurations.md)

**For ESI integration details, see**: [docs/01-architecture/esi-integration.md](docs/01-architecture/esi-integration.md)
