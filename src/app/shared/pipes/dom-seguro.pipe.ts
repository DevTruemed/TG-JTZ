import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'domSeguro'
})
export class DomSeguroPipe implements PipeTransform {

  constructor( private domSanitizr: DomSanitizer ){}

  transform(value: string, ...args: unknown[]): unknown {
    return this.domSanitizr.bypassSecurityTrustResourceUrl( value );
  }

}
