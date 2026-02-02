import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { UtilityService } from '../../core/services/utility.service';
import { DatastoreService } from '../../core/services/datastore.service';

/**
 * Base Model Class
 *
 * All model/view-model classes should extend this base class.
 * Provides common functionality:
 * - Automatic subscription cleanup
 * - Access to utility services
 * - Common helper methods
 *
 * Usage:
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class ProductModel extends BaseModel {
 *   constructor(
 *     utility: UtilityService,
 *     datastore: DatastoreService,
 *     private productService: ProductService
 *   ) {
 *     super(utility, datastore);
 *   }
 *
 *   getProducts(): Observable<Product[]> {
 *     return this.productService.fetchProducts();
 *   }
 * }
 * ```
 */
@Injectable()
export class BaseModel implements OnDestroy {
  /**
   * Subject used for subscription cleanup
   */
  protected ngUnSubscribe = new Subject<void>();

  constructor(
    public utility: UtilityService,
    public datastore: DatastoreService
  ) {}

  /**
   * Get current language translations
   */
  public getLang(): Observable<any> {
    return of(this.utility.getLanguageConstants());
  }

  /**
   * Get current text direction (ltr or rtl)
   */
  public getDirection(): Observable<string> {
    return of(this.utility.getDirection());
  }

  /**
   * Get current market code (sa, bh, etc.)
   */
  public getMarket(): string {
    return this.utility.getCurrentMarket();
  }

  /**
   * Get current language code (en, ar)
   */
  public getLanguage(): string {
    return this.utility.getCurrentLanguage();
  }

  /**
   * Get current currency info
   */
  public getCurrency(): { code: string; symbol: string } {
    return this.utility.getCurrency();
  }

  /**
   * Lifecycle hook - automatically completes all subscriptions
   */
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
