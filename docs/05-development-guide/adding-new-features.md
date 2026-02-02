# Adding New Features

## Overview

This guide provides a step-by-step process for adding new features to the IKEA Buyback Portal. Following this workflow ensures consistency, maintainability, and adherence to the project's architectural principles.

## Before You Start

### 1. Understand Requirements

- **Read the feature specification** - Understand what needs to be built
- **Identify affected areas** - Which features/services will be impacted
- **Check dependencies** - What existing services/components can be reused
- **Plan data flow** - How data moves through the application
- **Consider edge cases** - Empty states, errors, loading states

### 2. Review Existing Code

- **Similar features** - Look for patterns to follow
- **Shared components** - What can be reused
- **Services** - Existing services that might help
- **Models** - Similar business logic patterns

### 3. Design Approach

- **Component structure** - Which components are needed
- **State management** - Where state lives (component vs service)
- **API integration** - What endpoints are needed
- **Navigation** - How users reach this feature

## Step-by-Step Guide

### Step 1: Create Feature Structure

#### Generate Feature Folder

```bash
# Navigate to features directory
cd src/app/features

# Create feature folder structure
mkdir -p my-feature/{pages,components,services,models}
```

#### Folder Structure

```
src/app/features/my-feature/
├── pages/                    # Page components
│   └── my-page/
│       ├── my-page.component.ts
│       ├── my-page.component.html
│       └── my-page.component.scss
├── components/               # Feature-specific components
│   └── my-component/
│       ├── my-component.component.ts
│       ├── my-component.component.html
│       └── my-component.component.scss
├── services/                 # Feature services
│   └── my-feature.service.ts
└── models/                   # Feature models
    └── my-feature.model.ts
```

### Step 2: Create Models

Start with TypeScript interfaces and models for your feature.

#### Create Interface

```typescript
// src/app/features/my-feature/models/my-feature.interface.ts
export interface MyFeatureData {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MyFeatureConfig {
  maxItems: number;
  allowDuplicates: boolean;
  defaultSortOrder: 'asc' | 'desc';
}
```

#### Create Model Class

```typescript
// src/app/features/my-feature/models/my-feature.model.ts
import { BaseModel } from '../../../shared/base-classes/base.model';
import { MyFeatureData } from './my-feature.interface';

export class MyFeatureModel extends BaseModel {
  private data: MyFeatureData;

  constructor(data: MyFeatureData) {
    super();
    this.data = data;
  }

  // Business logic methods
  isValid(): boolean {
    return this.data.name.length > 0;
  }

  formatForDisplay(): string {
    return `${this.data.name} - ${this.utility.formatDate(this.data.createdAt)}`;
  }

  calculateSomething(): number {
    // Business logic here
    return 0;
  }

  // Getters
  get id(): string {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  // Convert to API format
  toApiFormat(): Record<string, unknown> {
    return {
      id: this.data.id,
      name: this.data.name,
      description: this.data.description,
      created_at: this.data.createdAt.toISOString(),
      updated_at: this.data.updatedAt.toISOString()
    };
  }
}
```

### Step 3: Create Service

Create a service to manage feature state and API calls.

