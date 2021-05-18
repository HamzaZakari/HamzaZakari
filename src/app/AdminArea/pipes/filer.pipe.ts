import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filer'
})
export class FilerPipe implements PipeTransform {

  transform(value: any, filterString: string , propName: string): any {
    if (value.length === 0 || filterString === '') {
      return value;
    }
    const resultsArray = [];
    for (const item of value) {
      if (item[propName] === filterString) {
        resultsArray.push(item);
      }
    }
    return resultsArray;
  }

}
