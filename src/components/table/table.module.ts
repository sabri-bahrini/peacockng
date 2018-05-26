import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicTableComponent } from './basic-table/table.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule} from '@angular/forms';
import { FilteredTableComponent } from './filtred-table/filtred-table.component';
import {PeacockFormsModule} from '../forms/forms.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    PeacockFormsModule
  ],
  declarations: [BasicTableComponent, FilteredTableComponent],
  exports: [BasicTableComponent, FilteredTableComponent]
})
export class TableModule { }
