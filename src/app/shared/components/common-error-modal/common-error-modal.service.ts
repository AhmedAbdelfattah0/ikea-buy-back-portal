import { Injectable, signal } from '@angular/core';

export interface ModalData {
  errType: string;
  title?: string;
  disc: string;
  showInput?: boolean;
  primaryBtn?: {
    btnText: string;
    isVisible: boolean;
  };
  secondaryBtn?: {
    btnText: string;
    isVisible: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CommonErrorModalService {
  private _modalData = signal<ModalData | null>(null);
  readonly modalData = this._modalData.asReadonly();

  private _openDialog = signal<boolean>(false);
  readonly openDialog = this._openDialog.asReadonly();

  private _confirmButtonEmitter = signal<any>(null);
  readonly confirmButtonEmitter = this._confirmButtonEmitter.asReadonly();

  constructor() {}

  openErrorDialog(modalData: ModalData): void {
    this.closeErrorDialog();
    this._modalData.set(modalData);
    this._openDialog.set(true);
  }

  closeErrorDialog(): void {
    this._openDialog.set(false);
  }

  confirmButtonEvent(modalType: string, inputValue?: any): void {
    const obj: any = { status: 'confirm', type: modalType };
    if (inputValue) {
      obj.inputValue = inputValue;
    }
    this._confirmButtonEmitter.set(obj);
    this.closeErrorDialog();
  }
}
