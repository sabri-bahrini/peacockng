import {Component, forwardRef, Input, OnChanges, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {PeacockSharedService} from '../../../services/peacockShared.service';

@Component({
  selector: 'pe-switch',
  templateUrl: './inputswitch.component.html',
  providers: [
    PeacockSharedService,
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputSwitchComponent), multi: true},
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => InputSwitchComponent), multi: true}
  ]
})
export class InputSwitchComponent implements OnInit, ControlValueAccessor, OnChanges {
  /**
   * On label switch
   * @type {string}
   */
  @Input() onLabel = 'ON';
  /**
   * Off label switch
   * @type {string}
   */
  @Input() offLabel = 'OFF';

  /**
   * Input label
   * @type {string}
   */
  @Input() inputLabel;

  /**
   * Id of the filter input
   * @type {string}
   */
  public randomId = '';


  /**
   * Switch input value
   * @type {boolean}
   * @private
   */
  private _switchValue = false;
  get switchValue() {
    return this._switchValue;
  }

  set switchValue(value) {
    this._switchValue =  (value == true);
    this.emitValueChange();
  }

  /**
   * Propagate change for Model
   */
  propagateChange: any = () => {};
  /**
   * Validation Function for the model
   */
  validateFn: any = () => {};
  /**
   * On touch element dropdown
   */
  onTouched = () => {};

  constructor(private peacockSharedService: PeacockSharedService) {
    this.randomId = 'switch-' + this.peacockSharedService.makeRandomString();
  }

  ngOnInit() {
  }

  /**
   * Emit change value
   */
  emitValueChange() {
    this.propagateChange(this.switchValue);
  }

  /**
   * emit value when the dropdown value was changed
   */
  ngOnChanges() {
    this.emitValueChange();
  }

  /**
   * Writ the value in the ngModel
   * @param value
   */
  writeValue(value) {
    if (value) {
      this.switchValue = value;
    }
  }

  /**
   * Register changes (send to ngModel)
   * @param fn
   */
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  /**
   * Register changes when element touched
   * @param fn
   */
  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  /**
   * Validate control ngModel
   * @param {FormControl} c
   * @return {any}
   */
  validate(c: FormControl) {
    return this.validateFn(c);
  }

}
