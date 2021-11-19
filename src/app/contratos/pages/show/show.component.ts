import { Component, OnInit } from '@angular/core';
import { ContratosService } from '../../../core/services/contratos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ContratoModel } from '../../../core/models/contratos.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TicketsService } from '../../../core/services/tickets.service';
import { ProveedorModel } from '../../../core/models/catalogos.models';
import { ComprasService } from '../../../core/services/compras.service';
import { ProveedoresService } from '../../../core/services/proveedores.service';
import { ProductosService } from '../../../core/services/productos.service';
import { OrdenCompraModel } from '../../../core/models/compras.model';
import { TicketModel } from '../../../core/models/tickets.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  formulario!: FormGroup;
  contrato: ContratoModel = new ContratoModel();
  oc: OrdenCompraModel = new OrdenCompraModel();
  proveedores: ProveedorModel[] = [];
  proveedorSelect: ProveedorModel = new ProveedorModel();
  productosCambiados: {
    id: number,
    producto: string,
    costoInicial: number,
    costoModificado: number
  }[] = [];
  estatus: string = 'Creating...'
  height: number = screen.height - 165;
  width: number = screen.width;
  idTicketSeleccionado: number = 0;
  constructor(private fb: FormBuilder,
    private contratosService: ContratosService,
    private ticketsService: TicketsService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private ocService: ComprasService,
    private proveedoresService: ProveedoresService,
    private productosService: ProductosService) {

    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.contratosService.getContrato(this.activeRoute.snapshot.params.id).subscribe(contrato => this.contrato = contrato,
      err => this.router.navigate(['/leases']));

    this.proveedoresService.getProveedores().subscribe(p => {
      this.proveedores = p;
      if (this.proveedores.length > 0) {
        this.proveedorSelect = this.proveedores[0];
        if (this.proveedorSelect.cuentasContables === undefined || this.proveedorSelect.cuentasContables === null)
          this.proveedorSelect.cuentasContables = [];
        else if (this.proveedorSelect.cuentasContables.length > 0)
          this.formulario.get('cuentaContale')?.get('id')?.setValue(this.proveedores[0].cuentasContables[0].id);
        this.formulario.get('proveedor')?.get('id')?.setValue(this.proveedores[0].id);
      }
    });
  }

  cambiarEstatus(index: number, estatus: boolean): void {
    let ticket = this.contrato.tickets[index];
    if (!ticket.observacion) ticket.observacion = '';
    this.ticketsService.updateEstatus(ticket.id, estatus, ticket.observacion).subscribe(res => {
      this.contrato.tickets[index] = res;
      this.askCrearODC(res, estatus);
    });
  }

  askCrearODC(ticket: TicketModel, estatus: boolean): void {
    if (estatus) {
      Swal.fire({
        icon: 'question',
        title: 'Do you want to create a purchase order?',
        showCancelButton: true,
        cancelButtonText: 'No',
        cancelButtonColor: 'red',
        confirmButtonText: 'Yes',
        confirmButtonColor: 'green',
        allowOutsideClick: false,
      }).then(res => {
        if (res.isConfirmed) {
          document.getElementById('openODCModal')?.click();
          this.formulario.patchValue({ 'ticket': ticket.id });
          this.formulario.patchValue({ 'contrato': this.contrato.id });
          this.idTicketSeleccionado = ticket.id;
        }
      });
    }
  }

  saveComment(index: number): void {
    let ticket = this.contrato.tickets[index];

    if (!ticket.observacion) ticket.observacion = '';

    this.ticketsService.updateComentario(ticket.id, ticket.observacion).subscribe(res => {
      this.contrato.tickets[index] = res;
    });
  }

  get total(): number {
    return this.contrato.pagos.reduce((sum: any, value: any) => (sum + value['monto']), 0);
  }

  public seleccionarProveedor(index: any): void {
    this.productosCambiados = [];
    this.productosForm.controls.forEach(() => this.productosForm.removeAt(0));
    this.formulario.reset();
    this.proveedorSelect = JSON.parse(JSON.stringify(this.proveedores[Number(index)]));
    this.formulario.get('proveedor')?.get('id')?.setValue(this.proveedores[Number(index)].id);
    this.formulario.patchValue({ 'ticket': this.idTicketSeleccionado });
    this.formulario.patchValue({ 'contrato': this.contrato.id });
  }

  public addOC(): void {

    if (this.formulario.valid) {

      for (let index = 0; index < this.productosForm.controls.length; index++) {
        this.productosForm.at(index).get('autorizado')?.enable();
        this.productosForm.at(index).get('revisado')?.enable();
        this.productosForm.at(index).get('cantidad')?.enable();
      }

      this.formulario.get('id')?.setValue(null);
      this.ocService.postOrdenCompra(this.formulario.value).subscribe(async (newODC) => {
        if (this.productosCambiados.length) {
          for await (const cambiado of this.productosCambiados) {
            const hecho = await this.preguntarProductoCambiado(cambiado, newODC.id);
            if (hecho) continue;
          }
          this.productosCambiados = [];
        }
        let ticket = this.contrato.tickets.find(ticket => ticket.id == this.formulario.get('ticket')?.value);
        ticket!.odc = newODC.id;
        document.getElementById('closeODCModal')?.click();
        this.formulario.reset();
        this.ngOnInit();
      });

    } else
      return this.markFormGroupTouched(this.formulario);

  }

  get productosForm(): FormArray {
    return this.formulario.get('productos') as FormArray;
  }

  get observacionesForm(): FormArray {
    return this.formulario.get('observaciones') as FormArray;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    //@ts-ignore
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private inicializarFormulario(): void {

    this.formulario = this.fb.group({
      id: ['NA'],
      importe: [0, [Validators.min(0)]],
      importeAutorizado: [0, [Validators.min(0)]],
      factura: [],
      proveedor: this.fb.group({
        id: [0, Validators.required]
      }),
      cuentaContable: this.fb.group({
        id: [0, Validators.required]
      }),
      productos: this.fb.array([]),
      observaciones: this.fb.array([]),
      propiedad: this.fb.group({
        id: [],
        tipo: this.fb.group({
          tipo: []
        }),
        direccion: []
      }),
      contrato: [],
      ticket: []
    });

  }

  public addProducto(index: number) {
    this.productosForm.push(
      this.fb.group({
        costo: [this.proveedorSelect.productos[index].precio, [Validators.required, Validators.min(.1)]],
        costoInicial: [this.proveedorSelect.productos[index].precio],
        cantidad: [0, [Validators.required, Validators.min(1)]],
        cantidadAutorizada: [],
        cantidadRevisada: [],
        revisado: [false],
        autorizado: [false],
        producto: this.fb.group({
          id: [this.proveedorSelect.productos[index].producto.id],
          producto: [this.proveedorSelect.productos[index].producto.producto, Validators.required]
        })
      })
    );
    this.proveedorSelect.productos.splice(index, 1)
  }

  public removeProducto(index: number): void {
    this.proveedorSelect.productos.unshift({
      'precio': this.productosForm.at(index)?.get('costo')?.value,
      'producto': this.productosForm.at(index)?.get('producto')?.value
    });
    this.productosForm.removeAt(index);
  }

  public addObservacion(): void {
    this.observacionesForm.push(
      this.fb.group({
        id: [],
        observacion: [, [Validators.required, Validators.minLength(5), Validators.maxLength(300)]]
      })
    );
  }

  public actualizarImporte(): void {
    let importe: number = 0;
    this.productosForm.controls.forEach(control => importe += control.get('cantidad')?.value * control.get('costo')?.value)

    this.formulario.get('importe')?.setValue(importe);
  }

  addProductosCambiados(e: any) {
    let index = this.productosCambiados.findIndex(item => item.id == e.producto.id);
    if (index == -1) {
      this.productosCambiados.unshift({ id: e.producto.id, producto: e.producto.producto, costoInicial: e.costoInicial, costoModificado: e.costo });
    } else {
      let producto = this.productosCambiados[index];
      if (producto?.costoInicial == e.costo) {
        this.productosCambiados.splice(index, 1);
      }
      if (producto.costoModificado != e.costo) {
        producto.costoModificado = e.costo;
      }
    }
  }

  async preguntarProductoCambiado(cambiado: any, idOc: number) {
    const inputOptions = {
      'update': 'Update supplier price',
      'create': 'Create new product',
      'ignore': 'Ignore'
    };

    // @ts-ignore
    const { value: option } = await Swal.fire({
      title: 'Advice',
      text: `The following product has changed its price \n Product: ${cambiado.producto} -- Old price: ${cambiado.costoInicial} -- New price: ${cambiado.costoModificado}`,
      input: 'radio',
      inputOptions: inputOptions,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to choose one!'
        }
        return false;
      }
    })

    switch (option) {
      case 'update':
        this.productosService.putPrecioProveedor(this.proveedorSelect.id, cambiado.id, cambiado.costoModificado).subscribe(res => { });
        break;

      case 'create':
        // @ts-ignore
        const { value: nombre } = await Swal.fire({
          title: `Type product name`,
          input: 'text',
          inputLabel: 'Name: ',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'You need to write something!'
            } else {
              return false;
            }
          }
        });
        if (nombre) {
          this.productosService.cloneProduct(cambiado.id, nombre, cambiado.costoModificado, this.proveedorSelect.id, idOc).subscribe(res => { });
        }
        break;

      default:
        break;
    }
    return true;
  }
}
