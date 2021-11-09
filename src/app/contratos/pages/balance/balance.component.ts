import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BancoModel, ProveedorModel } from '../../../core/models/catalogos.models';
import { BancosService } from '../../../core/services/bancos.service';
import { ProveedoresService } from '../../../core/services/proveedores.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ContratosService } from '../../../core/services/contratos.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {

  formularioDeposito !: FormGroup;

  formularioPago !: FormGroup;

  depositos: any[] = [];

  bancos: BancoModel[];

  pagos: any[] = [];

  proveedores: ProveedorModel[] = [];

  bancoSeleccionado: BancoModel = new BancoModel();

  proveedorSeleccionado: ProveedorModel = new ProveedorModel();

  constructor(private bancosService: BancosService,
    private proveedoresService: ProveedoresService,
    private contratosService: ContratosService,
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute) {
    this.bancos = [];
    this.inicializarFormularios();
  }

  ngOnInit(): void {
    this.bancosService.getBancos().subscribe(bancos => {
      if (bancos && bancos.length > 0) {
        this.bancos = bancos;
        this.selectBanco(0);
      }
    });

    this.contratosService.getContrato(this.activeRoute.snapshot.params.id).subscribe(contrato => {
      this.depositos = contrato.depositos;
      this.pagos = contrato.pagos;
    },
      err => this.router.navigate(['/leases']));
  }

  public agregarDeposito(): void {
    this.formularioDeposito.patchValue({ 'contrato': { id: this.activeRoute.snapshot.params.id } });
    if (this.formularioDeposito.valid) {
      this.contratosService.addPago(this.formularioDeposito.value).subscribe(() => {
        this.ngOnInit()
        document.getElementById('closeModalDeposito')?.click();
      },
        err => console.log(err));
    } else
      return Object.values(this.formularioDeposito.controls).forEach(control => control.markAsTouched());

  }

  public agregarPago(): void {
    this.formularioPago.patchValue({ 'contrato': { id: this.activeRoute.snapshot.params.id } });
    this.formularioPago.patchValue({ 'tipoEntrada': false });
    if (this.formularioPago.valid) {
      this.contratosService.addPago(this.formularioPago.value).subscribe(() => {
        this.ngOnInit();
        document.getElementById('closeModalPago')?.click();
      },
        err => console.log(err));
    } else
      return Object.values(this.formularioPago.controls).forEach(control => control.markAsTouched());

  }

  get total(): number {
    let depositos = this.depositos.reduce((sum: any, value: any) => (sum + value['monto']), 0);
    let pagos = this.pagos.reduce((sum: any, value: any) => (sum + value['monto']), 0);
    return depositos - pagos;
  }

  public selectBanco(index: number) {
    this.bancoSeleccionado = this.bancos[index];
    this.formularioPago.get('banco')?.patchValue(this.bancos[index]);
    this.formularioDeposito.get('banco')?.patchValue(this.bancos[index]);
  }

  public selectProveedor(index: number) {
    this.proveedorSeleccionado = this.proveedores[index];
    this.formularioPago.get('proveeder')?.patchValue(this.proveedores[index]);
  }

  public getProveedores(): void {
    if ((this.proveedores === null || this.proveedores.length === 0))
      this.proveedoresService.getProveedores().subscribe(proveedores => {
        this.proveedores = proveedores;
        this.formularioPago.get('proveedor')?.patchValue(this.proveedores[0]);
        this.selectProveedor(0);
      });
  }

  public reiniciarModals() {
    this.formularioDeposito.reset();
    this.formularioPago.reset();
  }

  public isValid(form: FormGroup, field: string): boolean {
    //@ts-ignore
    return form.get(field).invalid && form.get(field).touched;
  }

  private inicializarFormularios(): void {


    this.formularioDeposito = this.fb.group({

      monto: ['', [Validators.required, Validators.min(1)]],
      banco: this.fb.group({
        id: [],
        banco: [],
        cuenta: [],
        saldo: []
      }),
      contrato: this.fb.group({
        id: [0],
      }),
      concepto: ['', [Validators.max(150), Validators.required]],
      tipoEntrada: [1]
    });

    this.formularioPago = this.fb.group({

      monto: [0, [Validators.required, Validators.min(0)]],

      banco: this.fb.group({
        id: [],
        banco: [],
        cuenta: [],
        saldo: []
      }),
      proveedor: this.fb.group({
        id: [],
        proveedor: []
      }),
      contrato: this.fb.group({
        id: [0],
      }),
      concepto: ['', [Validators.max(150), Validators.required]],
      tipoEntrada: [0]

    });

  }
}
