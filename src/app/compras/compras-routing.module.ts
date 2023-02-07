import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { ComprasComponent } from './compras.component';
import { FormOrdenCompraComponent } from './pages/form-orden-compra/form-orden-compra.component';

const routes: Routes = [
  {
    path: '',
    component: ComprasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'form',
    component: FormOrdenCompraComponent
  },
  {
    path: 'form/:id',
    component: FormOrdenCompraComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
