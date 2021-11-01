import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratosRoutingModule } from './contratos-routing.module';
import { CoreModule } from '../core/core.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

import { ContratosComponent } from './contratos.component';
import { VigentesComponent } from './pages/vigentes/vigentes.component';
import { VencidosComponent } from './pages/vencidos/vencidos.component';
import { FormComponent } from './pages/form/form.component';
import { ShowComponent } from './pages/show/show.component';

@NgModule({
  declarations: [
    ContratosComponent,
    VigentesComponent,
    VencidosComponent,
    FormComponent,
    ShowComponent,
  ],
  imports: [
    CommonModule,
    ContratosRoutingModule,
    CoreModule,
    AngularMyDatePickerModule
  ],
  bootstrap: [
    ContratosComponent
  ]
})
export class ContratosModule { }
