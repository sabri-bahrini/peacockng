import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './basic/modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ModalComponent, ConfirmModalComponent],
  exports: [ModalComponent, ConfirmModalComponent]
})
export class ModalModule { }
