import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BancoModel, ClienteModel, ProveedorModel } from 'src/app/core/models/catalogos.models';
import { BancosService } from 'src/app/core/services/bancos.service';
import { ClientesService } from 'src/app/core/services/clientes.service';
import { ProveedoresService } from 'src/app/core/services/proveedores.service';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { ContratosService } from '../../../core/services/contratos.service';
import { ContratoModel } from '../../../core/models/contratos.model';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.css']
})
export class BancosComponent implements OnInit {

  //@ts-ignore
  @ViewChild('sideBar', { static: false }) sideBar: SidebarComponent;

  formularioBanco !: FormGroup;

  formularioDeposito !: FormGroup;

  formularioPago !: FormGroup;

  clientes: ClienteModel[] = [];

  proveedores: ProveedorModel[] = [];

  bancos: BancoModel[];

  contratos: ContratoModel[] = [];

  bancoSeleccionado: BancoModel = new BancoModel();

  clienteSeleccionado: ClienteModel = new ClienteModel();

  proveedorSeleccionado: ProveedorModel = new ProveedorModel();

  depositos: any[] = [];

  pagos: any[] = [];

  update: number | null;

  height: number = screen.height - 165;

  constructor(private bancosService: BancosService,
    private proveedoresService: ProveedoresService,
    private clientesService: ClientesService,
    private contratosService: ContratosService,
    private fb: FormBuilder) {

    this.update = null;

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

    this.getMovimientos(null);

    this.contratosService.getContratos("vigentes").subscribe(contratos => this.contratos = contratos,
      err => console.log);

  }

  public getClientesOrProveedores(clientes: boolean = true): void {
    if (clientes && (this.clientes === null || this.clientes.length === 0))
      this.clientesService.getClientes().subscribe(clientes => {
        this.clientes = clientes;
        this.selectCliente(0);
        this.clientes.forEach(cliente => {
          cliente.contratos = this.contratos.filter(contrato => contrato.cliente.id == cliente.id);
        });
      })

    else if (!clientes && (this.proveedores === null || this.proveedores.length === 0))
      this.proveedoresService.getProveedores().subscribe(proveedores => {
        this.proveedores = proveedores;
        this.formularioPago.get('proveedor')?.patchValue(this.proveedores[0]);
        this.selectProveedor(0);
      });
  }

  public getMovimientos(id: number | null) {
    this.bancosService.getMovimientos(id).subscribe(movimientos => {
      this.depositos = movimientos.depositos;
      this.pagos = movimientos.pagos;
    });
  }

  public agregarBanco(): void {

    if (this.formularioBanco.valid) {

      if (this.update === null)
        this.bancosService.postBanco(this.formularioBanco.value).subscribe(banco => {

          this.bancos.push(banco);
          document.getElementById('closeModal')?.click();

        });
      else
        this.bancosService.putBanco(this.formularioBanco.value).subscribe(banco => {

          if (this.update)
            this.bancos[this.update] = banco;

          document.getElementById('closeModal')?.click();

        });
    } else
      return Object.values(this.formularioBanco.controls).forEach(control => control.markAsTouched());

  }

  public borrarBanco(index: number): void {
    this.bancosService.deleteBanco(this.bancos[index].id).subscribe(() => {
      this.bancos.splice(index, 1);
    });
  }

  public prepararUpdate(index: number): void {
    this.update = index;
    this.formularioBanco.patchValue(this.bancos[index]);
    document.getElementById('addButton')?.click();
  }

  public isValid(form: FormGroup, field: string): boolean {
    //@ts-ignore
    return form.get(field).invalid && form.get(field).touched;
  }

  public reiniciarModals() {
    this.formularioBanco.reset();
    this.update = null;
  }

  public openSideBar(): void {
    this.sideBar.isOpen = true;
  }

  public agregarDeposito(): void {

    if (this.formularioDeposito.valid) {
      this.bancosService.postDeposito(this.formularioDeposito.value).subscribe(deposito => {
        this.depositos.unshift(deposito);
        document.getElementById('closeModalDeposito')?.click();
        this.bancoSeleccionado.saldo += deposito.monto;
        this.clienteSeleccionado.saldo += deposito.monto;
      });
    } else
      return Object.values(this.formularioDeposito.controls).forEach(control => control.markAsTouched());

  }

  public agregarPago(): void {

    if (this.formularioPago.valid) {
      this.bancosService.postPago(this.formularioPago.value).subscribe(pago => {
        this.pagos.unshift(pago);
        document.getElementById('closeModalPago')?.click();
        this.bancoSeleccionado.saldo -= pago.monto;
      });
    } else
      return Object.values(this.formularioPago.controls).forEach(control => control.markAsTouched());

  }

  public selectBanco(index: number) {
    this.bancoSeleccionado = this.bancos[index];
    this.formularioPago.get('banco')?.patchValue(this.bancos[index]);
    this.formularioDeposito.get('banco')?.patchValue(this.bancos[index]);
  }

  public selectCliente(index: number) {
    this.clienteSeleccionado = this.clientes[index];
    this.formularioDeposito.get('cliente')?.patchValue(this.clientes[index]);
  }

  public selectProveedor(index: number) {
    this.proveedorSeleccionado = this.proveedores[index];
    this.formularioPago.get('provider')?.patchValue(this.proveedores[index]);
  }

  public selectPropiedad(index: number): void {
    if (this.clienteSeleccionado.id) {
      this.formularioDeposito.patchValue({ 'propiedad': this.clienteSeleccionado.contratos[index].propiedad });
      this.formularioDeposito.patchValue({ 'contrato': this.clienteSeleccionado.contratos[index] });
    }

    this.formularioPago.patchValue({ 'propiedad': this.contratos[index].propiedad });
    this.formularioPago.patchValue({ 'contrato': this.contratos[index] });
  }

  private inicializarFormularios(): void {

    this.formularioBanco = this.fb.group({

      id: [null],
      banco: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      cuenta: [null, [Validators.required, Validators.min(100000)]],
      saldo: [null, [Validators.required, Validators.min(0)]]

    });

    this.formularioDeposito = this.fb.group({

      monto: [0, [Validators.required, Validators.min(1)]],
      banco: this.fb.group({
        id: [],
        banco: [],
        cuenta: [],
        saldo: []
      }),
      cliente: this.fb.group({
        id: [],
        cliente: [],
        saldo: []
      }),
      propiedad: this.fb.group({
        id: [],
        tipo: this.fb.group({
          tipo: []
        }),
        direccion: []
      }),
      contrato: this.fb.group({
        id: []
      })

    });

    this.formularioPago = this.fb.group({

      monto: [0, [Validators.required, Validators.min(0)]],

      banco: this.fb.group({
        id: [],
        banco: [],
        cuenta: [],
        saldo: []
      }),

      provider: this.fb.group({
        id: [],
        proveedor: []
      }),

      propiedad: this.fb.group({
        id: [],
        tipo: this.fb.group({
          tipo: []
        }),
        direccion: []
      }),

      contrato: this.fb.group({
        id: []
      })

    });

  }

}
