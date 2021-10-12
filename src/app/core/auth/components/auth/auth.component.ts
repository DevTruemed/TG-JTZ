import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  @Input()
  transparent: boolean = true;

  @Output()
  authEmmiter: EventEmitter<boolean> = new EventEmitter();

  /*********************************************/
  /***** Variables necesarias para el html *****/
  /*********************************************/

  screenWidth: number = screen.width;

  esMovil: boolean = false;

  showPassword: boolean = true;

  /**
   * Formulario reactivo que contiene la información
   * para el inicio de sesión
   * 
   * @type {FormGroup}
   */
  formularioLogin: FormGroup;

  constructor(private router: Router,
              private authService: AuthService,
              private formBuilder: FormBuilder) {

    this.esMovil = (screen.width < 576);
    
    /* Creación y configuración del formulario de login */
    this.formularioLogin = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

  }

  public iniciarSesion(): void {
    Swal.fire(
      { text: 'cargando', 
        allowOutsideClick: false,
        allowEnterKey: false,
        allowEscapeKey: false
      });
    Swal.showLoading();

    this.authService.login( this.formularioLogin.get('username')?.value, this.formularioLogin.get('password')?.value)
      .subscribe(isAuth => {

        Swal.fire({
          icon: 'success',
          text: 'Acceso Correcto',
          showConfirmButton: false,
          timer: 1500
        })
        
        if (isAuth)
          this.router.navigate([ 'catalogs', 'products' ]);
      
  }, (err) => {

    Swal.fire({
      icon: 'error',
      text: 'Error ' + err.status,
      title: err.error.error_description
    });

  });

  }

}
