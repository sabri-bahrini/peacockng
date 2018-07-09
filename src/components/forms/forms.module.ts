import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicFormComponent} from './basic-form/basic-form.component';
import {ImageFormComponent} from './image-form/image-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormTableComponent} from '../forms/form-table/form-table.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {ModalModule} from '../modal/modal.module';
import {DropdownFormComponent} from './dropdown-form/dropdown-form.component';
import {DropdownFilterPipe} from './dropdown-form/dropdown-filter.pipe';
import {PickListComponent} from './pick-list/pick-list.component';
import {InputSwitchComponent} from './inputswitch/inputswitch.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ModalModule
  ],
  declarations: [
    BasicFormComponent,
    ImageFormComponent,
    FormTableComponent,
    DropdownFormComponent,
    DropdownFilterPipe,
    PickListComponent,
    InputSwitchComponent
  ],
  exports: [
    BasicFormComponent,
    ImageFormComponent,
    FormTableComponent,
    DropdownFormComponent,
    PickListComponent,
    InputSwitchComponent
  ]
})
export class PeacockFormsModule {
}