```typescript
// src/app/features/my-feature/services/my-feature.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatastoreService } from '../../../core/services/datastore.service';
import { APIService } from '../../../core/services/api.service';
import { MyFeatureData } from '../models/my-feature.interface';
import { MyFeatureModel } from '../models/my-feature.model';

@Injectable({ providedIn: 'root' })
export class MyFeatureService {
  // Private state
  private _items = signal<MyFeatureModel[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly state
  readonly items = this._items.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed values
  readonly itemCount = computed(() => this._items().length);
  readonly hasItems = computed(() => this.itemCount() > 0);
  readonly validItems = computed(() =>
    this._items().filter(item => item.isValid())
  );

  constructor(
    private http: HttpClient,
    private datastore: DatastoreService,
    private api: APIService
  ) {
    this.loadFromStorage();
  }

  // Load items from API
  loadItems(): Observable<MyFeatureData[]> {
    this._isLoading.set(true);
    this._error.set(null);

    return new Observable(observer => {
      this.http.get<MyFeatureData[]>(this.api.endpoints.myFeature.list)
        .subscribe({
          next: (data) => {
            const models = data.map(item => new MyFeatureModel(item));
            this._items.set(models);
            this.saveToStorage();
            this._isLoading.set(false);
            observer.next(data);
            observer.complete();
          },
          error: (error) => {
            this._error.set('Failed to load items');
            this._isLoading.set(false);
            observer.error(error);
          }
        });
    });
  }

  // Add item
  addItem(data: MyFeatureData): void {
    const newItem = new MyFeatureModel(data);
    this._items.update(items => [...items, newItem]);
    this.saveToStorage();
  }

  // Update item
  updateItem(id: string, updates: Partial<MyFeatureData>): void {
    this._items.update(items =>
      items.map(item => {
        if (item.id === id) {
          const updatedData = { ...item, ...updates };
          return new MyFeatureModel(updatedData as MyFeatureData);
        }
        return item;
      })
    );
    this.saveToStorage();
  }

  // Remove item
  removeItem(id: string): void {
    this._items.update(items => items.filter(item => item.id !== id));
    this.saveToStorage();
  }

  // Clear all items
  clearAll(): void {
    this._items.set([]);
    this.datastore.remove('myFeatureItems');
  }

  // Get item by ID
  getItemById(id: string): MyFeatureModel | undefined {
    return this._items().find(item => item.id === id);
  }

  // Private storage methods
  private saveToStorage(): void {
    try {
      this.datastore.set('myFeatureItems', this._items());
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = this.datastore.get<MyFeatureData[]>('myFeatureItems');
      if (stored) {
        const models = stored.map(item => new MyFeatureModel(item));
        this._items.set(models);
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  }
}
```

### Step 4: Create Components

#### Page Component

```typescript
// src/app/features/my-feature/pages/my-page/my-page.component.ts
import { Component, OnInit, signal, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../shared/base-classes/base.component';
import { MyFeatureService } from '../../services/my-feature.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { MyComponentComponent } from '../../components/my-component/my-component.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [CommonModule, MyComponentComponent],
  templateUrl: './my-page.component.html',
  styleUrl: './my-page.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyPageComponent extends BaseComponent implements OnInit {
  // State
  items = computed(() => this.featureService.items());
  isLoading = computed(() => this.featureService.isLoading());
  error = computed(() => this.featureService.error());

  // Translations
  translations = computed(() => this.locale.translations());

  // Local state
  selectedItemId = signal<string | null>(null);

  constructor(
    private featureService: MyFeatureService,
    private locale: LocaleService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadItems();
  }

  // Load items from API
  loadItems(): void {
    this.featureService.loadItems()
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe({
        error: (error) => {
          console.error('Failed to load items:', error);
        }
      });
  }

  // Handle item selection
  onItemSelected(id: string): void {
    this.selectedItemId.set(id);
  }

  // Handle item deletion
  onDeleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.featureService.removeItem(id);
    }
  }

  // Navigate to detail page (example)
  viewItemDetails(id: string): void {
    // Navigate to detail page
    // this.router.navigate(['/my-feature/detail', id]);
  }
}
```

#### Page Template

```html
<!-- src/app/features/my-feature/pages/my-page/my-page.component.html -->
<div class="my-page">
  <div class="my-page__header">
    <h1>{{ translations().myFeature.title }}</h1>
    <skapa-button variant="primary" (click)="loadItems()">
      {{ translations().common.refresh }}
    </skapa-button>
  </div>

  @if (isLoading()) {
    <!-- Loading state -->
    <div class="my-page__loading">
      <skapa-skeleton variant="card"></skapa-skeleton>
      <skapa-skeleton variant="card"></skapa-skeleton>
      <skapa-skeleton variant="card"></skapa-skeleton>
    </div>
  } @else if (error()) {
    <!-- Error state -->
    <app-error-message [message]="error() || ''"></app-error-message>
  } @else if (items().length === 0) {
    <!-- Empty state -->
    <app-empty-state
      icon="information-circle"
      [title]="translations().myFeature.emptyTitle"
      [description]="translations().myFeature.emptyDescription"
      [actionLabel]="translations().myFeature.addNew"
      (action)="loadItems()">
    </app-empty-state>
  } @else {
    <!-- Items list -->
    <div class="my-page__items">
      @for (item of items(); track item.id) {
        <app-my-component
          [item]="item"
          [isSelected]="selectedItemId() === item.id"
          (selected)="onItemSelected(item.id)"
          (delete)="onDeleteItem(item.id)">
        </app-my-component>
      }
    </div>
  }
</div>
```

