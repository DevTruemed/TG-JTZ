import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerPlatformRoutingModule } from './customer-platform-routing.module';
import { CoreModule } from '../core/core.module';
import { ContratosComponent } from './pages/contratos/contratos.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { TicketsFormComponent } from './pages/tickets-form/tickets-form.component';
import { CustomerPlatformComponent } from './customer-platform.component';



@NgModule({
  declarations: [CustomerPlatformComponent, ContratosComponent, TicketsComponent, TicketsFormComponent],
  imports: [
    CommonModule,
    CustomerPlatformRoutingModule,
    CoreModule
  ],
  bootstrap: [
    CustomerPlatformComponent
  ]
})
export class CustomerPlatformModule { }
