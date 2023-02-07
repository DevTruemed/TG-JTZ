import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentaContableModel, TipoModel } from 'src/app/core/models/catalogos.models';
import { ProductoModel } from 'src/app/core/models/catalogos.models';
import { AuthService } from 'src/app/core/services/auth.service';
import { BancosService } from 'src/app/core/services/bancos.service';
import { ProductosService } from 'src/app/core/services/productos.service';
import { ProveedoresService } from 'src/app/core/services/proveedores.service';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-proveedores',
  templateUrl: './form-proveedores.component.html',
  styleUrls: ['./form-proveedores.component.css']
})
export class FormProveedoresComponent implements OnInit {

  //@ts-ignore
  @ViewChild('sideBar', { static: false }) sideBar: SidebarComponent;

  formulario!: FormGroup;

  productos: ProductoModel[] = [];

  productSelect: ProductoModel | null = null;

  tiposPago: TipoModel[] = [];

  height: number = screen.height - 165;

  update: boolean = false;

  constructor(private fb: FormBuilder,
    private productosService: ProductosService,
    private proveedorService: ProveedoresService,
    private authService: AuthService,
    private bancoService: BancosService,
    private router: Router,
    private activeRoute: ActivatedRoute) {

    this.inicializarFormularios();

    if (activeRoute.snapshot.params.id) {
      this.update = true;
    }

    console.log(this.canCreate());
    console.log(this.canUpdate());

  }

  ngOnInit(): void {



    if (!this.update) {
      this.bancoService.getTiposPago().subscribe(tipos => this.tiposPago = tipos);
      this.productosService.getProductos('compra').subscribe(p => this.productos = p, err => console.log(err))
    }
    if (this.update) {
      this.proveedorService.getProveedor(this.activeRoute.snapshot.params.id).subscribe(p => {
        this.bancoService.getTiposPago().subscribe(tipos => {
          this.tiposPago = tipos;

          p.tiposPago.forEach(pago => {
            for (let index = 0; index < this.tiposPago.length; index++) {
              const element = this.tiposPago[index];
              if (element.id === pago.tipo.id) {
                this.addPago(index + "");
                this.tiposPagoProveedor.at(this.tiposPagoProveedor.length - 1).get('informacion')?.setValue(pago.informacion);
                break;
              }

            }
          });

        });
        this.formulario.patchValue(p);

        this.productosService.getProductos().subscribe(pr => {

          this.productos = pr;

          if (p.productos) {
            let i = 0;
            p.productos.forEach(p => {
              for (let index = 0; index < this.productos.length; index++) {
                const element = this.productos[index];
                if (element.id === p.producto.id) {
                  this.selectProducto(index, p.precio);
                }
              }

              i++;
            })

          }

        }, err => console.log(err))


      })
    }

  }

  get productosProveedor() {
    return this.formulario.get('productos') as FormArray;
  }

  get cuentasProveedor() {
    return this.formulario.get('cuentasContables') as FormArray;
  }

  get tiposPagoProveedor() {
    return this.formulario.get('tiposPago') as FormArray;
  }

  public agregarProveedor(): void {
    if (this.cuentasProveedor.length === 0) {
      Swal.fire({ icon: 'info', title: 'You must link at least 1 accountig account' })
      return;
    }

    if (this.productosProveedor.length === 0) {
      Swal.fire({ icon: 'info', title: 'You must link at least 1 product' })
      return;
    }

    if (this.formulario.valid) {

      if (!this.update)
        this.proveedorService.postProveedor(this.formulario.value).subscribe(res => {
          this.router.navigate(['/catalogs', 'suppliers'])
        })
      else
        this.proveedorService.putProveedor(this.formulario.value).subscribe(res => {
          this.router.navigate(['/catalogs', 'suppliers'])
        })

    } else {
      return this.markFormGroupTouched(this.formulario);
    }
  }

  public addCC(cuenta: CuentaContableModel): void {

    for (let index = 0; index < this.cuentasProveedor.length; index++) {

      if (this.cuentasProveedor.at(index).get('id')?.value === cuenta.id)
        return;

    }

    this.cuentasProveedor.push(
      this.fb.group({
        id: [cuenta.id],
        cuenta: [cuenta.cuenta]
      })
    )

  }

  public addPago(index: string): void {

    let pago: TipoModel = this.tiposPago[Number(index)];

    this.tiposPagoProveedor.push(
      this.fb.group({
        informacion: [],
        tipo: this.fb.group({
          id: [pago.id, Validators.required],
          tipo: [pago.tipo, Validators.required]
        })
      })
    )

    this.tiposPago.splice(Number(index), 1);

  }

  public removePago(index: number): void {

    this.tiposPago.unshift(this.tiposPagoProveedor.at(index).get('tipo')?.value);

    this.tiposPagoProveedor.removeAt(index);

  }

  public showProducto(index: number): void {
    this.productSelect = this.productos[index];
  }

  public selectProducto(index: number, precio = 0): void {
    this.productSelect = null
    this.productosProveedor.push(
      this.fb.group({
        precio: [precio, [Validators.required, Validators.min(.1)]],
        producto: this.fb.group({
          id: [this.productos[index].id],
          producto: [this.productos[index].producto, [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
          descripcion: [this.productos[index].descripcion, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
          precio: [this.productos[index].precio, [Validators.required, Validators.min(0)]],
          existencia: [this.productos[index].existencia, [Validators.required, Validators.min(0)]],
          cuenta: this.fb.group({
            id: [this.productos[index].cuenta.id],
            cuenta: [this.productos[index].cuenta.cuenta]
          })
        })
      })
    )

    this.addCC(this.productos[index].cuenta);

    this.productos.splice(index, 1)
  }

  public removeProducto(index: number): void {

    //@ts-ignore
    this.productos.unshift(this.productosProveedor.at(index).get('producto').value)
    this.productosProveedor.removeAt(index);

    while (this.cuentasProveedor.length !== 0) {
      this.cuentasProveedor.removeAt(0)
    }

    for (let index = 0; index < this.productosProveedor.length; index++) {

      this.addCC(this.productosProveedor.at(index).get('producto')?.get('cuenta')?.value);

    }

  }

  public isValid(form: FormGroup, field: string): boolean {
    //@ts-ignore
    return form.get(field).invalid && form.get(field).touched;
  }

  public openSideBar(): void {
    this.sideBar.isOpen = true;
  }

  private inicializarFormularios(): void {

    this.formulario = this.fb.group({

      id: [],
      proveedor: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]],
      telefono: ['', [Validators.required, Validators.min(1000000), Validators.max(9999999999999)]],
      correo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.email]],
      contacto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      pais: ['USA', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      rfc: [, [Validators.minLength(12), Validators.maxLength(13)]],
      cuentasContables: this.fb.array([]),
      productos: this.fb.array([]),
      tiposPago: this.fb.array([])
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

  public canCreate(): boolean {return this.authService.canCreate()};

  public canUpdate(): boolean {return this.authService.canUpdate()};
}
