import { Component, OnInit } from '@angular/core';
import { VentaModel } from 'src/app/core/models/ventas.model';
import { VentasService } from 'src/app/core/services/ventas.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {

  cotizaciones: VentaModel[] = [];

  height: number = screen.height -165;

  constructor(private ventasService: VentasService) { }

  ngOnInit(): void {

    this.ventasService.getVentas().subscribe(ventas => {this.cotizaciones = ventas.content;})

  }

}
