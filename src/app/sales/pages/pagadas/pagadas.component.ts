import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { VentaModel } from 'src/app/core/models/ventas.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { VentasService } from 'src/app/core/services/ventas.service';

@Component({
  selector: 'app-pagadas',
  templateUrl: './pagadas.component.html',
  styleUrls: ['./pagadas.component.css']
})
export class PagadasComponent implements OnInit {

  facturas: VentaModel[] = [];

  height: number = screen.height - 165;


  constructor(private ventasService: VentasService, private authService: AuthService) {

  }

  ngOnInit(): void {

    this.ventasService.getVentas('pagadas').subscribe(ventas => {
      this.facturas = ventas.content;
    })

  }

  public cancelar(index: number) {
    this.ventasService.cancelar(this.facturas[index].id).subscribe(() => {
      this.facturas.splice(index, 1);
    })
  }

 generarPDF(id: number){

    this.ventasService.getFactura(id).subscribe(data => {

      let blob = new Blob([data], {type: 'application/pdf'});

      let downloadURL = window.URL.createObjectURL(data);
      let link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'invoice.pdf';
      link.click();

    })

 }

 public canCreate(): boolean {return this.authService.canCreate()};

 public canRead(): boolean {return this.authService.canRead()};

 public canDelete(): boolean {return this.authService.canDelete()};
}
