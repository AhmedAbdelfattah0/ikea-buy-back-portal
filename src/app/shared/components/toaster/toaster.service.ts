import { Injectable, signal } from '@angular/core';
import { toasterCases } from '../../constants/app.constants';

export interface ToasterData {
  toasterType: string;
  isVisible: boolean;
  Message?: string;
  viewLink?: {
    link: string;
    isVisible: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class ToasterService {
  toasterObject = signal<ToasterData>(toasterCases.DEFAULT);

  constructor() {}

  openToaster(toasterObject: ToasterData): void {
    this.toasterObject.set(toasterObject);
  }

  closeToaster(): void {
    this.toasterObject.set(toasterCases.DEFAULT);
  }
}
