import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogosRoutingModule } from './catalogos-routing.module';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { SharedModule } from '../shared/shared.module';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { CoreModule } from '../core/core.module';
import { CuentasComponent } from './pages/cuentas/cuentas.component';
import { BancosComponent } from './pages/bancos/bancos.component';
import { FormProveedoresComponent } from './form-proveedores/form-proveedores.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { CatalogosComponent } from './catalogos.component';
import { CasasComponent } from './pages/casas/casas.component';
import { AseguradorasComponent } from './pages/aseguradoras/aseguradoras.component';
import { CasasImpuestosComponent } from './pages/casas-impuestos/casas-impuestos.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
  declarations: [
    ProveedoresComponent,
    UsuariosComponent,
    ProductosComponent,
    CuentasComponent,
    BancosComponent,
    FormProveedoresComponent,
    ClientesComponent,
    CatalogosComponent, CasasComponent,
    AseguradorasComponent,
    CasasImpuestosComponent
  ],
  imports: [
    CommonModule,
    CatalogosRoutingModule,
    CoreModule,
    AngularMyDatePickerModule
  ],
  bootstrap: [
    CatalogosComponent
  ]
})
export class CatalogosModule { }
