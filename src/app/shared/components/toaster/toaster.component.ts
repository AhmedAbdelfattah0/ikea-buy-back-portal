import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { ToasterService } from './toaster.service';
import { BaseComponent } from '../../base-classes/base.component';
import { LocaleService } from '../../../core/services/locale.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToasterComponent extends BaseComponent implements OnInit {
  direction = computed(() => this.localeService.isRTL() ? 'rtl' : 'ltr');
  translations = computed(() => this.localeService.translations());
  toasterData = computed(() => this.toasterService.toasterObject());

  constructor(
    public toasterService: ToasterService,
    private localeService: LocaleService
  ) {
    super();
  }

  ngOnInit(): void {}

  afterDismiss(): void {
    this.toasterService.closeToaster();
  }
}
