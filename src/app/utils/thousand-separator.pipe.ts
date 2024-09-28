import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousand-separator'
})
export class ThousandSeparatorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
