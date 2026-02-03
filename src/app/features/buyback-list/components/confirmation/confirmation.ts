import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @Output() estimateAnotherClick = new EventEmitter<void>();

  translations = computed(() => this.locale.translations());

  constructor(private locale: LocaleService) {
    super();
  }

  copyQuotationNumber(): void {
    navigator.clipboard.writeText(this.confirmationNumber);
    // TODO: Show toast notification
  }

  estimateAnother(): void {
    this.estimateAnotherClick.emit();
  }

  shareFeedback(): void {
    // TODO: Implement feedback sharing logic
    console.log('Share feedback clicked');
  }
}
