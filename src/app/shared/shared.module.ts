import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DomSeguroPipe } from './pipes/dom-seguro.pipe';
import { CodePipe } from './pipes/code.pipe';
import { CutTextPipe } from './pipes/cut-text.pipe';


@NgModule({
  declarations: [
    NavbarComponent, 
    SidebarComponent, 
    DomSeguroPipe, CodePipe, CutTextPipe],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    DomSeguroPipe, 
    CodePipe,
    CutTextPipe
  ]
})
export class SharedModule { }
