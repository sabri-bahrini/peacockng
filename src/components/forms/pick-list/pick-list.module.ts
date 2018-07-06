import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PickListComponent} from './pick-list.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [PickListComponent],
  exports: [PickListComponent]
})
export class PickListModule {
}

