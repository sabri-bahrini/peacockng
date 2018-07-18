import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pe-form-table',
  templateUrl: './form-table.component.html'
})
export class FormTableComponent implements OnInit {

  /**
   * input Cols data
   * (sample) => [ {name : 'firstName', header: 'First Name'}, {name : 'lastName', header: 'Last Name'} ... ]
   * @type {Array}
   */
  private _cols: any = [];
  @Input()
  set cols(config: any) {
    for (let col of config.fields) {
      if (!col.sort) {
        config.fields['sort'] = null;
      }
    }
    this._cols = config.fields;
    // this.action = config.action;
  }

  get cols(): any {
    return this._cols;
  }

  private _config: any = [];
  @Input()
  set config(config: any) {
    this._config = config;
    this._cols = config.fields;
    this.actionCol = config.dataActions;
    if (this.actionCol.actions === undefined || this.actionCol.actions.length <= 0) {
      this.actionCol.actions = [
        {event: 'ADD'},
        {event: 'UPDATE'},
        {event: 'DELETE'}
      ];
    }
  }

  get config(): any {
    return this._config;
  }

  /**
   * Input data of table
   * (sample) =>  [ {lastName : 'my Last name', firstName: 'my first Name'}, ... ]
   * @type {Array}
   */
    // @Input() data: any = [];
  private _data: any = [];
  private backUpData: any = [];

  @Output() dataChange = new EventEmitter();
  @Input()
  set data(data: any) {
    this._data = data;
    this.backUpData = data;
    this.totalItems = data.length; // set the total items variable to length of data
    this.dataChange.emit(this.data);
  }

  get data(): any {
    return this._data;
  }

  /**
   * Action object : to show action for each row
   * (sample) => [
   *              {
   *                label: 'modifier',
   *                icon: 'fa fa-edit',
   *                classStyle: 'btn btn-pill btn-warning',
   *                when: {
   *                  name: 'firstName',
   *                  value: 'sabri',
   *                  operator: '=='
   *                  }
   *               }
   *             ]
   * @type {any}
   */
  @Input() actionCol = null;

  /**
   * Event to emitted
   * @type {EventEmitter<any>}
   */
  @Output() event = new EventEmitter();

  /**
   * Input class name of table
   * @type {string}
   */
  @Input() class = 'table table-striped';

  /**
   * true or false to show the paginator of table
   * @type {boolean}
   */
  private _pagination = true;

  @Input()
  set pagination(pagination: boolean) {
    this._pagination = pagination;
    if (!pagination) {
      this.itemsPerPage = this.data.length;
    }
  }

  get pagination(): boolean {
    return this._pagination;
  }

  /**
   * Items Per Page for the pagination (Default is 10)
   * @type {number}
   */
  private _itemsPerPage = 10;
  @Input()
  set itemsPerPage(value) {
    if (!this.pagination) {
      this._itemsPerPage = this.data.length;
    } else {
      this._itemsPerPage = value;
    }

  }

  get itemsPerPage() {
    return this._itemsPerPage;
  }

  /**
   * Array to show items per page
   * @type {[number , number , number]}
   */
  @Input() arrayItemsPerPage = [5, 10, 15, 20, 25];

  /**
   * Next label pagination
   * @type {string}
   */
  @Input() nextLabel = 'Next';

  /**
   * Previous Label pagination
   * @type {string}
   */
  @Input() previousLabel = 'Previous';

  /**
   * Show item per page Label
   * @type {string}
   */
  @Input() showItemPerPageLabel = 'Show';

  /**
   * Label showed when the data is empty
   * @type {string}
   */
  @Input() emptyDataLabel = 'Data is empty !!';

  /**
   * Label for total element in the table
   * @type {string}
   */
  @Input() totalLabel = 'Total : ';

  /**
   * Label for add button
   * @type {string}
   */
  @Input() addLabel = 'Add';

  /**
   * Label for add delete
   * @type {string}
   */
  @Input() deleteLabel = 'Delete';

  /**
   * Label for add update
   * @type {string}
   */
  @Input() updateLabel = 'Update';

  /**
   * the add modal title
   * @type {string}
   */
  @Input() addModalTitle = 'Ajouter';

  /**
   * the update modal title
   * @type {string}
   */
  @Input() updateModalTitle = 'Modifier';

  /**
   * the delete modal title
   * @type {string}
   */
  @Input() deleteModalTitle = 'Supprimer';

  /**
   * the delete message inside the modal
   * @type {string}
   */
  @Input() deleteModalMessage = 'Do you want to delete this element ?';

  /**
   * modal save button label
   * @type {string}
   */
  @Input() modalSaveButton = 'Save';

  /**
   * modal cancel button label
   * @type {string}
   */
  @Input() modalCancelButton = 'Cancel';
  /**
   * modal delete button label
   * @type {string}
   */
  @Input() modalDeleteButton = 'Delete';
  /**
   * card label
   * @type {string}
   */
  @Input() cardLabel = 'Authorized IPs';
  /**
   * The current page
   * @type {number}
   */
  public currentPage = 1;
  /**
   * Total elements in data
   * @type {number}
   */
  public totalItems = 0;
  public modalView = false;
  public modalDelete = false;
  public modalUpdate = false;
  public row_index = -1;
  public myForm = {};
  public formConf = {
    classStyle: '',
    fields: [],
    actions: []
  };
  _tmpTableRow = {};

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Get the row/cols Data from object
   * (sample) if colField is composed "car.color" then return the data col of car color
   * @param row
   * @param colField
   * @return {any}
   */
  getColData(row, colField) {
    if (colField.indexOf('.') > -1) {
      let itm = row;
      for (let i of colField.split('.')) {
        itm = itm[i];
      }
      return itm.toString();
    } else {
      return row[colField].toString();
    }
  }

