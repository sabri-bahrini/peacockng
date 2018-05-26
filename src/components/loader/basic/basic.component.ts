import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'pe-basic-loader',
  templateUrl: './basic.component.html'
})
export class BasicLoaderComponent implements OnInit {

  @Input() visible = true;
  @Input() fullPage = true;
  @Input() loadingLabel = 'Loading';
  @Input() loadingIcon ;
  constructor() { }

  ngOnInit() {
  }

}
