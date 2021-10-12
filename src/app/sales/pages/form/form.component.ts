import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteModel } from 'src/app/core/models/catalogos.models';
import { ProductoModel } from 'src/app/core/models/catalogos.models';
import { VentaModel } from 'src/app/core/models/ventas.model';
import { ClientesService } from 'src/app/core/services/clientes.service';
import { ProductosService } from 'src/app/core/services/productos.service';
import { VentasService } from 'src/app/core/services/ventas.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  venta: VentaModel = new VentaModel();

  productos: ProductoModel[] = [];

  clientes: ClienteModel[] = [];

  formulario!: FormGroup;

  estatus: string = 'Creating...'

  height: number = screen.height - 165;

  width: number = screen.width;

  update: boolean = false;

  constructor(private productoService: ProductosService,
    private ventaService: VentasService,
    private clienteService: ClientesService,
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute) {

    this.inicializarFormulario();

    if (activeRoute.snapshot.params.id)
      this.update = true;

  }

  ngOnInit(): void {

    this.productoService.getProductos('venta').subscribe(productos => this.productos = productos);

    this.clienteService.getClientes().subscribe(clientes => {
      this.clientes = clientes

      if (this.update)
        this.ventaService.getVenta(this.activeRoute.snapshot.params.id).subscribe(venta => {
          this.venta = venta;
          this.estatus = venta.estatus.estatus;
          this.formulario.patchValue(venta);
          venta.productos.forEach(p => {
            for (let index = 0; index < this.productos.length; index++) {
              if (p.producto.id === this.productos[index].id) {
                this.addProducto(p.producto.producto, p.cantidad);
              }
            }
          });
        }
          ,
          err => this.router.navigate(['/sales']));
      else
        this.formulario.patchValue({ 'cliente': this.clientes[0] })

    });

  }

  get productosForm(): FormArray {
    return this.formulario.get('productos') as FormArray;
  }

  get observacionesForm(): FormArray {
    return this.formulario.get('observaciones') as FormArray;
  }


  public actualizarImporte(): void {
    let importe: number = 0;
    this.productosForm.controls.forEach(control => importe += control.get('cantidad')?.value * control.get('costo')?.value)

    this.formulario.get('importe')?.setValue(importe);
  }

  public create(facturar: boolean = false) {
    if (this.formulario.valid) {

      if (!this.update)
        this.ventaService.createVenta(this.formulario.value).subscribe(() => this.router.navigate(['/sales']))
      else
        this.ventaService.update(this.formulario.value).subscribe(() => {
          if (!facturar)
            this.router.navigate(['/sales']);
          else
            this.ventaService.facturar(this.formulario.get('id')?.value).subscribe(() => this.router.navigate(['/sales']))
        })

    } else
      return this.markFormGroupTouched(this.formulario);
  }

  public addProducto(producto: string, cantidad: number = 0) {

    for (let index = 0; index < this.productos.length; index++) {
      const element = this.productos[index];
      if (element.producto === producto) {
        this.productosForm.push(
          this.fb.group({
            costo: [this.productos[index].precio, [Validators.required, Validators.min(.1)]],
            cantidad: [cantidad, [Validators.required, Validators.min(.1)]],
            producto: this.fb.group({
              id: [this.productos[index].id],
              producto: [this.productos[index].producto, Validators.required]
            })
          })
        )

        this.productos.splice(index, 1)
        //@ts-ignore
        document.getElementById('inputProducto')?.value = '';
        return;
      }

    }



  }

  public selectCliente(index: number): void {
    this.formulario.patchValue({ 'cliente': this.clientes[index] })
  }

  public addObservacion(): void {

    this.observacionesForm.push(
      this.fb.group({
        id: [],
        observacion: [, [Validators.required, Validators.minLength(5), Validators.maxLength(300)]]
      })
    );

  }

  public removeProducto(index: number): void {

    this.productos.unshift(this.productosForm.at(index)?.get('producto')?.value);
    this.productos[0].precio = this.productosForm.at(index)?.get('costo')?.value;
    this.productosForm.removeAt(index);
    this.actualizarImporte();

  }

  private inicializarFormulario(): void {

    this.formulario = this.fb.group({
      id: [],
      cliente: this.fb.group({
        id: [],
        cliente: []
      }),
      importe: [0],
      fecha: [],
      productos: this.fb.array([]),
      observaciones: this.fb.array([])
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

}
