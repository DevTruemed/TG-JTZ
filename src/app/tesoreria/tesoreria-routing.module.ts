import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepositosComponent } from './pages/depositos/depositos.component';
import { TesoreriaComponent } from './tesoreria.component';

const routes: Routes = [
  {
    path: '',
    component: TesoreriaComponent,
    children: [
      {
        path: 'deposits',
        component: DepositosComponent
      },
      {
        path: 'deposits/:id',
        component: DepositosComponent
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'deposits'
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
export class TesoreriaRoutingModule { }
