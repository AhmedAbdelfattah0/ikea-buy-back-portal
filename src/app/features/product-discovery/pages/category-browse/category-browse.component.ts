import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../shared/base-classes/base.component';
import { CategoryTreeComponent } from '../../components/category-tree/category-tree.component';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { BuybackSidebarComponent } from '../../../buyback-list/components/buyback-sidebar/buyback-sidebar.component';
import { ConditionSelectorComponent } from '../../components/condition-selector/condition-selector.component';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { Category, Product } from '../../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-category-browse',
  standalone: true,
  imports: [
    CommonModule,
    CategoryTreeComponent,
    ProductGridComponent,
    BuybackSidebarComponent,
    ConditionSelectorComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './category-browse.component.html',
  styleUrl: './category-browse.component.scss'
})
export class CategoryBrowseComponent extends BaseComponent {
  @ViewChild(ConditionSelectorComponent) conditionSelector!: ConditionSelectorComponent;

  // State
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
}
