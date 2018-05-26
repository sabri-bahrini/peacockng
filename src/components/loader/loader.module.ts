import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicLoaderComponent } from './basic/basic.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BasicLoaderComponent],
  exports: [BasicLoaderComponent]
})
export class LoaderModule { }
