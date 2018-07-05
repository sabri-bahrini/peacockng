import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dropdownFilter'
})
export class DropdownFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return [];
    }
    if (!args || args == '') {
      return value;
    }

    args = args.toLowerCase();
    return value.filter( it => {
      return it.option.label.toLowerCase().includes(args);
    });
  }

}
