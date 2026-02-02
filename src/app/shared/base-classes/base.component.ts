import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import '@ingka/modal-webc';
import "@ingka/quantity-stepper-webc";
import "@ingka/button-webc";
import "@ingka/icon-webc";
import '@ingka/icon-store/minus';
import '@ingka/icon-store/plus';
import '@ingka/icon-store/camera';
import '@ingka/icon-store/chevron-left-small';
import '@ingka/icon-store/trash-can';
import '@ingka/icon-store/magnifying-glass';
import '@ingka/icon-store/copy';
import '@ingka/price-webc';
import '@ingka/toast-webc';
import '@ingka/search-webc';
import '@ingka/product-identifier-webc';
import '@ingka/input-field-webc';
import '@ingka/helper-text-webc';
import '@ingka/combobox-webc';
import '@ingka/fieldset-webc';
import '@ingka/checkbox-webc';
import '@ingka/aspect-ratio-box-webc';
import '@ingka/pill-webc';

/**
 * Base Component Class
 *
 * All components in the application should extend this base class.
 * Provides common functionality:
 * - Automatic subscription cleanup via ngUnSubscribe
 * - SKAPA design system web component imports (centralized)
 *
 * Usage:
 * ```typescript
 * export class MyComponent extends BaseComponent implements OnInit {
 *   constructor(private destroyRef: DestroyRef) {
 *     super();
 *   }
 *
 *   ngOnInit() {
 *     this.someObservable$
 *       .pipe(takeUntilDestroyed(this.destroyRef))
 *       .subscribe(...);
 *   }
 * }
 * ```
 */
@Injectable()
export class BaseComponent implements OnDestroy {


  /**
   * Subject used for subscription cleanup
   * Emit on this subject in ngOnDestroy to automatically unsubscribe
   */
  protected ngUnSubscribe = new Subject<void>();

  /**
   * Lifecycle hook - automatically completes all subscriptions
   */
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