#### Page Styles

```scss
// src/app/features/my-feature/pages/my-page/my-page.component.scss
@use '../../../../../../assets/global/variables' as *;
@use '../../../../../../assets/global/mixins' as *;

.my-page {
  padding: $spacing-lg;

  &__header {
    @include flex-between;
    margin-bottom: $spacing-lg;

    h1 {
      @include heading-1;
    }
  }

  &__loading {
    display: grid;
    gap: $spacing-md;
  }

  &__items {
    display: grid;
    gap: $spacing-md;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

    @include responsive(tablet) {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }

    @include responsive(desktop) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
```

#### Feature Component

```typescript
// src/app/features/my-feature/components/my-component/my-component.component.ts
import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFeatureModel } from '../../models/my-feature.model';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-component.component.html',
  styleUrl: './my-component.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyComponentComponent {
  @Input() item!: MyFeatureModel;
  @Input() isSelected: boolean = false;

  @Output() selected = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onSelect(): void {
    this.selected.emit();
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit();
  }
}
```

### Step 5: Add Translations

Update translation files for all supported locales.

```typescript
// src/app/shared/constants/translations/en-sa.constants.ts
export const EN_SA_TRANSLATIONS = {
  // ... existing translations
  myFeature: {
    title: 'My Feature',
    emptyTitle: 'No items yet',
    emptyDescription: 'Start by adding your first item',
    addNew: 'Add New Item',
    itemName: 'Item Name',
    itemDescription: 'Description',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit'
  }
};

// src/app/shared/constants/translations/ar-sa.constants.ts
export const AR_SA_TRANSLATIONS = {
  // ... existing translations
  myFeature: {
    title: 'ميزتي',
    emptyTitle: 'لا توجد عناصر حتى الآن',
    emptyDescription: 'ابدأ بإضافة العنصر الأول',
    addNew: 'إضافة عنصر جديد',
    itemName: 'اسم العنصر',
    itemDescription: 'الوصف',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل'
  }
};
```

Repeat for `en-bh.constants.ts` and `ar-bh.constants.ts`.

### Step 6: Add Routes

Update the routing configuration.

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // ... existing routes
      {
        path: 'my-feature',
        loadComponent: () => import('./features/my-feature/pages/my-page/my-page.component')
          .then(m => m.MyPageComponent),
        title: 'My Feature'
      }
    ]
  }
];
```

### Step 7: Add API Endpoints

Update the API service with new endpoints.

```typescript
// src/app/core/services/api.service.ts
@Injectable({ providedIn: 'root' })
export class APIService {
  private baseUrl = environment.apiBaseUrl;

  readonly endpoints = {
    // ... existing endpoints
    myFeature: {
      list: `${this.baseUrl}/api/my-feature`,
      detail: (id: string) => `${this.baseUrl}/api/my-feature/${id}`,
      create: `${this.baseUrl}/api/my-feature`,
      update: (id: string) => `${this.baseUrl}/api/my-feature/${id}`,
      delete: (id: string) => `${this.baseUrl}/api/my-feature/${id}`
    }
  };
}
```

### Step 8: Create Mock Service (Optional)

For development without backend, create a mock service.

```typescript
// src/app/features/my-feature/services/my-feature-mock.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { MyFeatureData } from '../models/my-feature.interface';

