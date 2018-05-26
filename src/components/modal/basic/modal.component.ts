import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pe-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {

  /**
   * (two way binding) output for data
   * @type {EventEmitter<any>}
   */
  @Output() visibleChange = new EventEmitter();

  /**
   * To show or hide the modal
   * @type {boolean}
   */
  private _visible = false;

  @Input()
  get visible() {
    return this._visible;
  }

  set visible(value) {
    this._visible = value;
    this.visibleChange.emit(this.visible);
  }

  /**
   * Title of the modal
   * @type {string}
   */
  @Input()
  modalTitle = '';

  /**
   * custom Style class for the modal
   * @type {string}
   */
  @Input()
  styleClass = '';


  /**
   * To show or hide the close button
   * @type {boolean}
   */
  @Input()
  closable = true;

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * close the modal
   */
  closeModal() {
    this.visible = false;
  }

}
