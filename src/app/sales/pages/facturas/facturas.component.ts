import { Component, OnInit } from '@angular/core';
import { VentaModel } from 'src/app/core/models/ventas.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { VentasService } from 'src/app/core/services/ventas.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  facturas: VentaModel[] = [];

  height: number = screen.height -165;

  constructor(private ventasService: VentasService, private authService: AuthService) { }

  ngOnInit(): void {

    this.ventasService.getVentas('facturas').subscribe(ventas => {
      this.facturas = ventas.content;
    })

  }

  public cancelar(index: number){
    this.ventasService.cancelar(this.facturas[index].id).subscribe(() => {
      this.facturas[index].estatus.id = 3;
      this.facturas[index].montoAbonos = 0;
      this.facturas[index].estatus.estatus = 'CANCELED';
    })
  }

  public canUpdate(): boolean {return this.authService.canUpdate()};

  public canDelete(): boolean {return this.authService.canDelete()};
}
