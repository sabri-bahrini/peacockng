import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'pe-form',
  templateUrl: './basic-form.component.html'
})
export class BasicFormComponent implements OnInit {

  public _config = {};

  /**
   * (two way binding) output for data
   * @type {EventEmitter<any>}
   */
  @Output() dataChange = new EventEmitter();
  /**
   * Event output to send actions and data
   * @type {EventEmitter<any>}
   */
  @Output() formClicked = new EventEmitter();

  /**
   * Data form object
   * @type {{}}
   */
  formObject = {};

  /**
   * Config params
   * @param value
   */
  @Input()
  set config(value) {
    this._config = value;
    this.initForm();
  }

  get config() {
    return this._config;
  }

  /**
   * (two way binding) Input data
   * @return {{}}
   */
  @Input()
  get data() {
    return this.formObject;
  }

  set data(value) {
    this.formObject = value;
    this.dataChange.emit(this.formObject);
    // INIT argument if is not defined object
    if (!this.formObject) {
      this.initForm();
    }
  }

  /**
   * Form group control
   */
  formGroup: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.initForm();
  }

  /**
   * Initialise the form group and object value if not defined in Input
   */
  initForm() {
    let formControlGroup = {};
    for (let field of this.config['fields']) {
      if (!this.data[field.name] && !this.isTitleType(field.type)) {
        // if is checkbox the init will be table else is empty
        if (this.isInputGroup(field.type) && field.type.toLowerCase().indexOf('checkbox') > -1) {
          this.data[field.name] = [];
        } else {
          this.data[field.name] = '';
        }
      }
      // check if the param fields have a name or not if have name then build the control params
      if (field.name) {
        let isDisabled = (field.disabled) ? field.disabled : false;
        formControlGroup[field.name] = new FormControl({
          value: this.data[field.name],
          disabled: isDisabled
        }, this.getValidators(field));
      }
    }
    this.formGroup = new FormGroup(formControlGroup);
  }

  /**
   * Build list of validators
   * @param field
   * @return {Array}
   */
  getValidators(field) {
    if (field.validators && field.validators.length > 0) {
      let validators = [];
      for (let val of field.validators) {
        switch (val.control.toLowerCase()) {
          case 'required':
            validators.push(Validators.required);
            break;
          case 'min':
            validators.push(Validators.min(val.value));
            break;
          case 'max':
            validators.push(Validators.max(val.value));
            break;
          case 'minlength':
            validators.push(Validators.minLength(val.value));
            break;
          case 'maxlength':
            validators.push(Validators.maxLength(val.value));
            break;
          default:
            break;
        }
      }
      return validators;
    } else {
      return [];
    }
  }

  /**
   * Send action event to the caller components
   * @param action
   */
  eventEmit(action, form?: NgForm) {
    if (form) {
      this.formClicked.emit({data: this.data, action: action, formValid: form.valid});
    } else {
      this.formClicked.emit({data: this.data, action: action});
    }
  }


  /**
   * Check if the type is a title
   * @param fieldType
   * @return {boolean}
   */
  isTitleType(fieldType) {
    switch (fieldType.toLowerCase()) {
      case 'title':
        return true;
      default:
        return false;
    }
  }

  /**
   * Check if the field is an input type if is undifined return true and after will be text type
   * @param fieldType
   * @return {boolean}
   */
  isSimpleInputType(fieldType) {
    if (fieldType) {
      switch (fieldType.toLowerCase()) {
        case 'text':
          return true;
        case 'password':
          return true;
        case 'email':
          return true;
        case 'tel':
          return true;
        case 'date':
          return true;
        default:
          return false;
      }
    } else {
      return true;
    }
  }

  /**
   * Xheck if the fiels is an input type number
   * @param fieldType
   * @return {boolean}
   */
  isNumberInput(fieldType) {
    switch (fieldType.toLowerCase()) {
      case 'number':
        return true;
      default:
        return false;
    }
  }

  /**
   * check if the field is select type or not
   * @param fieldType
   * @return {boolean}
   */
  isSelectType(fieldType) {
    switch (fieldType.toLowerCase()) {
      case 'select':
        return true;
      default:
        return false;
    }
  }

  /**
   * Check if the field type is type group (Checkbox or radio)
   * @param fieldType
   * @return {boolean}
   */
  isInputGroup(fieldType) {
    switch (fieldType.toLowerCase()) {
      case 'radio' || 'radio-group':
        return true;
      case 'checkbox' || 'checkbox-group':
        return true;
      default:
        return false;
    }
  }

  /**
   * Check if the actions is a submit or reset
   *    - OK : true
   *    - NOK : false
   *    - if type not defined : false
   * @param actionType
   * @return {boolean}
   */
  isFormButton(actionType) {
    if (actionType) {
      switch (actionType.toLowerCase()) {
        case 'submit':
          return true;
        case 'reset':
          return true;
        default:
          return false;
      }
    } else {
      return false;
    }
  }

  /**
   * check if the field type is an image
   * @param fieldType
   * @returns {boolean}
   */
  isImage(fieldType) {
    switch (fieldType.toLowerCase()) {
      case 'image' || 'img':
        return true;
      default:
        return false;
    }
  }

  /**
   * check if the field type is an image
   * @param fieldType
   * @returns {boolean}
   */
  isTable(fieldType) {
    switch (fieldType.type.toLowerCase()) {
      case 'table':
        return true;
      default:
        return false;
    }
  }

  /**
   * check if the field is a dropdown type or not
   * @param fieldType
   * @return {boolean}
   */
  isDropdownType(field) {
    switch (field.type.toLowerCase()) {
      case 'dropdown':
        return true;
      default:
        return false;
    }
  }

  /**
   * check if the fiels is a switch type
   * @param field
   * @return {boolean}
   */
  isSwitchType(field) {
    switch (field.type.toLowerCase()) {
      case 'switch':
        return true;
      default:
        return false;
    }
  }

  /**
   * Check if the field type is standard type or custom
   * @param field
   * @return {boolean}
   */
  isStandardType(field) {
    switch (field) {
      case this.isDropdownType(field):
        return false;
      case this.isSwitchType(field):
        return false;
      default:
        return true;
    }
  }

  /**
   * check if the field name is invalid or not
   * when the field touched or the form submitted
   *    - true : form Invalid
   *    - false : form valid
   * @param fieldName
   */
  isInvalid(fieldName, ngForm?: NgForm) {
    return this.formGroup.controls[fieldName].invalid && (this.formGroup.controls[fieldName].touched || (ngForm && ngForm.submitted));
  }

  /**
   * check if the field is Invalid or not and test controls
   *      - true : field (name) is invalid controls
   *      - false : by default
   * @param fieldName
   * @param controlName
   * @param {NgForm} ngForm
   * @return {boolean}
   */
  controlTest(fieldName, controlName, ngForm: NgForm) {
    switch (controlName.toLowerCase()) {
      case 'required':
        return this.isInvalid(fieldName, ngForm) && this.formGroup.controls[fieldName].errors.required;
      case 'min':
        return this.isInvalid(fieldName, ngForm) && this.formGroup.controls[fieldName].errors.min;
      case 'max':
        return this.isInvalid(fieldName, ngForm) && this.formGroup.controls[fieldName].errors.max;
      case 'minlength':
        return this.isInvalid(fieldName, ngForm) && this.formGroup.controls[fieldName].errors.minlength;
      case 'maxlength':
        return this.isInvalid(fieldName, ngForm) && this.formGroup.controls[fieldName].errors.maxlength;
      default:
        return false;
    }
  }

}
