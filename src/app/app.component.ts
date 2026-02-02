import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from './shared/components/toaster/toaster.component';
import { CommonErrorModalComponent } from './shared/components/common-error-modal/common-error-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterComponent, CommonErrorModalComponent],
  template: `
    <app-toaster></app-toaster>
    <app-common-error-modal></app-common-error-modal>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {}
