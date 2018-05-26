import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicFormComponent } from './basic-form/basic-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [BasicFormComponent],
  exports: [BasicFormComponent]
})
export class PeacockFormsModule { }
