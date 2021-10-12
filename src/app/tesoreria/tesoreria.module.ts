import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TesoreriaRoutingModule } from './tesoreria-routing.module';
import { TesoreriaComponent } from './tesoreria.component';
import { CoreModule } from '../core/core.module';
import { DepositosComponent } from './pages/depositos/depositos.component';


@NgModule({
  declarations: [TesoreriaComponent, DepositosComponent],
  imports: [
    CommonModule,
    TesoreriaRoutingModule,
    CoreModule
  ],
  bootstrap: [TesoreriaComponent]
})
export class TesoreriaModule { }
