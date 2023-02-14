import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutText'
})
export class CutTextPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (value.length <= 35)
      return value;
    if (args[0])
      return value.substr(0,35) + '...';
    else
      return value;
  }

}
