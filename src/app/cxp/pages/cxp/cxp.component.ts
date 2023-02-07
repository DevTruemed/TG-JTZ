import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { BancoModel } from 'src/app/core/models/catalogos.models';
import { CxpModel } from 'src/app/core/models/compras.model';
import { BancosService } from 'src/app/core/services/bancos.service';
import { ComprasService } from 'src/app/core/services/compras.service';
import { CxpService } from 'src/app/core/services/cxp.service';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import Swal from 'sweetalert2';
import { IAngularMyDpOptions, AngularMyDatePickerDirective } from 'angular-mydatepicker';
import { AuthService } from 'src/app/core/services/auth.service';

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

  fechaPago: string = '';

  @ViewChild('dp') myDp!: AngularMyDatePickerDirective;

  myOptions: IAngularMyDpOptions = {
    // dateRange: true,
    dateFormat: 'yyyy-mm-dd',
    appendSelectorToBody: false,
  };

  constructor(private cxpService: CxpService,
    private ocService: ComprasService,
    private bankService: BancosService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }

  ngOnInit(): void {

    this.getCxp();

    this.bankService.getBancos().subscribe(bancos => {
      if (bancos) {
        this.bancos = bancos;
        this.selectBank = bancos[0];
      }
    });

  }

  getCxp(estatus: string = 'all'): void {

    this.cxpService.getCuentasPorPagar(estatus).subscribe(cxp => {
      this.cuentasPorPagar = cxp.content;
    })

  }

  public revisar(index: number) {
    this.cxpService.putRevisar(this.cuentasPorPagar[index].id).subscribe(() => {
      this.cuentasPorPagar[index].sugerido = !this.cuentasPorPagar[index].sugerido;
    });
  }

  public autorizar(index: number) {
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

    if (event.target.files[0]?.type.indexOf('pdf') && event.target.files[0]?.type.indexOf('pdf') < 0) {
      Swal.fire('Must be PDF', '', 'error');
    } else {
      this.indexCxpPorPagar = index;
      this.file = event.target.files[0];
      document.getElementById('btnOpenSelectBank')?.click();
    }

  }

  public sendPago(): void {
    if (this.indexCxpPorPagar != null && this.fechaPago.length)
      this.cxpService.sendPago(this.cuentasPorPagar[this.indexCxpPorPagar].id, this.file, this.selectBank.id, this.fechaPago).subscribe(() => {

        if (this.indexCxpPorPagar != null)
          this.cuentasPorPagar.splice(this.indexCxpPorPagar, 1);

        this.indexCxpPorPagar = null;
        this.file = null;
      })
  }

  public openSideBar(): void {
    this.sideBar.isOpen = true;
  }

  public openFileWindow(id: number) {
    document.getElementById('inputFile'+id.toString())?.click();
  }

  public getPagoCXP(id: number) {

    this.cxpService.getPago(id).subscribe(
      (res) => {
        this.file = res;
      }
    );

  }

  toggleCalendar(myDp: AngularMyDatePickerDirective): void {
    this.cdr.detectChanges();
    myDp.toggleCalendar();
  }

  seleccionarFechas(e: any): void {
    this.fechaPago = e.singleDate.formatted;
  }

  public canCreate(): boolean {return this.authService.canCreate()};

  public canRead(): boolean {return this.authService.canRead()};

  public canUpdate(): boolean {return this.authService.canUpdate()};

  public canDelete(): boolean {return this.authService.canDelete()};

  public canSuggest(): boolean {return this.authService.canSuggest()};

  public canAuthorize(): boolean {return this.authService.canAuthorize()};
}
