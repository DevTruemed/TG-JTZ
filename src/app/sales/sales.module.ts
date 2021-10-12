import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { CotizacionComponent } from './pages/cotizacion/cotizacion.component';
import { CoreModule } from '../core/core.module';
import { SalesComponent } from './sales.component';
import { FormComponent } from './pages/form/form.component';
import { FacturasComponent } from './pages/facturas/facturas.component';
import { PagadasComponent } from './pages/pagadas/pagadas.component';


@NgModule({
  declarations: [SalesComponent,
                CotizacionComponent,
                FormComponent,
                FacturasComponent,
                PagadasComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    CoreModule
  ],
  bootstrap:[SalesComponent]
})
export class SalesModule { }