@Injectable({ providedIn: 'root' })
export class MyFeatureMockService {
  private mockData: MyFeatureData[] = [
    {
      id: '1',
      name: 'Sample Item 1',
      description: 'This is a sample item',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Sample Item 2',
      description: 'Another sample item',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  getAll(): Observable<MyFeatureData[]> {
    return of(this.mockData).pipe(delay(500));
  }

  getById(id: string): Observable<MyFeatureData | undefined> {
    const item = this.mockData.find(i => i.id === id);
    return of(item).pipe(delay(300));
  }

  create(data: Omit<MyFeatureData, 'id'>): Observable<MyFeatureData> {
    const newItem: MyFeatureData = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockData.push(newItem);
    return of(newItem).pipe(delay(500));
  }

  update(id: string, updates: Partial<MyFeatureData>): Observable<MyFeatureData | null> {
    const index = this.mockData.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockData[index] = {
        ...this.mockData[index],
        ...updates,
        updatedAt: new Date()
      };
      return of(this.mockData[index]).pipe(delay(500));
    }
    return of(null);
  }

  delete(id: string): Observable<boolean> {
    const index = this.mockData.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockData.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false);
  }
}
```

### Step 9: Add Navigation (Optional)

If your feature needs a navigation link, update the header component.

```html
<!-- src/app/layouts/main-layout/header/header.component.html -->
<nav>
  <!-- ... existing navigation -->
  <a [routerLink]="['/my-feature']" routerLinkActive="active">
    {{ translations().myFeature.title }}
  </a>
</nav>
```

### Step 10: Test Your Feature

#### Manual Testing Checklist

- [ ] **English (SA)** - Test at `/sa/en/my-feature`
- [ ] **Arabic (SA)** - Test at `/sa/ar/my-feature`
- [ ] **English (BH)** - Test at `/bh/en/my-feature`
- [ ] **Arabic (BH)** - Test at `/bh/ar/my-feature`
- [ ] **Mobile view** - Test responsive layout
- [ ] **Tablet view** - Test responsive layout
- [ ] **Desktop view** - Test responsive layout
- [ ] **Loading state** - Verify skeleton loaders
- [ ] **Empty state** - Verify empty state display
- [ ] **Error state** - Verify error handling
- [ ] **RTL support** - Verify Arabic layout
- [ ] **Navigation** - Verify routing works
- [ ] **Data persistence** - Verify localStorage works

#### Testing Commands

```bash
# Start development server
npm start

# Navigate to feature
# http://localhost:4200/sa/en/my-feature

# Build to check for errors
npm run build
```

## Advanced Patterns

### Form Handling

```typescript
// Component with form
export class MyFormComponent extends BaseComponent {
  formData = signal({
    name: '',
    description: ''
  });

  errors = signal<Record<string, string>>({});

  updateField(field: string, value: string): void {
    this.formData.update(data => ({
      ...data,
      [field]: value
    }));
    this.validateField(field);
  }

  validateField(field: string): void {
    const data = this.formData();
    const newErrors = { ...this.errors() };

    if (field === 'name' && !data.name) {
      newErrors.name = 'Name is required';
    } else {
      delete newErrors.name;
    }

    this.errors.set(newErrors);
  }

  onSubmit(): void {
    if (this.isValid()) {
      // Submit form
    }
  }

  isValid(): boolean {
    return Object.keys(this.errors()).length === 0;
  }
}
```

### Pagination

```typescript
// Service with pagination
export class MyFeatureService {
  private _page = signal<number>(1);
  private _pageSize = signal<number>(20);
  private _totalItems = signal<number>(0);

  readonly currentPage = this._page.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly totalPages = computed(() =>
    Math.ceil(this._totalItems() / this._pageSize())
  );

  loadPage(page: number): void {
    this._page.set(page);
    this.loadItems();
  }

  nextPage(): void {
    if (this._page() < this.totalPages()) {
      this.loadPage(this._page() + 1);
    }
  }

  previousPage(): void {
    if (this._page() > 1) {
      this.loadPage(this._page() - 1);
    }
  }
}
```

### Filtering

```typescript
// Component with filtering
export class MyPageComponent extends BaseComponent {
  searchQuery = signal<string>('');
  selectedCategory = signal<string | null>(null);

  filteredItems = computed(() => {
    let items = this.featureService.items();

    // Filter by search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(query)
      );
    }

