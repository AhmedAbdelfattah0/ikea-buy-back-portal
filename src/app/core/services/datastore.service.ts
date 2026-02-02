import { Injectable } from '@angular/core';
import { StorageKeys, SessionKeys } from '../../shared/constants/app.constants';

/**
 * Datastore Service
 *
 * Manages application state using localStorage and sessionStorage
 * Provides type-safe getters and setters for stored data
 *
 * Usage:
 * ```typescript
 * constructor(private datastore: DatastoreService) {
 *   this.datastore.setItem(StorageKeys.BUYBACK_LIST, items);
 *   const items = this.datastore.getItem<BuybackItem[]>(StorageKeys.BUYBACK_LIST, []);
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  /**
   * Set item in localStorage
   */
  public setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
    }
  }

  /**
   * Get item from localStorage
   */
  public getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue !== undefined ? defaultValue : null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting localStorage item ${key}:`, error);
      return defaultValue !== undefined ? defaultValue : null;
    }
  }

  /**
   * Remove item from localStorage
   */
  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error);
    }
  }

  /**
   * Clear all items from localStorage
   */
  public clearAll(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Check if key exists in localStorage
   */
  public hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Set item in sessionStorage
   */
  public setSessionItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error setting sessionStorage item ${key}:`, error);
    }
  }

  /**
   * Get item from sessionStorage
   */
  public getSessionItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) {
        return defaultValue !== undefined ? defaultValue : null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting sessionStorage item ${key}:`, error);
      return defaultValue !== undefined ? defaultValue : null;
    }
  }

  /**
   * Remove item from sessionStorage
   */
  public removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing sessionStorage item ${key}:`, error);
    }
  }

  /**
   * Clear all items from sessionStorage
   */
  public clearSessionAll(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }

  /**
   * Check if key exists in sessionStorage
   */
  public hasSessionItem(key: string): boolean {
    return sessionStorage.getItem(key) !== null;
  }

  // =============================================================================
  // Application-Specific Helpers
  // =============================================================================

  /**
   * Get buyback list from storage
   */
  public getBuybackList<T>(): T[] {
    return this.getItem<T[]>(StorageKeys.BUYBACK_LIST, [])!;
  }

  /**
   * Set buyback list in storage
   */
  public setBuybackList<T>(items: T[]): void {
    this.setItem(StorageKeys.BUYBACK_LIST, items);
  }

  /**
   * Clear buyback list
   */
  public clearBuybackList(): void {
    this.removeItem(StorageKeys.BUYBACK_LIST);
  }

  /**
   * Get family member status
   */
  public isFamilyMember(): boolean {
    return this.getItem<boolean>(StorageKeys.FAMILY_MEMBER_STATUS, false)!;
  }

  /**
   * Set family member status
   */
  public setFamilyMemberStatus(isMember: boolean): void {
    this.setItem(StorageKeys.FAMILY_MEMBER_STATUS, isMember);
  }

  /**
   * Get selected store
   */
  public getSelectedStore(): string | null {
    return this.getItem<string>(StorageKeys.SELECTED_STORE);
  }

  /**
   * Set selected store
   */
  public setSelectedStore(storeId: string): void {
    this.setItem(StorageKeys.SELECTED_STORE, storeId);
  }

  /**
   * Get user email
   */
  public getUserEmail(): string | null {
    return this.getItem<string>(StorageKeys.USER_EMAIL);
  }

  /**
   * Set user email
   */
  public setUserEmail(email: string): void {
    this.setItem(StorageKeys.USER_EMAIL, email);
  }

  /**
   * Get last quotation
   */
  public getLastQuotation<T>(): T | null {
    return this.getItem<T>(StorageKeys.LAST_QUOTATION);
  }

  /**
   * Set last quotation
   */
  public setLastQuotation<T>(quotation: T): void {
    this.setItem(StorageKeys.LAST_QUOTATION, quotation);
  }

  /**
   * Clear all application data
   */
  public clearApplicationData(): void {
    this.clearBuybackList();
    this.removeItem(StorageKeys.SELECTED_STORE);
    this.removeItem(StorageKeys.LAST_QUOTATION);
    this.clearSessionAll();
  }
}
