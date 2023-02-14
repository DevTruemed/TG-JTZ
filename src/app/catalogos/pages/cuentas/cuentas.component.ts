import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuentaContableModel, TipoModel } from 'src/app/core/models/catalogos.models';
import { AuthService } from 'src/app/core/services/auth.service';
import { CcService } from 'src/app/core/services/cc.service';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {

  //@ts-ignore 
  @ViewChild('sideBar', { static: false }) sideBar: SidebarComponent;

  cuentas: CuentaContableModel[];

  subCuentas: CuentaContableModel[] = [];

  formularioCC!: FormGroup;

  update: number | null;

  height: number = screen.height - 165;

  addSubCuenta: boolean = false;

  constructor(private ccService: CcService,
    private authService: AuthService,
    private fb: FormBuilder) {

    this.inicializarFormularios();

    this.cuentas = [];

    this.update = null;

  }

  ngOnInit(): void {

    this.ccService.getCuentas().subscribe(cuentas => this.cuentas = cuentas);

    this.ccService.getSubCuentas().subscribe(sub => this.subCuentas = sub);

  }

  public isValid(form: FormGroup, field: string): boolean {
    //@ts-ignore
    return form.get(field).invalid && form.get(field).touched;
  }

  public agregarCC(): void {
    
    if (this.formularioCC.valid) {

      if (this.update === null) {
        Swal.fire({
          text: 'Cargando',
          allowEscapeKey: false,
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.ccService.postCuenta(this.formularioCC.value).subscribe(cc => {

          if (!this.addSubCuenta)
            this.cuentas.push(cc);
          else
            this.subCuentas.push(cc);

          document.getElementById('closeModalCC')?.click();
          Swal.close();
        }, err => {console.log(err); Swal.close()})
      } else {
        Swal.fire({
          text: 'Cargando',
          allowEscapeKey: false,
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.ccService.putCuenta(this.formularioCC.value).subscribe(cc => {

          if ( this.update != null ){
            if (!this.addSubCuenta)
              this.cuentas[this.update] = cc;
            else
              this.subCuentas[this.update] = cc;
          }
          document.getElementById('closeModalCC')?.click();
          Swal.close();
        }, err => {console.log(err); Swal.close()})
      }
    } else {
      return Object.values(this.formularioCC.controls).forEach(control => control.markAsTouched());
    }

  }

  public borrarCC(index: number, arreglo: CuentaContableModel[] = this.cuentas): void {
    this.ccService.deleteCuenta(arreglo[index].id).subscribe(() => arreglo.splice(index, 1));
  }
  public prepararCCmodificar(index: number, account: boolean = true, tipo: string): void {

    this.update = index;

    if (account){
      this.formularioCC.patchValue(this.cuentas[index]);
      if (tipo === 'read') {
        document.getElementById('readAccountButton')?.click();
      }
      if (tipo === 'update') {
        document.getElementById('addAccountButton')?.click();
      }
    }else{
      this.formularioCC.patchValue(this.subCuentas[index]);
      //@ts-ignore
      this.formularioCC.get('padre')?.setValue(this.subCuentas[index].padre.id);
      if (tipo === 'read') {
        document.getElementById('readTypeButton')?.click();
      }
      if (tipo === 'update') {
        document.getElementById('addTypeButton')?.click();
      }
    }
  }

  public reiniciarModals(): void {
    this.formularioCC.reset();
    this.update = null;
  }

  public openSideBar(): void {
    this.sideBar.isOpen = true;
  }

  private inicializarFormularios(): void {

    this.formularioCC = this.fb.group({
      id: [null],
      cuenta: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      ingreso:[true, Validators.required],
      codigo:[,[Validators.min(0)]],
      padre: [,[Validators.min(0)]]
    });

  }

  public canCreate(): boolean {return this.authService.canCreate()};

  public canRead(): boolean {return this.authService.canRead()};

  public canUpdate(): boolean {return this.authService.canUpdate()};

  public canDelete(): boolean {return this.authService.canDelete()};

}
