import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

const ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'catalogs', 
    loadChildren: () => import('./catalogos/catalogos.module').then(m => m.CatalogosModule)
  },
  {
    path: 'purchases',
    loadChildren: () => import('./compras/compras.module').then(m => m.ComprasModule),
  },
  {
    path: 'cxp',
    loadChildren: () => import('./cxp/cxp.module').then(m => m.CxpModule),
  },
  {
    path: 'sales',
    loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
  },
  {
    path: 'treasury',
    loadChildren: () => import('./tesoreria/tesoreria.module').then(m => m.TesoreriaModule),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
