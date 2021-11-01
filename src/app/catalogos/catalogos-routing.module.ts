import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { TokenGuard } from '../core/guards/token.guard';
import { CatalogosComponent } from './catalogos.component';
import { FormProveedoresComponent } from './form-proveedores/form-proveedores.component';
import { BancosComponent } from './pages/bancos/bancos.component';
import { CasasComponent } from './pages/casas/casas.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { CuentasComponent } from './pages/cuentas/cuentas.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { AseguradorasComponent } from './pages/aseguradoras/aseguradoras.component';
import { TiposDocumentosComponent } from './pages/tipos-documentos/tipos-documentos.component';
import { TiposContratosComponent } from './pages/tipos-contratos/tipos-contratos.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogosComponent,
    children: [
      {
        path: 'products',
        component: ProductosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'houses',
        component: CasasComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'suppliers',
    component: ProveedoresComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'suppliers/form',
    component: FormProveedoresComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'suppliers/form/:id',
    component: FormProveedoresComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'users',
    component: UsuariosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'accounts',
    component: CuentasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'banks',
    component: BancosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'customers',
    component: ClientesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'insurers',
    component: AseguradorasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'documents',
    component: TiposDocumentosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lease_agreements',
    component: TiposContratosComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogosRoutingModule { }
