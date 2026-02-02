import { Injectable } from '@angular/core';
import { CommonErrorModalService } from './common-error-modal.service';
import { BaseModel } from '../../base-classes/base.model';
import { UtilityService } from '../../../core/services/utility.service';
import { DatastoreService } from '../../../core/services/datastore.service';

@Injectable()
export class ErrorModel extends BaseModel {

  constructor(
    public modalService: CommonErrorModalService,
    utility: UtilityService,
    datastore: DatastoreService
  ) {
    super(utility, datastore);
  }

  closeModalFunc(): void {
    this.modalService.closeErrorDialog();
  }

  confirmButtonEventFn(modalType: string, inputValue?: any): void {
    this.modalService.confirmButtonEvent(modalType, inputValue);
  }

  closeButtonEventFn(): void {
    this.modalService.closeErrorDialog();
  }
}
