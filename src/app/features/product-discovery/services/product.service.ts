import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductFilter, SearchResult } from '../../../shared/interfaces/product.interface';

/**
 * Product Service
 * Manages product data and search functionality
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Private state
  private _products = signal<Product[]>([]);
  private _searchQuery = signal<string>('');
  private _currentFilter = signal<ProductFilter>({});
  private _isLoading = signal<boolean>(false);

  // Public readonly signals
  readonly products = this._products.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // Computed signals
  readonly filteredProducts = computed(() => {
    const filter = this._currentFilter();
    let filtered = this._products();

    if (filter.categoryId) {
      filtered = filtered.filter(p => p.categoryId === filter.categoryId);
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.productNumber.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  readonly productCount = computed(() => this.filteredProducts().length);

  constructor() {
    this.loadMockProducts();
  }

  /**
   * Set search query
   */
  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
    this._currentFilter.update(filter => ({ ...filter, searchQuery: query }));
  }

  /**
   * Set category filter
   */
  setCategoryFilter(categoryId: string | undefined): void {
    this._currentFilter.update(filter => ({ ...filter, categoryId }));
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this._currentFilter.set({});
    this._searchQuery.set('');
  }

  /**
   * Get product by ID
   */
  getProductById(productId: string): Product | undefined {
    return this._products().find(p => p.id === productId);
  }

  /**
   * Search products (will be replaced with API call)
   */
  searchProducts(query: string): SearchResult {
    this.setSearchQuery(query);
    const products = this.filteredProducts();

    return {
      products,
      totalCount: products.length,
      page: 1,
      pageSize: products.length
    };
  }

  /**
   * Load mock products (will be replaced with API call)
   */
  private loadMockProducts(): void {
    const mockProducts: Product[] = [
      {
        id: 'p1',
        productNumber: '305.292.87',
        name: 'SATSUMAS',
        description: 'Plant stand, bamboo/white, 70 cm',
        categoryId: '1-1-1',
        categoryName: 'Plant pots',
        imageUrl: 'https://www.ikea.com/us/en/images/products/ingatorp-extendable-table-white__1067309_ph179330_s4.jpg',
        thumbnailUrl: 'https://www.ikea.com/us/en/images/products/ingatorp-extendable-table-white__0737089_pe740879_s4.jpg',
        basePrice: 28.00,
        conditions: [
          {
            condition: 'LIKE_NEW',
            price: 28.00,
            familyMemberPrice: 35.00,
            description: 'No scratches'
          },
          {
            condition: 'VERY_GOOD',
            price: 20.00,
            familyMemberPrice: 25.00,
            description: 'Minor scratches'
          },
          {
            condition: 'WELL_USED',
            price: 12.00,
            familyMemberPrice: 15.00,
            description: 'Several scratches'
          }
        ],
        isEligible: true
      },
      {
        id: 'p2',
        productNumber: '604.575.92',
        name: 'VANILJSTÅNG',
        description: 'Plant stand, pine/black, 67 cm',
        categoryId: '1-1-1',
        categoryName: 'Plant pots',
        imageUrl: 'https://www.ikea.com/us/en/images/products/besta-tv-unit-dark-gray__1255236_pe924457_s4.jpg',
        thumbnailUrl: 'https://www.ikea.com/us/en/images/products/besta-tv-unit-dark-gray__1219601_pe913478_s4.jpg',
        basePrice: 35.00,
        conditions: [
          {
            condition: 'LIKE_NEW',
            price: 35.00,
            familyMemberPrice: 43.75,
            description: 'No scratches'
          },
          {
            condition: 'VERY_GOOD',
            price: 25.00,
            familyMemberPrice: 31.25,
            description: 'Minor scratches'
          },
          {
            condition: 'WELL_USED',
            price: 15.00,
            familyMemberPrice: 18.75,
            description: 'Several scratches'
          }
        ],
        isEligible: true
      }
    ];

    this._products.set(mockProducts);
  }
}
