import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pe-image-form',
  templateUrl: './image-form.component.html'
})
export class ImageFormComponent implements OnInit {

  public base64textString = '';
  public _data = '';
  public _tmp = null;
  public extension = '';
  public type = '';
  public datatest: any;
  public isMaxSize = false;
  @Output() selected = new EventEmitter();

  /**
   * extension file to will be accepted
   * file_extension  A file extension starting with the STOP character, e.g: .gif, .jpg, .png, .doc
   * audio/*  All sound files are accepted
   * video/*  All video files are accepted
   * image/*  All image files are accepted
   * media_type  A valid media type, with no parameters. Look at IANA Media Types for a complete list of standard media types
   * @type {string}
   */
  @Input() accept = '*';

  /**
   * Style
   * @type {string}
   */
  @Input() classStyle = 'btn btn-default';
  /**
   * (two way binding) output for data
   * @type {EventEmitter<any>}
   */
  @Output() dataChange = new EventEmitter();

  /**
   * (two way binding) Input data
   * @return {{}}
   */
  @Input()
  get data() {
    return this._data;
  }

  set data(value) {
    this._data = value;
    this.dataChange.emit(this._data);
    this.selected.emit(this._tmp);
  }

  /**
   * upload label
   * @type {string}
   */
  @Input() uploadLabel = null;

  /**
   * max size of file
   * @type {number}
   */
  max: number;

  @Input()
  set maxSize(value) {
    this.max = (value === undefined) ? 2097152 : (value * 1048576);
  }

  get maxSize() {
    return this.max;
  }

  /**
   * alert message when file size > maxSize
   * @type {string}
   */
  maxLabel: string;

  @Input()
  set maxSizeLabel(value) {
    this.maxLabel = (value === undefined) ? `File size must be inferior to ` : value;
  }

  get maxSizeLabel() {
    return this.maxLabel;
  }

  constructor() {
  }

  ngOnInit() {
  }


  handleFileSelect(evt) {
    let files = evt.target.files;
    this.isMaxSize = false;
    let file = files[0];
    if (files && file && file.size < this.maxSize) {
      this.extension = file.name.split('.').pop();
      this.type = file.type;
      let reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    } else {
      this.isMaxSize = true;
      this.data = this._data;
      this.datatest = undefined;
    }
  }

  _handleReaderLoaded(readerEvt) {
    this._tmp = [];
    let binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this._tmp['type'] = this.type;
    this._tmp['extension'] = this.extension;
    if (this.isImage(this.extension)) {
      this._tmp['base64'] = `data:${this.type};base64,${this.base64textString}`;
    } else {
      this._tmp['base64'] = this.base64textString;
    }
    this.data = this._tmp['base64'];
  }

  /**
   * check the file type
   * @param ext
   * @returns {boolean}
   */
  isImage(ext) {
    console.log(ext.toString().toLowerCase());
    switch (ext.toString().toLowerCase()) {
      case 'png':
      case 'jpg':
      case 'gif':
      case 'jpeg':
        return true;
      default:
        return false;
    }
  }
}
