import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  ancho: number = 60;

  isOpen: boolean = false;

  isMovil: boolean = false;

  accesos: AccesoModel[] = [];

  @HostListener('mouseenter') mouseHover(eventData: Event) {
    if (!this.isMovil) {
      this.ancho = 250;
      this.isOpen = true;
    }
  }

  @HostListener('mouseleave') mouseLeave(eventData: Event) {
    if (!this.isMovil) {
      this.ancho = 60;
      this.isOpen = false;
    }
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.isMovil = screen.width < 576;

    if (this.isMovil) this.ancho = screen.width;

    if (localStorage.getItem('accesos') != undefined && localStorage.getItem('accesos') != null)
      //@ts-ignore
      this.accesos = JSON.parse(localStorage.getItem("accesos"))
  }

  cerrar() {
    this.isOpen = false;
  }

  ngOnInit(): void {

  }

  public navegar(ruta: string | null) {

    if ( ruta != null ){

      let lista: string[] = ruta.split(',');

      this.router.navigate(lista);

    }

  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }


}

class AccesoModel {
  id: number;
  ruta: string | null;
  icono: string;
  hijos: AccesoModel[];
  nombre: string;

  constructor() {
    this.id = 0;
    this.ruta = null;
    this.icono = '';
    this.hijos = [];
    this.nombre = '';

  }
}