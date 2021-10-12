import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoModel, PropiedadModel, TipoModel } from 'src/app/core/models/catalogos.models';
import { ProductosService } from 'src/app/core/services/productos.service';
import { PropiedadesService } from 'src/app/core/services/propiedades.service';

@Component({
  selector: 'app-casas',
  templateUrl: './casas.component.html',
  styleUrls: ['./casas.component.css']
})
export class CasasComponent implements OnInit {

  formularioAddPropiedad!: FormGroup;

  imagenesActualesBase64: { image: string, id: number }[] = [];

  fotosSeleccionadas: File[] = [];

  propiedades: PropiedadModel[] = [];

  fotosMostrar: string[] = [];

  tiposProductos: TipoModel[] = [];

  tipos: TipoModel[] = [];

  update: number | null = null;

  height = screen.height - 165;

  width = screen.width;

  constructor(private formBuilder: FormBuilder,
    private propiedadesService: PropiedadesService,
    private productosService: ProductosService) { 

      this.inicializarFormulario();

    }

  ngOnInit(): void {

    this.propiedadesService.getPropiedades().subscribe(
      propiedades => { this.propiedades = propiedades;
        this.propiedades.forEach(p => p.cortarDetalle = true);
      },
      err => { console.log(err) }
    )

    this.propiedadesService.getTipos().subscribe(
      tipos => this.tipos = tipos,
      err => console.log(err)
    )

  }

  get productosPropiedades() {
    return this.formularioAddPropiedad.get('productos') as FormArray;
  }

  agregarProductoPropiedades() {
    this.productosPropiedades.push(this.formBuilder.group({
      id: [],
      precio: [0, [Validators.required, Validators.min(0)]],
      producto: ['', Validators.required],
      tipo: this.formBuilder.group({
        id: 1
      })
    }));
  }

  public agregarPropiedad(): void {
    console.log(this.formularioAddPropiedad)
    if (this.formularioAddPropiedad.valid) {
      if (this.update === null) {
        this.propiedadesService.postPropiedad(this.formularioAddPropiedad.value, this.fotosSeleccionadas).subscribe(p => {
          document.getElementById('closeModal')?.click();
          this.reiniciarModals();
          this.propiedades.unshift(p);
        }, err => console.log(err))

      } else
        this.propiedadesService.putPropiedad(this.formularioAddPropiedad.value, this.fotosSeleccionadas).subscribe(propiedad => {
          document.getElementById('closeModal')?.click();
          if (this.update != null)
            this.propiedades[this.update] = propiedad;
          this.reiniciarModals();
        }, err => console.log(err))

    } else {
      return Object.values(this.formularioAddPropiedad.controls).forEach(control => control.markAsTouched());
    }

  }

  public reiniciarModals(): void {
    this.update = null;
    this.formularioAddPropiedad.reset();
    this.fotosMostrar = [];
    this.fotosSeleccionadas = [];
    this.imagenesActualesBase64 = [];
  }

  public modificarPropiedad(index: number): void {

    this.formularioAddPropiedad.patchValue(this.propiedades[index]);
    this.formularioAddPropiedad.get('id')?.setValue(this.propiedades[index].id);
    this.update = index;
    this.imagenesActualesBase64 = [];
    document.getElementById('addButton')?.click();

    this.propiedades[index].imagenes.forEach(imagen => {

      this.propiedadesService.getImagen(imagen.ruta).subscribe(image => {
        this.imagenesActualesBase64.push({ image: ('data:' + image.type + ';base64, ' + image.image), id: imagen.id });
      }, err => console.log(err));

    });

  }

  public isValid(form: FormGroup, field: string): boolean {

    //@ts-ignore
    return form.get(field).invalid && form.get(field).touched;

  }

  public seleccionarFotos(event: any): void {

    this.fotosSeleccionadas.length

    for (let index = 0; index < event.target.files.length; index++) {
      if (event.target.files[index].type === 'image/png' || event.target.files[index].type === 'image/jpg' || event.target.files[index].type === 'image/jpeg') {

        this.fotosSeleccionadas.push(event.target.files[index]);
        this.arrayBufferToBase64(event.target.files[index].arrayBuffer())

      }

    }

  }

  public borrarFoto(index: number): void {

    this.fotosMostrar.splice(index, 1);
    this.fotosSeleccionadas.splice(index, 1);

  }

  public borrarFotoFromServer(id: number, index: number) {

    this.propiedadesService.deleteImagen(id).subscribe(res => {

      if (res) {

        this.imagenesActualesBase64.splice(index, 1);
        //@ts-ignore
        console.log(this.propiedades[this.update].imagenes)
        if (this.update != null)
          this.propiedades[this.update].imagenes.splice(index, 1);
        //@ts-ignore
        console.log(this.propiedades[this.update].imagenes)

      }

    });

  }

  private arrayBufferToBase64(buffer: Promise<ArrayBuffer>): void {

    buffer.then((arraybuffer: ArrayBuffer) => {
      var binary = '';
      var bytes = new Uint8Array(arraybuffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      this.fotosMostrar.push(window.btoa(binary));
    })


  }

  private inicializarFormulario(): void{
    this.formularioAddPropiedad = this.formBuilder.group({
      id: [null],
      direccion: ['', [Validators.minLength(5), Validators.maxLength(200), Validators.required]],
      estado: ['', [Validators.minLength(2), Validators.maxLength(50), Validators.required]],
      pais: ['USA'],
      cp: ['', [Validators.minLength(4), Validators.maxLength(10), Validators.required]],
      numeroExterior: ['', [Validators.minLength(1), Validators.maxLength(10), Validators.required]],
      venta: [1, [Validators.min(1), Validators.required]],
      renta: [1, [Validators.min(1), Validators.required]],
      habitaciones: [0, [Validators.min(1), Validators.required]],
      terreno: [1, [Validators.min(1), Validators.max(50000), Validators.required]],
      terrenoConstruido: [0, [Validators.min(0), Validators.max(50000)]],
      descripcion: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(2000)]],
      tipo: this.formBuilder.group({
        id: [1]
      }),
      noPisos: [1, [Validators.min(1), Validators.max(10), Validators.required]],
      piso: [0, [Validators.min(0), Validators.max(500)]],
      recamaras: [1, [Validators.min(1), Validators.max(10), Validators.required]],
      banos: [1, [Validators.min(1), Validators.max(10), Validators.required]],
      estacionamientos: [0, [Validators.min(0), Validators.max(10), Validators.required]],
      productos: this.formBuilder.array([])
    });
  }

}
