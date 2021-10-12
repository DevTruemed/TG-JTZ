import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CxpRoutingModule } from './cxp-routing.module';
import { CoreModule } from '../core/core.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CxpComponent } from './pages/cxp/cxp.component';


@NgModule({
  declarations: [
    CxpComponent
  ],
  imports: [
    CommonModule,
    CxpRoutingModule,
    CoreModule,
    NgxExtendedPdfViewerModule
  ]
})
export class CxpModule { }
