/**
 * Product Interfaces
 * Defines the structure for product-related data
 */

/**
 * Product interface representing a buyback-eligible product
 */
export interface Product {
  id: string;
  productNumber: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  thumbnailUrl: string;
  basePrice: number;
  conditions: ProductConditionPrice[];
  isEligible: boolean;
}

/**
 * Product condition pricing
 */
export interface ProductConditionPrice {
  condition: 'LIKE_NEW' | 'VERY_GOOD' | 'WELL_USED';
  price: number;
  familyMemberPrice: number;
  description: string;
}

/**
 * Buyback list item
 */
export interface BuybackItem {
  id: string;
  product: Product;
  condition: 'LIKE_NEW' | 'VERY_GOOD' | 'WELL_USED';
  price: number;
  familyMemberPrice: number;
  quantity: number;
  addedAt: Date;
}

/**
 * Category interface for hierarchical navigation
 */
export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
  children?: Category[];
  productCount: number;
  imageUrl?: string;
  isExpanded?: boolean;
}

/**
 * Search result
 */
export interface SearchResult {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * Product filter
 */
export interface ProductFilter {
  categoryId?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}
