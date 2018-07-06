import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pe-table',
  templateUrl: './table.component.html'
})
export class BasicTableComponent implements OnInit {

  /**
   * input Cols data
   * (sample) => [ {field : 'firstName', header: 'First Name'}, {field : 'lastName', header: 'Last Name'} ... ]
   * @type {Array}
   */
  private _cols: any = [];
  @Input()
  set cols(cols: any) {
    for (let col of cols) {
      if (!col.sort) {
        cols['sort'] = null;
      }
    }
    this._cols = cols;
  }

  get cols(): any {
    return this._cols;
  }

  /**
   * Input data of table
   * (sample) =>  [ {lastName : 'my Last name', firstName: 'my first Name'}, ... ]
   * @type {Array}
   */
    // @Input() data: any = [];
  private _data: any = [];
  private backUpData: any = [];

  @Input()
  set data(data: any) {
    this._data = data;
    this.backUpData = data;
    this.totalItems = data.length; // set the total items variable to length of data
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
   *                  field: 'firstName',
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
  @Input() arrayItemsPerPage = [10, 15, 20, 25];

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
   * The current page
   * @type {number}
   */
  public currentPage = 1;
  /**
   * Total elements in data
   * @type {number}
   */
  public totalItems = 0;

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
   * @param conditions [{ paramValue: 'the value to will be compared', value: 'the Value to be checked', operator: '==' }, { field: 'theFieldName', value: 'the Value to be checked', operator: '==' }]
   * @return {boolean}
   */
  isShowed(row, conditions) {
    if (conditions) {
      let conditionToEvaluate = '';
      for (let i = 0; i < conditions.length; i++) {
        // if the condition dont have an opearator
        if (!conditions[i].operator) {
          conditions[i].operator = '==';
        }
        // add and opeartor if you have multiple condition
        if (i > 0) {
          conditionToEvaluate += ' && ';
        }

        let data;
        // if is a field of the object
        if (conditions[i].field) {
          data = this.getColData(row, conditions[i].field);
        }
        // if is a simple condition (from out value)
        if (conditions[i].paramValue) {
          data = conditions[i].paramValue;
        }
        conditionToEvaluate += '\'' + data + '\'' + conditions[i].operator + '\'' + conditions[i].value + '\'';
          }
      return eval(conditionToEvaluate);

    } else {
      return true;
    }
  }

  /**
   * Emit the event action and the row data
   * @param row
   * @param action
   */
  actionClick(row, action) {
    this.event.emit({data: row, action: action});
  }

  /**
   * Sort the dynamic object array
   * @param field
   */
  sort(field) {
    this.data = this.backUpData;
    this.data.sort(this.dynamicSortArray(field, this.processSort(field)));
  }

  /**
   * check the sort ASC or DESC for field in parameters and set the others fields to null
   * transform the sort from (ASC to DESC) or (DESC to ASC) for a field in parameters
   *    return null if not fund any element
   *    return true if the sort will be ascendant (ASC)
   *    return false if the sort will be descendant (DESC)
   * @param field
   * @return {any}
   */
  processSort(field) {
    let res = null;
    for (let i = 0; i < this.cols.length; i++) {
      // search the cols for field in parameters else sort will be null
      if (this.cols[i].field == field) {
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

}
