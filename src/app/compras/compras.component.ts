import { Component, OnInit, ViewChild } from '@angular/core';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

import { OrdenCompraModel } from '../core/models/compras.model';
import { ComprasService } from '../core/services/compras.service';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  //@ts-ignore
  @ViewChild('sideBar', { static: false }) sideBar: SidebarComponent;

  pago: any;

  ordenesCompras: OrdenCompraModel[] = [];

  height: number = screen.height - 165;

  constructor(private ocService: ComprasService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
   }

  ngOnInit(): void {

    this.getCompras();
  }

  public getCompras(estatus: string = 'creadas'){
    this.ocService.getOrdenesCompra(estatus).subscribe( oc =>{ this.ordenesCompras = oc.content}, err => console.log(err));

  }

  public openSideBar(): void {
    this.sideBar.isOpen = true;
  }

  public cancelOC(index: number): void{
    this.ocService.cancelOrdenCompra(this.ordenesCompras[index].id).subscribe( () => this.ordenesCompras.splice(index,1) );
  }

  public getPago(id: number) {
    
    this.ocService.getPago(id).subscribe(
     (res) => {
        this.pago = res;
      }
    );

  }

}