  /**
   * check the condition and return
   *    true : if the condition applied or you don't have a condition
   *    fasle : if not
   *  If the condition don't have a operator by default is "=="
   * @param row
   * @param conditions [{ paramValue: 'the value to will be compared',
   * value: 'the Value to be checked', operator: '==' },
   * { name: 'theFieldName', value: 'the Value to be checked', operator: '==' }]
   * @return {boolean}
   */
  isShowed(row, action) {
    switch (action.event) {
      case 'UPDATE':
        action.classStyle = 'btn btn-warning';
        action.label = this.updateLabel;
        return true;
      case 'DELETE':
        action.classStyle = 'btn btn-danger';
        action.label = this.deleteLabel;
        return true;
      case 'ADD':
        return false;
      default:
        return false;
    }
  }

  /**
   * check the action boutton for the add button
   * @param action
   * @returns {boolean}
   */
  isAddBtn(action) {
    switch (action.event) {
      case 'ADD':
        action.classStyle = 'btn btn-success';
        action.label = this.addLabel;
        return true;
      default:
        return false;
    }
  }

  /**
   * switch the action show the modal
   * @param row
   * @param action
   * @param row_no
   * @returns {boolean}
   */
  actionClick(row, action, row_no?) {
    this.row_index = (row_no + ((this.currentPage - 1) * this.itemsPerPage));

    switch (action) {
      case 'ADD':
        this.myForm = {};
        this.initFromConfig();
        this.modalView = true;
        break;
      case 'UPDATE':
        this.myForm = row;
        this._tmpTableRow = Object.assign({}, row);
        this.initFromConfig();
        this.modalUpdate = true;
        break;
      case 'DELETE':
        this.modalDelete = true;
        break;
      default:
        return false;
    }
  }

  /**
   * Sort the dynamic object array
   * @param name
   */
  sort(name) {
    this.data = this.backUpData;
    this.data.sort(this.dynamicSortArray(name, this.processSort(name)));
  }

  /**
   * check the sort ASC or DESC for name in parameters and set the others fields to null
   * transform the sort from (ASC to DESC) or (DESC to ASC) for a name in parameters
   *    return null if not fund any element
   *    return true if the sort will be ascendant (ASC)
   *    return false if the sort will be descendant (DESC)
   * @param name
   * @return {any}
   */
  processSort(name) {
    let res = null;
    for (let i = 0; i < this.cols.length; i++) {
      // search the cols for name in parameters else sort will be null
      if (this.cols[i].name == name) {
        if (this.cols[i].sort != null) {
          // if sort 'asc' then will be 'desc' or inverse
          if (this.cols[i].sort == 'asc') {
            this.cols[i].sort = 'desc';
            res = false;
          } else {
            this.cols[i].sort = 'asc';
            res = true;
          }
        } else {
          // if the sort is null will be by default 'asc'
          this.cols[i].sort = 'asc';
          res = true;
        }
      } else {
        this.cols[i].sort = null;
      }
    }
    return res;
  }


  /**
   * sort dynamic array of element
   * @param property
   * @returns {(a, b) => number}
   */
  dynamicSortArray(property, ascending) {
    let _this = this;
    let sortOrder = 1;

    if (!ascending) {
      sortOrder = -1;
    }
    return function (a, b) {
      let result = (_this.getColData(a, property).toString().toLowerCase() < _this.getColData(b, property).toString().toLowerCase()) ? -1 : (_this.getColData(a, property).toString().toLowerCase() > _this.getColData(b, property).toString().toLowerCase()) ? 1 : 0;
      return result * sortOrder;
    };

  }

  /**
   * Page is changed event
   * @param event
   */
  pageChanged(event) {
    this.currentPage = event;
  }


  /**
   * remove the an element from the list
   */
  deleteModal(event) {
    if (event.action === 'CONFIRM') {
      this.data.splice(this.row_index, 1);
      this.data = this.data;
      this.modalDelete = false;
      this.row_index = -1;
    }
  }

  /**
   * hide the delete modal
   */
  hideDeleteModal() {
    this.modalDelete = false;
  }

  /**
   * action for the add modal
   * @param event
   * @returns {boolean}
   */
  addElement(event) {
    let _tmp = [];
    if (event.formValid && event.action === 'SAVE') {
      _tmp.push(this.myForm);
      this.data = _tmp.concat(this.data);
      this.modalView = false;
      this.initFromConfig();
    }

    if (event.action === 'RESET') {
      this.modalView = false;
    }

  }
}

  /**
   * action for the update modal
   * @param event
   * @returns {boolean}
   */
updateElement(event) {
  if (event.formValid && event.action === 'SAVE') {
    this.modalUpdate = false;
    this.initFromConfig();
  }

  if (event.action === 'RESET') {
    this.data[this.row_index] = this._tmpTableRow;
    this.initFromConfig();
    this.modalUpdate = false;
    this._tmpTableRow = {};
  }
}

  /**
   * init the form config inside the model
   */
  initFromConfig() {
    this.formConf = {
      classStyle: '',
      fields: this._config.fields,
      actions: [
        {
          label: this.modalCancelButton,
          type: 'RESET',
          eventName: 'RESET',
          icon: 'fa fa-ban',
          classStyle: 'btn btn-warning col-md-3 offset-md-3 mr-1',
        },
        {
          label: this.modalSaveButton,
          type: 'submit',
          eventName: 'SAVE',
          icon: 'fa fa-save',
          classStyle: 'btn btn-primary col-md-3',
        }
      ]
    };
  }
}
