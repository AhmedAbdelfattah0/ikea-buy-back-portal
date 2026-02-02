import { Injectable, signal, computed } from '@angular/core';
import { Category } from '../../../shared/interfaces/product.interface';

/**
 * Category Service
 * Manages category navigation state and provides category data
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Private state
  private _categories = signal<Category[]>([]);
  private _selectedCategory = signal<Category | null>(null);
  private _expandedCategoryIds = signal<Set<string>>(new Set());

  // Public readonly signals
  readonly categories = this._categories.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();
  readonly expandedCategoryIds = this._expandedCategoryIds.asReadonly();

  // Computed signals
  readonly rootCategories = computed(() =>
    this._categories().filter(cat => cat.level === 1)
  );

  readonly selectedCategoryPath = computed(() => {
    const selected = this._selectedCategory();
    if (!selected) return [];

    const path: Category[] = [selected];
    let current = selected;

    while (current.parentId) {
      const parent = this._categories().find(c => c.id === current.parentId);
      if (parent) {
        path.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }

    return path;
  });

  constructor() {
    this.loadMockCategories();
  }

  /**
   * Select a category
   */
  selectCategory(category: Category | null): void {
    this._selectedCategory.set(category);
  }

  /**
   * Toggle category expansion
   */
  toggleCategoryExpansion(categoryId: string): void {
    this._expandedCategoryIds.update(expanded => {
      const newSet = new Set(expanded);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }

  /**
   * Expand a category
   */
  expandCategory(categoryId: string): void {
    this._expandedCategoryIds.update(expanded => {
      const newSet = new Set(expanded);
      newSet.add(categoryId);
      return newSet;
    });
  }

  /**
   * Collapse a category
   */
  collapseCategory(categoryId: string): void {
    this._expandedCategoryIds.update(expanded => {
      const newSet = new Set(expanded);
      newSet.delete(categoryId);
      return newSet;
    });
  }

  /**
   * Get children of a category
   */
  getChildren(parentId: string): Category[] {
    return this._categories().filter(cat => cat.parentId === parentId);
  }

  /**
   * Check if category is expanded
   */
  isCategoryExpanded(categoryId: string): boolean {
    return this._expandedCategoryIds().has(categoryId);
  }

  /**
   * Load mock categories (will be replaced with API call)
   */
  private loadMockCategories(): void {
    const mockCategories: Category[] = [
      // Level 1 - Main categories
      { id: '1', name: 'Decoration', parentId: null, level: 1, productCount: 45 },
      { id: '2', name: 'Outdoor', parentId: null, level: 1, productCount: 23 },
      { id: '3', name: 'Home organization', parentId: null, level: 1, productCount: 67 },
      { id: '4', name: 'Store and organize furniture', parentId: null, level: 1, productCount: 34 },
      { id: '5', name: 'Kitchen', parentId: null, level: 1, productCount: 89 },
      { id: '6', name: "Children's IKEA", parentId: null, level: 1, productCount: 56 },
      { id: '7', name: 'Dining', parentId: null, level: 1, productCount: 42 },
      { id: '8', name: 'Workspaces', parentId: null, level: 1, productCount: 38 },
      { id: '9', name: 'Bedroom furniture', parentId: null, level: 1, productCount: 51 },
      { id: '10', name: 'Bathroom & Water', parentId: null, level: 1, productCount: 29 },
      { id: '11', name: 'Beds & Mattresses', parentId: null, level: 1, productCount: 33 },
      { id: '12', name: 'Living room seating', parentId: null, level: 1, productCount: 44 },

      // Level 2 - Subcategories under Decoration
      { id: '1-1', name: 'Green decoration', parentId: '1', level: 2, productCount: 15 },
      { id: '1-2', name: 'Home decoration', parentId: '1', level: 2, productCount: 18 },
      { id: '1-3', name: 'Wall decoration', parentId: '1', level: 2, productCount: 12 },

      // Level 3 - Sub-subcategories under Green decoration
      { id: '1-1-1', name: 'Plant pots', parentId: '1-1', level: 3, productCount: 8 },
      { id: '1-1-2', name: 'Artificial plants', parentId: '1-1', level: 3, productCount: 7 },

      // Level 2 - Subcategories under Kitchen
      { id: '5-1', name: 'Kitchen storage', parentId: '5', level: 2, productCount: 25 },
      { id: '5-2', name: 'Cookware', parentId: '5', level: 2, productCount: 34 },
      { id: '5-3', name: 'Kitchen appliances', parentId: '5', level: 2, productCount: 30 },
    ];

    this._categories.set(mockCategories);
  }
}
