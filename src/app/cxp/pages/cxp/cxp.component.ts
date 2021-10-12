import { Component, OnInit, ViewChild } from '@angular/core';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { BancoModel } from 'src/app/core/models/catalogos.models';
import { CxpModel } from 'src/app/core/models/compras.model';
import { BancosService } from 'src/app/core/services/bancos.service';
import { ComprasService } from 'src/app/core/services/compras.service';
import { CxpService } from 'src/app/core/services/cxp.service';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cxp',
  templateUrl: './cxp.component.html',
  styleUrls: ['./cxp.component.css']
})
export class CxpComponent implements OnInit {

 //@ts-ignore
 @ViewChild('sideBar', { static: false }) sideBar: SidebarComponent;

 height: number = screen.height - 165;

  cuentasPorPagar: CxpModel[] = [];

  bancos: BancoModel[] = [];

  selectBank: BancoModel = new BancoModel();

  file: any;

  indexCxpPorPagar: number | null = null;

  constructor(private cxpService: CxpService,
    private ocService: ComprasService,
    private bankService: BancosService) { 
      pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    }

  ngOnInit(): void {

    this.getCxp();

    this.bankService.getBancos().subscribe(bancos => {
      if ( bancos ){
        this.bancos = bancos;
        this.selectBank = bancos[0];
      }
    });

  }

  getCxp(estatus: string = 'all'): void{

    this.cxpService.getCuentasPorPagar( estatus ).subscribe(cxp => {
      this.cuentasPorPagar = cxp.content;
    })

  }

  public revisar(index: number){
    this.cxpService.putRevisar(this.cuentasPorPagar[index].id).subscribe(() => {
      this.cuentasPorPagar[index].sugerido = !this.cuentasPorPagar[index].sugerido;
    });
  }

  public autorizar(index: number){
    this.cxpService.putAutorizar(this.cuentasPorPagar[index].id).subscribe(() => {
      this.cuentasPorPagar[index].autorizado = !this.cuentasPorPagar[index].autorizado;
    });
  }

  public getPago(id: number) {
    
    this.ocService.getPago(id).subscribe(
     (res) => {
        this.file = res;
      }
    );

  }

  public addFile(event: any, index: number): void {

    if ( event.target.files[0]?.type.indexOf('pdf') && event.target.files[0]?.type.indexOf('pdf') < 0){
      Swal.fire('Must be PDF','','error');
    }else {
      this.indexCxpPorPagar = index;
      this.file = event.target.files[0];
      document.getElementById('btnOpenSelectBank')?.click();
    }
      
  }

  public sendPago(): void{
    if ( this.indexCxpPorPagar != null)
      this.cxpService.sendPago(this.cuentasPorPagar[this.indexCxpPorPagar].id,this.file,this.selectBank.id).subscribe(() => {
        
        if ( this.indexCxpPorPagar != null)
        this.cuentasPorPagar.splice(this.indexCxpPorPagar,1);

        this.indexCxpPorPagar = null;
        this.file = null;
      })
  }

  public openSideBar(): void {
    this.sideBar.isOpen = true;
  }

  public openFileWindow(){
    document.getElementById('inputFile')?.click();
  }

  public getPagoCXP(id: number) {
    
    this.cxpService.getPago(id).subscribe(
     (res) => {
        this.file = res;
      }
    );

  }

}