    // Filter by category
    const category = this.selectedCategory();
    if (category) {
      items = items.filter(item => item.category === category);
    }

    return items;
  });

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onCategoryChange(category: string | null): void {
    this.selectedCategory.set(category);
  }
}
```

### Sorting

```typescript
// Component with sorting
export class MyPageComponent extends BaseComponent {
  sortField = signal<string>('name');
  sortOrder = signal<'asc' | 'desc'>('asc');

  sortedItems = computed(() => {
    const items = [...this.featureService.items()];
    const field = this.sortField();
    const order = this.sortOrder();

    return items.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  });

  onSortChange(field: string): void {
    if (this.sortField() === field) {
      // Toggle order
      this.sortOrder.update(order => order === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortOrder.set('asc');
    }
  }
}
```

## Best Practices

### ✅ Do's

1. **Follow naming conventions** - Kebab-case for files, PascalCase for classes
2. **Extend BaseComponent** - Always extend for subscription cleanup
3. **Use signals for state** - Reactive and performant
4. **Separate concerns** - Components (UI) + Models (Logic) + Services (Data)
5. **Handle all states** - Loading, empty, error, success
6. **Support RTL** - Use logical properties (margin-inline-start)
7. **Add translations** - For all supported locales
8. **Test all locales** - EN/AR for SA and BH
9. **Use SKAPA components** - Follow design system
10. **Document your code** - Add comments for complex logic

### ❌ Don'ts

1. **Don't mutate signals directly** - Use set() and update()
2. **Don't forget error handling** - Always handle API errors
3. **Don't skip empty states** - Always show helpful empty states
4. **Don't hardcode strings** - Use translation system
5. **Don't use left/right** - Use logical properties for RTL
6. **Don't forget loading states** - Use SKAPA skeleton loaders
7. **Don't skip TypeScript types** - Always specify types
8. **Don't create inline templates** - Use separate HTML files
9. **Don't leave console.log** - Remove debugging code
10. **Don't forget takeUntil** - Prevent memory leaks

## Troubleshooting

### Common Issues

**Issue**: Component not rendering
- Check if component is imported in parent
- Check if selector is correct
- Check for console errors

**Issue**: Signals not updating
- Make sure you're calling signal as function: `mySignal()`
- Use set() or update() to change signal values
- Check if computed dependencies are correct

**Issue**: Translations not showing
- Verify translation keys exist in all locale files
- Check LocaleService is injected correctly
- Verify market/language is correct in URL

**Issue**: Styles not applying
- Check SCSS import paths
- Verify class names match template
- Check for specificity issues

**Issue**: API calls failing
- Check API endpoint configuration
- Verify environment configuration
- Check network tab in DevTools
- Verify interceptors are configured

## Documentation

After adding your feature, update documentation:

1. **Create feature documentation** - `docs/03-features/my-feature.md`
2. **Update README.md** - Add feature to list
3. **Update folder-structure.md** - Document new folders
4. **Add API documentation** - Document endpoints
5. **Add usage examples** - Show how to use the feature

## Example: Complete Feature Checklist

- [ ] Created feature folder structure
- [ ] Created TypeScript interfaces
- [ ] Created model classes with business logic
- [ ] Created service with signal-based state
- [ ] Created page component
- [ ] Created feature components
- [ ] Created component templates
- [ ] Created component styles
- [ ] Added translations for all locales (en-sa, ar-sa, en-bh, ar-bh)
- [ ] Added routes
- [ ] Added API endpoints
- [ ] Created mock service (if needed)
- [ ] Tested in English (SA)
- [ ] Tested in Arabic (SA)
- [ ] Tested in English (BH)
- [ ] Tested in Arabic (BH)
- [ ] Tested responsive (mobile, tablet, desktop)
- [ ] Tested RTL layout
- [ ] Handled loading state
- [ ] Handled empty state
- [ ] Handled error state
- [ ] Added navigation (if needed)
- [ ] Build succeeds without errors
- [ ] Created feature documentation
- [ ] Updated project documentation

---

**Next**: [Troubleshooting](./troubleshooting.md)
