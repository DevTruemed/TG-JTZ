import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasRoutingModule } from './compras-routing.module';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { ComprasComponent } from './compras.component';
import { FormOrdenCompraComponent } from './pages/form-orden-compra/form-orden-compra.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    ComprasComponent,
    FormOrdenCompraComponent
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
    CoreModule,
    NgxExtendedPdfViewerModule
  ]
})
export class ComprasModule { }
