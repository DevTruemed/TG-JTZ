import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContratosComponent } from './contratos.component';
import { VencidosComponent } from './pages/vencidos/vencidos.component';
import { VigentesComponent } from './pages/vigentes/vigentes.component';
import { TokenGuard } from '../core/guards/token.guard';
import { FormComponent } from './pages/form/form.component';
import { ShowComponent } from './pages/show/show.component';

const routes: Routes = [
  {
    path: '',
    component: ContratosComponent,
    children: [
      {
        path: 'vigentes',
        component: VigentesComponent,
        canActivate: [TokenGuard]
      },
      {
        path: 'vencidos',
        component: VencidosComponent,
        canActivate: [TokenGuard]
      },
      {
        path: 'form',
        component: FormComponent,
        canActivate: [TokenGuard]
      },
      {
        path: 'show/:id',
        component: ShowComponent,
        canActivate: [TokenGuard]
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'vigentes'
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
export class ContratosRoutingModule { }
