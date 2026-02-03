import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../shared/base-classes/base.component';
import { CategoryTreeComponent } from '../../../product-discovery/components/category-tree/category-tree.component';
import { ProductGridComponent } from '../../../product-discovery/components/product-grid/product-grid.component';
import { BuybackSidebarComponent } from '../../components/buyback-sidebar/buyback-sidebar.component';
import { EstimationComponent } from '../../components/estimation/estimation.component';
import { ConfirmationComponent } from '../../components/confirmation/confirmation';
import { ConditionSelectorComponent } from '../../../product-discovery/components/condition-selector/condition-selector.component';
import { CategoryService } from '../../../product-discovery/services/category.service';
import { ProductService } from '../../../product-discovery/services/product.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { Category, Product } from '../../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-buyback-list',
  standalone: true,
  imports: [
    CommonModule,
    CategoryTreeComponent,
    ProductGridComponent,
    BuybackSidebarComponent,
    EstimationComponent,
    ConditionSelectorComponent,
    ConfirmationComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './buyback-list.component.html',
  styleUrl: './buyback-list.component.scss'
})
export class BuybackListComponent extends BaseComponent {
  @ViewChild(ConditionSelectorComponent) conditionSelector!: ConditionSelectorComponent;

  // State
  showEstimation = signal<boolean>(false);
  showConfirmation = signal<boolean>(false);
  confirmationNumber = signal<string>('');
  searchQuery = signal<string>('');

  // Computed
  translations = computed(() => this.locale.translations());
  selectedCategory = computed(() => this.categoryService.selectedCategory());
  filteredProducts = computed(() => this.productService.filteredProducts());
  isLoading = computed(() => this.productService.isLoading());

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private locale: LocaleService
  ) {
    super();
  }

  /**
   * Handle category selection
   */
  onCategorySelected(category: Category): void {
    this.productService.setCategoryFilter(category.id);
  }

  /**
   * Handle product selection
   */
  onProductSelected(product: Product): void {
    this.conditionSelector.open(product);
  }

  /**
   * Handle search input
   */
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value;
    this.searchQuery.set(query);
    this.productService.setSearchQuery(query);
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchQuery.set('');
    this.productService.setSearchQuery('');
  }

  /**
   * Clear category selection and go back to categories
   */
  clearCategorySelection(): void {
    this.categoryService.selectCategory(null);
    this.productService.setCategoryFilter(undefined);
  }

  /**
   * Show estimation view
   */
  onContinueToOffer(): void {
    this.showEstimation.set(true);
  }

  /**
   * Handle submission success
   */
  onSubmissionSuccess(confirmationNum: string): void {
    this.confirmationNumber.set(confirmationNum);
    this.showEstimation.set(false);
    this.showConfirmation.set(true);
  }

  /**
   * Reset to initial view (called from confirmation page)
   */
  onEstimateAnother(): void {
    this.showConfirmation.set(false);
    this.showEstimation.set(false);
    this.confirmationNumber.set('');
    // Optionally reset other state
    this.clearCategorySelection();
    this.clearSearch();
  }
}
