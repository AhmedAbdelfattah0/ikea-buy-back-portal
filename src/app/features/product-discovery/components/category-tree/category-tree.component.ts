import { Component, computed, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../shared/base-classes/base.component';
import { Category } from '../../../../shared/interfaces/product.interface';
import { CategoryService } from '../../services/category.service';
import { LocaleService } from '../../../../core/services/locale.service';

/**
 * Category Tree Component
 * Displays hierarchical category navigation in side-by-side columns
 */
@Component({
  selector: 'app-category-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.scss']
})
export class CategoryTreeComponent extends BaseComponent {
  // State - track which categories are selected at each level
  selectedLevel1 = signal<Category | null>(null);
  selectedLevel2 = signal<Category | null>(null);
  selectedLevel3 = signal<Category | null>(null);

  // Outputs
  categorySelected = output<Category>();

  // Computed
  translations = computed(() => this.locale.translations());
  rootCategories = computed(() => this.categoryService.rootCategories());

  // Show level 2 categories when level 1 is selected
  level2Categories = computed(() => {
    const selected = this.selectedLevel1();
    return selected ? this.categoryService.getChildren(selected.id) : [];
  });

  // Show level 3 categories when level 2 is selected
  level3Categories = computed(() => {
    const selected = this.selectedLevel2();
    return selected ? this.categoryService.getChildren(selected.id) : [];
  });

  constructor(
    private categoryService: CategoryService,
    private locale: LocaleService
  ) {
    super();
  }

  /**
   * Select level 1 category
   */
  selectLevel1Category(category: Category): void {
    this.selectedLevel1.set(category);
    this.selectedLevel2.set(null);
    this.selectedLevel3.set(null);

    // If no children, this is the final selection
    if (this.categoryService.getChildren(category.id).length === 0) {
      this.finalizeSelection(category);
    }
  }

  /**
   * Select level 2 category
   */
  selectLevel2Category(category: Category): void {
    this.selectedLevel2.set(category);
    this.selectedLevel3.set(null);

    // If no children, this is the final selection
    if (this.categoryService.getChildren(category.id).length === 0) {
      this.finalizeSelection(category);
    }
  }

  /**
   * Select level 3 category
   */
  selectLevel3Category(category: Category): void {
    this.selectedLevel3.set(category);
    this.finalizeSelection(category);
  }

  /**
   * Finalize category selection and notify parent
   */
  private finalizeSelection(category: Category): void {
    this.categoryService.selectCategory(category);
    this.categorySelected.emit(category);
  }

  /**
   * Check if category is selected at level 1
   */
  isLevel1Selected(category: Category): boolean {
    return this.selectedLevel1()?.id === category.id;
  }

  /**
   * Check if category is selected at level 2
   */
  isLevel2Selected(category: Category): boolean {
    return this.selectedLevel2()?.id === category.id;
  }

  /**
   * Check if category is selected at level 3
   */
  isLevel3Selected(category: Category): boolean {
    return this.selectedLevel3()?.id === category.id;
  }

  /**
   * Check if category has children
   */
  hasChildren(category: Category): boolean {
    return this.categoryService.getChildren(category.id).length > 0;
  }
}
