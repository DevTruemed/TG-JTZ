import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { TokenGuard } from '../core/guards/token.guard';
import { CustomerPlatformComponent } from './customer-platform.component';
import { ContratosComponent } from './pages/contratos/contratos.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { TicketsFormComponent } from './pages/tickets-form/tickets-form.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPlatformComponent,
    children: [
      {
        path: 'leases',
        component: ContratosComponent,
      },
      {
        path: 'tickets',
        component: TicketsComponent,
      },
      {
        path: 'form',
        component: TicketsFormComponent,
      },
      {
        path: 'form/:id',
        component: TicketsFormComponent
      },
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'leases'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPlatformRoutingModule { }
