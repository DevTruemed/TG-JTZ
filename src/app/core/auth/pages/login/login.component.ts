import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router) {

    if (this.authService.isAuth()) {
      let accesos = JSON.parse(localStorage.getItem('accesos')!) || [];
      if (accesos.find((acceso: any) => acceso.ruta ? acceso.ruta.includes("platform") : false)) {
        this.router.navigate(['platform', 'contratos']);
      } else {
        this.router.navigate(['catalogs', 'products']);
      }
    }

  }

  ngOnInit(): void {
  }

}
