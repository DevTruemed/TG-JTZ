import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutText'
})
export class CutTextPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (args[0])
      return value.substr(0,50) + '...';
    else
      return value;
  }

}
