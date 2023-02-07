import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuentaContableModel,PropiedadModel, TipoModel, ProductoModel } from 'src/app/core/models/catalogos.models';
import { CcService } from 'src/app/core/services/cc.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductosService } from 'src/app/core/services/productos.service';
import { PropiedadesService } from 'src/app/core/services/propiedades.service';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  //@ts-ignores
  @ViewChild('sideBar', { static: false }) sideBar: SidebarComponent;

  formularioAddProducto!: FormGroup;

  productos: ProductoModel[];

  tiposProductos: CuentaContableModel[];

  update: number | null;

  height = screen.height - 165;

  constructor(private formBuilder: FormBuilder,
    private ccServce: CcService,
    private productosService: ProductosService,
    private authService: AuthService
    ) {

    this.productos = [];
    this.tiposProductos = [];
    this.update = null;

    this.inicializarFormularios();

  }

  ngOnInit(): void {

    this.productosService.getProductos().subscribe(p => this.productos = p, error => console.log(error));

    this.ccServce.getSubCuentas().subscribe(p => this.tiposProductos = p, error => console.log(error));

    console.log(this.authService.canCreate())
    console.log(this.authService.canRead())
    console.log(this.authService.canUpdate())
    console.log(this.authService.canDelete())

  }

  openSideBar(): void {
    this.sideBar.isOpen = true;
  }

  public reiniciarModals(): void {
    this.update = null;
    this.formularioAddProducto.reset();
  }

  public agregarProducto(): void {

    if (this.formularioAddProducto.valid) {
      if (this.update === null)
        this.productosService.postProductos(this.formularioAddProducto.value).subscribe(producto => {
          document.getElementById('closeModalProducto')?.click();
          //propiedad.tipo.tipo = this.tipos[propiedad.tipo.id - 1].tipo;
          this.productos.push(producto)
          this.formularioAddProducto.reset();
        }, err => console.log(err))

      else
        this.productosService.putProductos(this.formularioAddProducto.value).subscribe(producto => {
          document.getElementById('closeModalProducto')?.click();
          if (this.update != null)
            this.productos[this.update] = producto;
          this.update = null;
          this.formularioAddProducto.reset();
        }, err => console.log(err))
    } else {
      return Object.values(this.formularioAddProducto.controls).forEach(control => control.markAsTouched());
    }

  }

  public modificarProducto(index: number, tipo: string): void {

    this.formularioAddProducto.patchValue(this.productos[index]);
    this.formularioAddProducto.get('id')?.setValue(this.productos[index].id);
    this.update = index;
    if (tipo === 'read') {
      // this.formularioAddProducto.get('cuenta')!.disable();
      document.getElementById('readProductoButton')?.click();
    }
    if (tipo === 'update') {
      // this.formularioAddProducto.get('cuenta')!.enable();
      document.getElementById('addProductoButton')?.click();
    }

  }

  public isValid(form: FormGroup, field: string): boolean {

    //@ts-ignore
    return form.get(field).invalid && form.get(field).touched;

  }

  private inicializarFormularios(): void {
    this.formularioAddProducto = this.formBuilder.group({
      id: [null],
      producto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      existencia: [0, [Validators.required, Validators.min(0)]],
      cuenta: this.formBuilder.group({
        id: [141]
      })
    });
  }

  public canCreate(): boolean {return this.authService.canCreate()};

  public canRead(): boolean {return this.authService.canRead()};

  public canUpdate(): boolean {return this.authService.canUpdate()};

  public canDelete(): boolean {return this.authService.canDelete()};

}
