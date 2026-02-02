import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../shared/base-classes/base.component';
import { Product } from '../../../../shared/interfaces/product.interface';
import { LocaleService } from '../../../../core/services/locale.service';

/**
 * Product Grid Component
 * Displays products in a grid layout
 */
@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent extends BaseComponent {
  // Inputs
  products = input<Product[]>([]);
  isLoading = input<boolean>(false);

  // Outputs
  productSelected = output<Product>();

  // Computed
  translations = computed(() => this.locale.translations());
  hasProducts = computed(() => this.products().length > 0);
  productCount = computed(() => this.products().length);

  selectedProduct: Product = null;

  constructor(private locale: LocaleService) {
    super();
  }


  /**
   * Handle product selection
   */
  selectProduct(product: Product): void {
    this.selectedProduct=product
    this.productSelected.emit(product);
  }

  /**
   * Format price
   */
  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  isSelectedProduct(product: Product): boolean {
    return this.selectedProduct === product;
  }
}
