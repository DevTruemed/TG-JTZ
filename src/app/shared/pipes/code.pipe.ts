import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'code'
})
export class CodePipe implements PipeTransform {

  transform(value: string | null, ...args: unknown[]): unknown {
    if ( value != null )
      return value.toString().replace(/,/g, "");
    else
      return '';
  }

}
