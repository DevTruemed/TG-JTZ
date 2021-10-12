import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CxpComponent } from './pages/cxp/cxp.component';

const routes: Routes = [
  {
    path: '',
    component: CxpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CxpRoutingModule { }
