import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { LoginComponent } from './auth/pages/login/login.component';
import { AuthComponent } from './auth/components/auth/auth.component';
import { TokenInterceptor } from './interceptors/token-interceptor.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [LoginComponent, AuthComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CoreModule { }
