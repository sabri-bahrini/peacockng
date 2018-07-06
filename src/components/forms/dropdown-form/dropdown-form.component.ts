import {Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, Renderer2} from '@angular/core';
import {PeacockSharedService} from '../../../services/peacockShared.service';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'pe-dropdown',
  templateUrl: './dropdown-form.component.html',
  providers: [
    PeacockSharedService,
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DropdownFormComponent), multi: true},
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => DropdownFormComponent), multi: true}
  ]
})
export class DropdownFormComponent implements OnInit, ControlValueAccessor, OnChanges {
  /**
   * Id of the filter input
   * @type {string}
   */
  public randomId = '';
  /**
   * to show or hide the options list
   * @type {boolean}
   */
  public dropdownActive = false;

  /**
   * show the filter input
   * @type {boolean}
   */
  @Input() filtered = false;

  /**
   * select multiple
   * @type {boolean}
   */
  @Input() multiple = false;


  /**
   * Filter input text placeholder label
   * @type {string}
   */
  @Input() filterLabel = 'Filter';

  /**
   * Label selected items
   * @type {string}
   */
  @Input() selectedItemLabel = 'Items Selected';

  /**
   * default text for select input
   * @type {string}
   */
  public _tmpPlaceholder: any = '';
  @Input() placeholder: any = '';


  /**
   * Options list
   * Sample : [ {label : 'my label', value: 'my-value'}, ... ]
   * @type {Array}
   */
  private _options = [];
  @Input()
  get options() {
    return this._options;
  }

  set options(value) {
    this._options = value;
    this.initDropdown();
  }

  /**
   * Event to emitted when you select an item from the list
   * @type {EventEmitter<any>}
   */
  @Output() selected = new EventEmitter();

  /**
   * Event to emitte when the item is deleted from the selected list
   * @type {EventEmitter<any>}
   */
  @Output() deleted = new EventEmitter();

  /**
   * (two way binding) output for value
   * @type {EventEmitter<any>}
   */
  @Output() valueChange = new EventEmitter();

  /**
   * selected values
   * @type {any}
   * @private
   */
  private _value: any = {};

  @Input()
  /**
   * Get the selected value
   * @return {any}
   */
  get value() {
    return this._value;
  }

  /**
   * Set the selected value
   * @param val
   */
  set value(val) {
    this._value = val;
    // 1- Emit the event value
    this.emitValueChange();
    // 2- init the dropdown
    this.initDropdown();
  }

  /**
   * list of all options with value is selected or not
   * sample : [ {option: options-from-Input-Options, selected : true/false, index : 0}, ....]
   * @type {Array}
   */
  public dropdownOptions = [];

  /**
   * Selected Items
   * @type {Array}
   */
  public selectedItems = [];

  /**
   * Filter value for input
   * @type {string}
   */
  public filter = '';

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


  constructor(private peacockSharedService: PeacockSharedService, private renderer: Renderer2) {
    this.randomId = 'filter-' + this.peacockSharedService.makeRandomString();
  }

  ngOnInit() {
  }

  /**
   * Init dropdown attributes
   */
  initDropdown() {
    this.dropdownOptions = [];
    this.selectedItems = [];
    this._tmpPlaceholder = [];
    // 1- init the selected array from option list and add selected status and index in the list
    for (let i = 0; i < this.options.length; i++) {
      let item: any = {
        option: this.options[i],
        selected: this.isSelected(this.options[i]),
        index: i
      };
      this.dropdownOptions.push(item);
      // add to selected item
      if (item.selected) {
        this._tmpPlaceholder.push(item.option.label);
        this.selectedItems.push(item);
      }
    }
  }

  /**
   * Return if element Value in selected value or not
   * @param elementValue
   * @return {boolean}
   */
  isSelected(element) {
    if (this.value.constructor === [].constructor) {
      // if the value is array type (multiple select)
      for (let item of this.value) {
        // compare two element
        if (this.peacockSharedService.isEqual(item, element.value)) {
          return true;
        }
      }
      // return false if not fund in value list
      return false;

    } else if (this.value.constructor === ''.constructor || !isNaN(this.value)) {
      // if the value is string type (single select)
      if (this.value === element.value) {
        // this._tmpPlaceholder = element.label;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Open and close the dropdown
   */
  openCloseDropdown() {
    this.dropdownActive = !this.dropdownActive;
    setTimeout(() => {
      if (this.filtered) {
        let elementToFocus = this.randomId;
        // elementToFocus += '-list';
        let onElement = this.renderer.selectRootElement('#input_filter-' + elementToFocus);
        onElement.focus();
      }
    }, 200);
  }

  /**
   * Close the dropdown
   */
  closeDropdown() {
    setTimeout(() => {
      this.dropdownActive = false;
    }, 200);
  }

  /**
   * Build the value array if the dropdown is multiple select
   * Build the array label (_tmpPlaceholder)
   */
  buildValue() {
    this._value = [];
    this._tmpPlaceholder = [];
    this.selectedItems = [];
    for (let item of this.dropdownOptions) {
      if (item.selected) {
        this._value.push(this.options[item.index].value);
        this._tmpPlaceholder.push(this.options[item.index].label);
        this.selectedItems.push(item);
      }
    }
  }

  removeItem(option) {
    // 1- Deselect item
    this.dropdownOptions[option.index].selected = false;
    // 2- build value list
    this.buildValue();
    // 3- Reset dropdown
    this.initDropdown();
    // 4- Emit the event value
    this.emitValueChange();
    // 5- Send event for DELETED item
    this.deleted.emit(this.dropdownOptions[option.index].option);
  }

  /**
   * Select item from list
   * @param option
   */
  selectItem(option) {
    // let selectedIndex = this.searchOption(option.value);
    let selectedIndex = option.index;
    // 1- Close the dropdown list
    this.openCloseDropdown();
    // 2- check if the dropdown is multiple select or simple
    if (this.multiple) {
      // 2.1- if item selected is not selected before giv him true else false
      this.dropdownOptions[selectedIndex].selected = !option.selected;
      // 2.2- build the array value from selected items
      this.buildValue();
      // 2.3- reset dropdown
      this.initDropdown();
    } else {
      // 2.1- set the selected value
      this._value = option.option.value;
      // 2.2- reset Dropdown
      this.initDropdown();
      // 2.3- replace text place holder with the selected label
      this.placeholder = option.option.label;
    }

    // 3- Emit the event value
    this.emitValueChange();
    // 4- Send event for selected item
    this.selected.emit(this.dropdownOptions[selectedIndex].option);
  }

  /**
   * Emit change value
   */
  emitValueChange() {
    this.valueChange.emit(this.value);
    this.propagateChange(this.value);
  }

  /**
   * emit value when the dropdown value was changed
   */
  ngOnChanges() {
    // // 1- If multiple appliyed required dropdown
    // if (this.multiple) {
    //   // this.validateFn = requiredDropdown();
    // }
    // 2- emit changes value
    this.emitValueChange();
  }

  /**
   * Writ the value in the ngModel
   * @param value
   */
  writeValue(value) {
    if (value) {
      this.value = value;
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

/**
 * Custom control
 * @return {(c: FormControl) => {requireds: boolean}}
 */
export function requiredDropdown() {
  return (c: FormControl) => {
    let err = {
      requireds: true
    };
    return (c.value && c.value.length == 0) ? err : null;
  }
}
