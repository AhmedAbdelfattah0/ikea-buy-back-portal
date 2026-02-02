import { Injectable, signal, computed } from '@angular/core';
import { BuybackItem, Product } from '../../../shared/interfaces/product.interface';
import { DatastoreService } from '../../../core/services/datastore.service';
import { StorageKeys } from '../../../shared/constants/app.constants';

/**
 * Buyback List Service
 * Manages the user's buyback list state and persistence
 */
@Injectable({
  providedIn: 'root'
})
export class BuybackListService {
  // Private state
  private _items = signal<BuybackItem[]>([]);

  // Public readonly signals
  readonly items = this._items.asReadonly();

  // Computed signals
  readonly itemCount = computed(() => this._items().length);

  readonly totalValue = computed(() => {
    return this._items().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  readonly totalFamilyValue = computed(() => {
    return this._items().reduce((sum, item) => sum + (item.familyMemberPrice * item.quantity), 0);
  });

  readonly isEmpty = computed(() => this._items().length === 0);

  constructor(private datastore: DatastoreService) {
    this.loadFromStorage();
  }

  /**
   * Add item to buyback list
   * User selects any condition - we don't validate against product conditions
   */
  addItem(product: Product, condition: 'LIKE_NEW' | 'VERY_GOOD' | 'WELL_USED'): void {
    const conditionPrice = product.conditions.find(c => c.condition === condition);
    if (!conditionPrice) {
      console.error('Invalid condition for product');
      return;
    }

    // Check if item already exists with same product and condition
    const existingItem = this._items().find(
      item => item.product.id === product.id && item.condition === condition
    );

    if (existingItem) {
      // Update quantity
      this.updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      // Add new item
      const newItem: BuybackItem = {
        id: this.generateId(),
        product,
        condition,
        price: conditionPrice.price,
        familyMemberPrice: conditionPrice.familyMemberPrice,
        quantity: 1,
        addedAt: new Date()
      };

      this._items.update(items => [...items, newItem]);
      this.saveToStorage();
    }
  }

  /**
   * Remove item from list
   */
  removeItem(itemId: string): void {
    this._items.update(items => items.filter(item => item.id !== itemId));
    this.saveToStorage();
  }

  /**
   * Update item quantity
   */
  updateQuantity(itemId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(itemId);
      return;
    }

    this._items.update(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
    this.saveToStorage();
  }

  /**
   * Update item condition
   */
  updateCondition(itemId: string, condition: 'LIKE_NEW' | 'VERY_GOOD' | 'WELL_USED'): void {
    this._items.update(items =>
      items.map(item => {
        if (item.id === itemId) {
          const conditionPrice = item.product.conditions.find(c => c.condition === condition);
          if (conditionPrice) {
            return {
              ...item,
              condition,
              price: conditionPrice.price,
              familyMemberPrice: conditionPrice.familyMemberPrice
            };
          }
        }
        return item;
      })
    );
    this.saveToStorage();
  }

  /**
   * Clear all items
   */
  clearList(): void {
    this._items.set([]);
    this.saveToStorage();
  }

  /**
   * Check if product with condition exists in list
   */
  hasItem(productId: string, condition?: 'LIKE_NEW' | 'VERY_GOOD' | 'WELL_USED'): boolean {
    if (condition) {
      return this._items().some(
        item => item.product.id === productId && item.condition === condition
      );
    }
    return this._items().some(item => item.product.id === productId);
  }

  /**
   * Get item by product id and condition
   */
  getItem(productId: string, condition: 'LIKE_NEW' | 'VERY_GOOD' | 'WELL_USED'): BuybackItem | undefined {
    return this._items().find(
      item => item.product.id === productId && item.condition === condition
    );
  }

  /**
   * Save list to localStorage
   */
  private saveToStorage(): void {
    this.datastore.setItem(StorageKeys.BUYBACK_LIST, this._items());
  }

  /**
   * Load list from localStorage
   */
  private loadFromStorage(): void {
    const saved = this.datastore.getItem<BuybackItem[]>(StorageKeys.BUYBACK_LIST);
    if (saved && Array.isArray(saved)) {
      // Convert date strings back to Date objects
      const items = saved.map(item => ({
        ...item,
        addedAt: new Date(item.addedAt)
      }));
      this._items.set(items);
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}
