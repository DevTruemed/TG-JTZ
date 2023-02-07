import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { CotizacionComponent } from './pages/cotizacion/cotizacion.component';
import { FacturasComponent } from './pages/facturas/facturas.component';
import { FormComponent } from './pages/form/form.component';
import { PagadasComponent } from './pages/pagadas/pagadas.component';
import { SalesComponent } from './sales.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'quotes',
        component: CotizacionComponent
      },
      {
        path: 'invoices',
        component: FacturasComponent
      },
      {
        path: 'paid',
        component: PagadasComponent
      },
      {
        path: 'form',
        component: FormComponent
      },
      {
        path: 'form/:id',
        component: FormComponent
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'quotes'
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
