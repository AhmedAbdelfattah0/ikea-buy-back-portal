import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../../shared/base-classes/base.component';
import { LocaleService } from '../../../../core/services/locale.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss'
})
export class ConfirmationComponent extends BaseComponent {
  @Input() confirmationNumber: string = '';

  translations = computed(() => this.locale.translations());

  constructor(
    private locale: LocaleService,
    private router: Router
  ) {
    super();
  }

  copyQuotationNumber(): void {
    navigator.clipboard.writeText(this.confirmationNumber);
    // TODO: Show toast notification
  }

  estimateAnother(): void {
    this.router.navigate(['/product-discovery']);
  }

  shareFeedback(): void {
    // TODO: Implement feedback sharing logic
    console.log('Share feedback clicked');
  }
}
