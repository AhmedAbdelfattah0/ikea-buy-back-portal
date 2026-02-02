import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../shared/base-classes/base.component';
import { BuybackListService } from '../../services/buyback-list.service';
import { SubmissionService } from '../../services/submission.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { ExternalUrls } from '../../../../shared/constants/routes.constants';
import { takeUntil } from 'rxjs/operators';

const STORES = [
  { id: 'atlanta', name: 'Atlanta' },
  { id: 'dallas', name: 'Dallas' },
  { id: 'chicago', name: 'Chicago' },
  { id: 'new-york', name: 'New York' },
  { id: 'los-angeles', name: 'Los Angeles' }
];

@Component({
  selector: 'app-estimation',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './estimation.component.html',
  styleUrl: './estimation.component.scss'
})
export class EstimationComponent extends BaseComponent {
  @Output() back = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<string>(); // Emits confirmation number

  // State
  email = signal<string>('');
  selectedStore = signal<string>('');
  privacyAccepted = signal<boolean>(false);
  submissionError = signal<string>('');
  showSuccessMessage = signal<boolean>(false);

  // Computed
  translations = computed(() => this.locale.translations());
  items = computed(() => this.buybackService.items());
  totalValue = computed(() => this.buybackService.totalValue());
  isSubmitting = computed(() => this.submissionService.isSubmitting());

  // Form validation
  isEmailValid = computed(() => {
    const emailValue = this.email();
    if (!emailValue) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  });

  isFormValid = computed(() => {
    return this.isEmailValid() &&
           this.selectedStore() !== '' &&
           this.privacyAccepted() &&
           this.items().length > 0;
  });

  stores = STORES;
  privacyPolicyUrl = ExternalUrls.PRIVACY_POLICY;

  constructor(
    private buybackService: BuybackListService,
    private submissionService: SubmissionService,
    private locale: LocaleService,
    private utility: UtilityService
  ) {
    super();
  }

  onBack(): void {
    this.back.emit();
  }

  onQuantityChange(itemId: string, event: any): void {
    const quantity = event.detail?.value || event.detail;
    this.buybackService.updateQuantity(itemId, quantity);
  }

  removeItem(itemId: string): void {
    this.buybackService.removeItem(itemId);
  }

  onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  onStoreSelected(storeId: string | null): void {
    this.selectedStore.set(storeId || '');
  }

  onPrivacyChange(event: Event): void {
    this.privacyAccepted.set((event.target as HTMLInputElement).checked);
  }

  getPriceParts(price: number) {
    return this.utility.splitPriceForSkapa(price);
  }

  getConditionLabel(condition: string): string {
    const t = this.translations();
    switch (condition) {
      case 'LIKE_NEW': return t.conditionAssessment.likeNew;
      case 'VERY_GOOD': return t.conditionAssessment.veryGood;
      case 'WELL_USED': return t.conditionAssessment.wellUsed;
      default: return condition;
    }
  }

  sellBack(): void {
    // Reset error state
    this.submissionError.set('');

    // Validate form
    if (!this.isFormValid()) {
      this.submissionError.set(this.translations().validation.required);
      return;
    }

    // Create submission request
    const request = this.submissionService.createSubmissionRequest(
      this.email(),
      this.selectedStore(),
      this.items(),
      this.totalValue()
    );

    // Submit
    this.submissionService.submit(request)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe({
        next: (response) => {
          console.log('Submission successful:', response);
          // Clear buyback list after successful submission
          this.buybackService.clearList();
          // Emit the confirmation number to parent component
          this.submitted.emit(response.confirmationNumber);
        },
        error: (error) => {
          console.error('Submission failed:', error);
          this.submissionError.set(this.translations().errors.general);
          this.showErrorToast();
        }
      });
  }

  private showErrorToast(): void {
    const toast = document.createElement('skapa-toast');
    toast.setAttribute('type', 'error');
    toast.setAttribute('duration', '3000');
    toast.textContent = this.submissionError();
    document.body.appendChild(toast);
  }

  goBackToHomepage(): void {
    window.location.href = '/';
  }
}
