import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pe-confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent implements OnInit {

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

  /**
   * Event to emitter (CANCEL or CONFIRM)
   */
  @Output()
  event = new EventEmitter();

  /**
   * Label for cancel button
   * @type {string}
   */
  @Input()
  cancelLabel = 'Cancel';

  /**
   * Label for cancel button
   * @type {string}
   */
  @Input()
  confirmLabel = 'Confirm';

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

  /**
   * Function to emit the value of the action Buttons
   * @param action
   */
  actionClick(action) {
    this.event.emit({action: action});
    this.closeModal();
  }


}
