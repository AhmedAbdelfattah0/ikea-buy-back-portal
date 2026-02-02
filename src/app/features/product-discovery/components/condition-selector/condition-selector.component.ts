import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../shared/base-classes/base.component';
import { Product } from '../../../../shared/interfaces/product.interface';
import { LocaleService } from '../../../../core/services/locale.service';
import { BuybackListService } from '../../../buyback-list/services/buyback-list.service';
import { ToasterService } from '../../../../shared/components/toaster/toaster.service';
import { toasterCases } from '../../../../shared/constants/app.constants';

/**
 * Condition Selector Component
 * Modal for selecting product condition before adding to buyback list
 */
@Component({
  selector: 'app-condition-selector',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './condition-selector.component.html',
  styleUrl: './condition-selector.component.scss'
})
export class ConditionSelectorComponent extends BaseComponent {
  // State
  isOpen = signal<boolean>(false);
  selectedProduct = signal<Product | null>(null);
  selectedCondition = signal<'LIKE_NEW' | 'VERY_GOOD' | 'WELL_USED' | null>(null);

  // Computed
  translations = computed(() => this.locale.translations());
  canSubmit = computed(() => this.selectedCondition() !== null);

  // Condition options with local asset images
  conditions = [
    {
      value: 'LIKE_NEW' as const,
      iconUrl: 'assets/images/conditions/grade-a.jpg',
      translationKey: 'likeNew',
      descriptionKey: 'likeNewDescription'
    },
    {
      value: 'VERY_GOOD' as const,
      iconUrl: 'assets/images/conditions/grade-b.jpg',
      translationKey: 'veryGood',
      descriptionKey: 'veryGoodDescription'
    },
    {
      value: 'WELL_USED' as const,
      iconUrl: 'assets/images/conditions/grade-c.jpg',
      translationKey: 'wellUsed',
      descriptionKey: 'wellUsedDescription'
    }
  ];

  constructor(
    private locale: LocaleService,
    private buybackService: BuybackListService,
    private toasterService: ToasterService
  ) {
    super();
  }

  /**
   * Open modal with product
   */
  open(product: Product): void {
    this.selectedProduct.set(product);
    this.selectedCondition.set(null);
    this.isOpen.set(true);
  }

  /**
   * Close modal
   */
  close(): void {
    this.isOpen.set(false);
    this.selectedProduct.set(null);
    this.selectedCondition.set(null);
  }

  /**
   * Select condition
   */
  selectCondition(condition: 'LIKE_NEW' | 'VERY_GOOD' | 'WELL_USED'): void {
    this.selectedCondition.set(condition);
  }

  /**
   * Confirm selection and add to buyback list
   */
  confirmSelection(): void {
    const product = this.selectedProduct();
    const condition = this.selectedCondition();

    if (!product || !condition) {
      return;
    }

    // Add to buyback list
    this.buybackService.addItem(product, condition);

    // Show success toaster
    this.toasterService.openToaster(toasterCases.ITEM_ADDED);

    // Close modal
    this.close();
  }

  /**
   * Navigate back to categories
   */
  goBack(): void {
    this.close();
  }
}
