import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../shared/base-classes/base.component';
import { BuybackListService } from '../../services/buyback-list.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { UtilityService } from '../../../../core/services/utility.service';

/**
 * Buyback Sidebar Component
 * Displays buyback list items and summary in sidebar
 */
@Component({
  selector: 'app-buyback-sidebar',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './buyback-sidebar.component.html',
  styleUrls: ['./buyback-sidebar.component.scss']
})
export class BuybackSidebarComponent extends BaseComponent {
  @Output() continueToOfferClick = new EventEmitter<void>();

  // Computed
  translations = computed(() => this.locale.translations());
  items = computed(() => this.buybackService.items());
  itemCount = computed(() => this.buybackService.itemCount());
  totalValue = computed(() => this.buybackService.totalValue());
  totalFamilyValue = computed(() => this.buybackService.totalFamilyValue());
  isEmpty = computed(() => this.buybackService.isEmpty());

  constructor(
    private buybackService: BuybackListService,
    private locale: LocaleService,
    private utility: UtilityService
  ) {
    super();
  }

  /**
   * Handle SKAPA quantity stepper change event
   */
  onQuantityChange(itemId: string, event: any): void {
    const quantity = event.detail?.value || event.detail;
    this.updateQuantity(itemId, quantity);
  }

  /**
   * Update item quantity
   */
  updateQuantity(itemId: string, quantity: number): void {
    this.buybackService.updateQuantity(itemId, quantity);
  }

  /**
   * Remove item
   */
  removeItem(itemId: string): void {
    this.buybackService.removeItem(itemId);
  }

  /**
   * Continue to summary
   */
  continueToSummary(): void {
    if (this.isEmpty()) return;
    this.continueToOfferClick.emit();
  }

  /**
   * Get price parts for SKAPA price component
   */
  getPriceParts(price: number): {
    integerValue: string;
    decimalValue: string;
    decimalSign: string;
    currencyLabel: string;
  } {
    return this.utility.splitPriceForSkapa(price);
  }

  /**
   * Get condition label
   */
  getConditionLabel(condition: string): string {
    const translations = this.translations();
    switch (condition) {
      case 'LIKE_NEW':
        return translations.conditionAssessment.likeNew;
      case 'VERY_GOOD':
        return translations.conditionAssessment.veryGood;
      case 'WELL_USED':
        return translations.conditionAssessment.wellUsed;
      default:
        return condition;
    }
  }
}
