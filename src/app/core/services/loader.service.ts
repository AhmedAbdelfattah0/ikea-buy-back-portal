import { Injectable, signal } from '@angular/core';

/**
 * Loader Service
 *
 * Manages global and component-specific loading states using SKAPA skeleton loaders
 * Uses Angular signals for reactive updates
 *
 * Note: This service manages the state. The actual SKAPA skeleton components
 * should be used in templates based on these states.
 *
 * Usage:
 * ```typescript
 * // In component
 * constructor(private loader: LoaderService) {}
 *
 * loadData() {
 *   this.loader.show();
 *   this.api.getData().subscribe({
 *     next: (data) => this.loader.hide(),
 *     error: () => this.loader.hide()
 *   });
 * }
 * ```
 *
 * In template:
 * ```html
 * @if (loader.isLoading()) {
 *   <skapa-skeleton variant="text" rows="3"></skapa-skeleton>
 * } @else {
 *   <!-- Actual content -->
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  // Global loading state
  private _isLoading = signal<boolean>(false);
  public readonly isLoading = this._isLoading.asReadonly();

  // Component-specific loading states (using signals for reactivity)
  private loadingStates = new Map<string, boolean>();

  /**
   * Show global skeleton loader
   */
  public show(): void {
    this._isLoading.set(true);
  }

  /**
   * Hide global skeleton loader
   */
  public hide(): void {
    this._isLoading.set(false);
  }

  /**
   * Set loading state for a specific component/operation
   * Use this for component-specific skeleton loaders
   *
   * @param key - Unique identifier for the loading operation
   * @param isLoading - Loading state
   */
  public setLoading(key: string, isLoading: boolean): void {
    this.loadingStates.set(key, isLoading);
  }

  /**
   * Get loading state for a specific component/operation
   *
   * @param key - Unique identifier for the loading operation
   * @returns Loading state
   */
  public getLoading(key: string): boolean {
    return this.loadingStates.get(key) || false;
  }

  /**
   * Clear specific loading state
   *
   * @param key - Unique identifier for the loading operation
   */
  public clearLoading(key: string): void {
    this.loadingStates.delete(key);
  }

  /**
   * Clear all loading states
   */
  public clearAll(): void {
    this._isLoading.set(false);
    this.loadingStates.clear();
  }

  /**
   * Get all active loading states
   * Useful for debugging
   */
  public getActiveLoadingStates(): string[] {
    return Array.from(this.loadingStates.entries())
      .filter(([_, isLoading]) => isLoading)
      .map(([key, _]) => key);
  }
}

/**
 * SKAPA Skeleton Loader Types
 *
 * Reference for SKAPA skeleton loader variants:
 * - text: For loading text content (supports rows attribute)
 * - image: For loading images
 * - card: For loading card components
 * - list: For loading list items
 * - custom: For custom skeleton shapes
 *
 * Example usage in templates:
 * ```html
 * <!-- Text skeleton -->
 * <skapa-skeleton variant="text" rows="3"></skapa-skeleton>
 *
 * <!-- Image skeleton -->
 * <skapa-skeleton variant="image" width="200px" height="200px"></skapa-skeleton>
 *
 * <!-- Card skeleton -->
 * <skapa-skeleton variant="card"></skapa-skeleton>
 *
 * <!-- List skeleton -->
 * <skapa-skeleton variant="list" items="5"></skapa-skeleton>
 * ```
 */
