import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorModel } from 'src/app/core/models/catalogos.models';
import { OrdenCompraModel } from 'src/app/core/models/compras.model';
import { ComprasService } from 'src/app/core/services/compras.service';
import { ProveedoresService } from 'src/app/core/services/proveedores.service';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import Swal from 'sweetalert2';
import { ContratoModel } from '../../../core/models/contratos.model';
import { ContratosService } from '../../../core/services/contratos.service';
import { ProductosService } from '../../../core/services/productos.service';
import { CuentaContableModel } from '../../../core/models/catalogos.models';
import { CcService } from '../../../core/services/cc.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-form-orden-compra',
  templateUrl: './form-orden-compra.component.html',
  styleUrls: ['./form-orden-compra.component.css']
})
export class FormOrdenCompraComponent implements OnInit {

  //@ts-ignore
  @ViewChild('sideBar', { static: false }) sideBar: SidebarComponent;

  formulario!: FormGroup;

  oc: OrdenCompraModel = new OrdenCompraModel();

  proveedores: ProveedorModel[] = [];

  proveedorSelect: ProveedorModel = new ProveedorModel();

  estatus: string = 'Creating...'

  update: boolean = false;

  file: File | null = null;

  contratos: ContratoModel[] = [];

  productosCambiados: {
    id: number,
    producto: string,
    costoInicial: number,
    costoModificado: number
  }[] = [];

  height: number = screen.height - 165;
  width: number = screen.width;

  constructor(private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private proveedoresService: ProveedoresService,
    private contratosService: ContratosService,
    private ocService: ComprasService,
    private authService: AuthService,
    private productosService: ProductosService) {

    if (this.activeRoute.snapshot.params.id) {
      this.update = true;
      this.estatus = 'Created'
    }
    this.inicializarFormulario();

  }

  ngOnInit(): void {

    this.contratosService.getContratos("vigentes").subscribe(contratos => this.contratos = contratos,
      err => console.log);

    if (!this.update)
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
    else
      this.ocService.getOrdenCompra(this.activeRoute.snapshot.params.id).subscribe(oc => {
        this.oc = oc;
        this.estatus = oc.estatus.estatus;
        this.proveedores.push(oc.proveedor);
        this.proveedorSelect = oc.proveedor;
        if (oc.contratoModelo == null) {
          oc.contratoModelo = new ContratoModel();
        } else {
          oc.contrato = oc.contratoModelo.id;
        }
        this.formulario.patchValue(oc);
        this.formulario.get('cuentaContable')?.get('id')?.disable();
        this.formulario.get('propiedad')?.get('id')?.disable();
        this.formulario.get('contrato')?.get('id')?.disable();
        let i: number = 0;
        oc.productos.forEach(p => {
          for (let index = 0; index < this.proveedorSelect.productos.length; index++) {
            if (p.producto.id === this.proveedorSelect.productos[index].producto.id)
              this.addProducto(index, true);
          }
          this.productosForm.at(i).get('cantidad')?.setValue(p.cantidad);
          if (this.estatus != 'CREATED' && this.estatus != 'REVIEWED')
            this.productosForm.at(i).get('cantidad')?.disable();

          this.productosForm.at(i).get('revisado')?.setValue(p.revisado);

          if (this.estatus != 'CREATED')
            this.productosForm.at(i).get('revisado')?.disable();

          if (this.estatus != 'CREATED' && this.estatus != 'REVIEWED')
            this.productosForm.at(i).get('autorizado')?.disable();

          if (!this.canSuggest())
            this.productosForm.at(i).get('revisado')?.disable();

          this.productosForm.at(i).get('autorizado')?.setValue(p.autorizado);

          if (!this.canAuthorize())
            this.productosForm.at(i).get('autorizado')?.disable();
          i++
        });
      })
  }

  get productosForm(): FormArray {
    return this.formulario.get('productos') as FormArray;
  }

  get observacionesForm(): FormArray {
    return this.formulario.get('observaciones') as FormArray;
  }

  public seleccionarProveedor(index: any): void {
    this.productosCambiados = [];
    this.productosForm.controls.forEach(() => this.productosForm.removeAt(0));
    this.formulario.reset();
    this.proveedorSelect = JSON.parse(JSON.stringify(this.proveedores[Number(index)]));
    this.formulario.get('proveedor')?.get('id')?.setValue(this.proveedores[Number(index)].id);
  }

