import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pe-filtered-table',
  templateUrl: './filtred-table.component.html'
})
export class FilteredTableComponent implements OnInit {
  /**
   * Data back Up
   * @type {Array}
   * @private
   */
  public _backUpData = [];
  public _data = [];
  /**
   * Form data two way binding
   * @type {{}}
   */
  public formData = {};

  /**
   * Data rows
   * @type {Array}
   */
  @Input()
  set data(value) {
    this._data = value;
    this._backUpData = value;
  }

  get data() {
    return this._data;
  }

  /**
   * Cols config
   * @type {Array}
   */
  @Input()
  cols: any = [];

  /**
   * Action col
   * @type {Array}
   */
  @Input()
  actionCol: any = [];

  /**
   * Event to emited
   * @type {EventEmitter<any>}
   */
  @Output()
  event = new EventEmitter();

  /**
   * event emited
   * @type {EventEmitter<any>}
   */
  @Output()
  btnEvent = new EventEmitter();

  /**
   * NB Items per page
   * @type {number}
   */
  @Input()
  itemsPerPage = 10;

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
   * Label search button
   * @type {string}
   */
  _searchLabel = 'Search';
  @Input()
  get searchLabel() {
    return this._searchLabel;
  }

  set searchLabel(value) {
    this._searchLabel = value;
    this.initConf();
  }

  /**
   * Label reset button
   * @type {string}
   */
  _resetLabel = 'Reset';

  @Input()
  get resetLabel() {
    return this._resetLabel;
  }

  set resetLabel(value) {
    this._resetLabel = value;
    this.initConf();
  }

  /**
   * Label for the card which contain the filter
   * @type {string}
   */
  @Input() filterCardLabel = 'Filter';

  /**
   * Label  for the card which contain the data table
   * @type {string}
   */
  @Input() tableCardLabel = 'Result';

  /**
   * Array for the button before the data table
   * @type {any[]}
   */
  @Input() btnCols = [];
  /**
   * Show the filter zone if we have at least one filtered column (by default the zone is hidden)
   * @type {boolean}
   */
  public isEnableFilter = false;
  /**
   * Show or hide the filter section
   * @type {boolean}
   */
  @Input() showFiler = true;

  /**
   * Config form Filter
   * @type {{}}
   */
  searchConfig = {};

  constructor() {
  }

  ngOnInit() {
    this.initConf();
  }

  /**
   * Init form Filter
   */
  initSearchConfig() {
    this.searchConfig = {
      actions: [
        {
          label: this.searchLabel,
          eventName: 'SEARCH',
          icon: 'fa fa-search',
          classStyle: 'btn btn-outline-primary col-md-3 offset-md-3 mr-1',
        },
        {
          label: this.resetLabel,
          eventName: 'RESET',
          icon: 'fa fa-ban',
          classStyle: 'btn btn-outline-warning col-md-3',
        }
      ],
      fields: []
    };
  }

  /**
   * Init config for form search
   */
  initConf() {
    this.initSearchConfig();
    let nbrFilteredColumns = 0;
    for (let col of this.cols) {
      if (col.filtered) {
        nbrFilteredColumns++;
        this.isEnableFilter = true;
        if (col.filtered.type) {
          this.searchConfig['fields'].push({
            type: col.filtered.type,
            label: col.header,
            name: col.field,
            classStyle: 'col-md-6',
            values: col.filtered.values
          });
        } else {
          this.searchConfig['fields'].push({
            type: 'text',
            label: col.header,
            name: col.field,
            classStyle: 'col-md-6'
          });
        }

      }
    }
    if (nbrFilteredColumns <= 1) {
      for (let field of this.searchConfig['fields']) {
        field['classStyle'] = 'col-md-12';
      }
    }
  }

  /**
   * Send the event to the caller
   * @param event
   */
  clicked(event) {
    this.event.emit(event);
  }

  /**
   * On click form
   * @param event
   */
  formChange(event) {
    if (event.action == 'SEARCH') {
      this.search();
    } else if (event.action == 'RESET') {
      this.resetForm();
    }
  }

  /**
   * Search elements
   */
  search() {
    let searchRes = this._backUpData;
    console.log(this.formData)
    for (let col of this.cols) {
      if (col.filtered) {
        searchRes = searchRes.filter(element => (this.formData[col.field].trim() != '') ? this.getColData(element, col.field).toLowerCase().includes(this.formData[col.field].trim().toLowerCase()) : element);
      }
    }
    this._data = searchRes;
  }

  /**
   * Reset object of the search form
   */
  resetForm() {
    this._data = this._backUpData;
    this.formData = {};
    for (let col of this.cols) {
      if (col.filtered) {
        this.formData[col.field] = '';
      }
    }
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
   * function to show and hide the filter card body
   */
  hideAndShowFilter(): void {
    this.showFiler = !this.showFiler;
  }

  /**
   *  send the event to the caller
   * @param {string} eventName
   */
  clickedBtn(eventName: string) {
    this.btnEvent.emit({action: eventName});
  }

}
