import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '../../base-classes/base.component';
import { CommonErrorModalService } from './common-error-modal.service';
import { ErrorModel } from './error.model';
import { LocaleService } from '../../../core/services/locale.service';

@Component({
  selector: 'app-common-error-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './common-error-modal.component.html',
  styleUrl: './common-error-modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ErrorModel]
})
export class CommonErrorModalComponent extends BaseComponent implements OnInit {
  translations = computed(() => this.localeService.translations());
  direction = computed(() => this.localeService.isRTL() ? 'rtl' : 'ltr');
  modalData = computed(() => this.modalService.modalData());
  isOpen = computed(() => this.modalService.openDialog());

  inputValue = new FormControl('', [Validators.required]);
  showPassword = false;

  constructor(
    public modalService: CommonErrorModalService,
    private model: ErrorModel,
    private localeService: LocaleService
  ) {
    super();
  }

  ngOnInit(): void {}

  confirmButtonClick(modalType: string): void {
    if (this.inputValue.value && this.inputValue.value !== '') {
      this.model.confirmButtonEventFn(modalType, this.inputValue.value);
    } else {
      this.model.confirmButtonEventFn(modalType);
    }
  }

  closeButtonClick(): void {
    this.model.closeButtonEventFn();
  }
}