  public selectPropiedad(index: number): void {
    this.formulario.patchValue({ 'propiedad': this.contratos[index].propiedad });
    this.formulario.patchValue({ 'contrato': this.contratos[index].id });
  }

  public addProducto(index: number, created: boolean = false) {
    if (!created) {
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
      )
    } else {
      let producto = this.oc.productos.find(producto => producto.producto.id == this.proveedorSelect.productos[index].producto.id);
      this.productosForm.push(
        this.fb.group({
          costo: [producto?.costo, [Validators.required, Validators.min(.1)]],
          costoInicial: [producto?.costo],
          cantidad: [0, [Validators.required, Validators.min(1)]],
          cantidadAutorizada: [],
          cantidadRevisada: [],
          revisado: [false],
          autorizado: [false],
          producto: this.fb.group({
            id: [producto?.producto.id],
            producto: [producto?.producto.producto, Validators.required]
          })
        })
      )
    }
    this.proveedorSelect.productos.splice(index, 1)

  }

  public removeProducto(index: number): void {

    this.proveedorSelect.productos.unshift({
      'precio': this.productosForm.at(index)?.get('costo')?.value,
      'producto': this.productosForm.at(index)?.get('producto')?.value
    })

    this.productosForm.removeAt(index);

  }

  public actualizarImporte(): void {
    let importe: number = 0;
    this.productosForm.controls.forEach(control => importe += control.get('cantidad')?.value * control.get('costo')?.value)

    this.formulario.get('importe')?.setValue(importe);
  }

  public addOC(): void {

    if (this.formulario.valid) {

      for (let index = 0; index < this.productosForm.controls.length; index++) {
        this.productosForm.at(index).get('autorizado')?.enable();
        this.productosForm.at(index).get('revisado')?.enable();
        this.productosForm.at(index).get('cantidad')?.enable();
      }

      if (!this.update) {
        this.formulario.get('id')?.setValue(null);
        this.ocService.postOrdenCompra(this.formulario.value).subscribe(async (oc) => {
          if (this.productosCambiados.length) {
            for await (const cambiado of this.productosCambiados) {
              const hecho = await this.preguntarProductoCambiado(cambiado, oc.id);
              if (hecho) continue;
            }
          }
          this.router.navigate(['/purchases'])
        })
      } else {

        if (this.estatus != 'AUTHORIZED') {
          this.formulario.get('cuentaContable')?.get('id')?.enable();
          let p: OrdenCompraModel = this.formulario.value;
          this.oc.observaciones.forEach(o => p.observaciones.push(o));
          this.ocService.putOrdenCompra(p).subscribe(() => this.router.navigate(['/purchases']))
        } else {

          if (this.formulario.get('factura')?.value === null || this.formulario.get('factura')?.value === '')
            this.formulario.get('factura')?.markAsTouched();
          else if (this.file != null)
            this.ocService.sendPago(this.activeRoute.snapshot.params.id, this.file, this.formulario.get('factura')?.value).subscribe(() => this.router.navigate(['/purchases']));
          else
            Swal.fire('File not found', 'PDF is required', 'error');
        }
      }
    } else
      return this.markFormGroupTouched(this.formulario);

  }

  public addFile(event: any): void {

    this.file = event.target.files[0];

    if (this.file?.type.indexOf('pdf') && this.file?.type.indexOf('pdf') < 0) {
      Swal.fire('Must be PDF', '', 'error');
      this.file = null;
    }

  }

  public addObservacion(): void {

    this.observacionesForm.push(
      this.fb.group({
        id: [],
        observacion: [, [Validators.required, Validators.minLength(3), Validators.maxLength(300)]]
      })
    );

  }

  public openSideBar(): void {
    this.sideBar.isOpen = true;
  }

  public isValid(form: FormGroup, field: string): boolean {
    //@ts-ignore
    return form.get(field).invalid && form.get(field).touched;
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
      contrato: []
    });

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

  public canCreate(): boolean {return this.authService.canCreate()};

  public canUpdate(): boolean {return this.authService.canUpdate()};

  public canSuggest(): boolean {return this.authService.canSuggest()};

  public canAuthorize(): boolean {return this.authService.canAuthorize()};
}
