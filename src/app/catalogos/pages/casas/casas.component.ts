import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoModel, PropiedadModel, TipoModel } from 'src/app/core/models/catalogos.models';
import { AseguradoraModel, PropiedadImpuestoModel, DocumentoModel, SeguroModel } from '../../../core/models/catalogos.models';
import { ProductosService } from 'src/app/core/services/productos.service';
import { PropiedadesService } from 'src/app/core/services/propiedades.service';
import { AseguradorasService } from '../../../core/services/aseguradoras.service';
import { AngularMyDatePickerDirective, IAngularMyDpOptions } from 'angular-mydatepicker';

declare var $: any;
@Component({
  selector: 'app-casas',
  templateUrl: './casas.component.html',
  styleUrls: ['./casas.component.css']
})
export class CasasComponent implements OnInit {

  formularioAddPropiedad!: FormGroup;

  formularioSeguro!: FormGroup;

  imagenesActualesBase64: { image: string, id: number }[] = [];

  fotosSeleccionadas: File[] = [];

  propiedades: PropiedadModel[] = [];

  fotosMostrar: string[] = [];

  tiposProductos: TipoModel[] = [];

  tipos: TipoModel[] = [];

  aseguradoras: AseguradoraModel[] = [];

  infoAseguradora: any = null;

  propiedadImpuestos: PropiedadImpuestoModel[] = [];

  idPropiedad: number = 0;

  documentacion: DocumentoModel[] = [];

  isDocumentoAseguradora: boolean = false;

  update: number | null = null;

  height = screen.height - 165;

  width = screen.width;

  @ViewChild('dp') myDp!: AngularMyDatePickerDirective;

  myOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'yyyy-mm-dd',
    appendSelectorToBody: true,
  };

  constructor(private formBuilder: FormBuilder,
    private propiedadesService: PropiedadesService,
    private productosService: ProductosService,
    private aseguradorasService: AseguradorasService,
    private cdr: ChangeDetectorRef) {

    this.inicializarFormulario();

  }

  ngOnInit(): void {

    this.propiedadesService.getPropiedades().subscribe(
      propiedades => {
        this.propiedades = propiedades;
        this.propiedades.forEach(p => p.cortarDetalle = true);
      },
      err => { console.log(err) }
    )

    this.propiedadesService.getTipos().subscribe(
      tipos => this.tipos = tipos,
      err => console.log(err)
    )

    this.aseguradorasService.getAseguradoras().subscribe(
      aseguradoras => this.aseguradoras = aseguradoras,
      err => console.log(err)
    )

  }

  get productosPropiedades() {
    return this.formularioAddPropiedad.get('productos') as FormArray;
  }

  get segurosPropiedades() {
    return this.formularioAddPropiedad.get('seguros') as FormArray;
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
    if (this.formularioAddPropiedad.valid) {
      if (this.update === null) {
        this.propiedadesService.postPropiedad(this.formularioAddPropiedad.value, this.fotosSeleccionadas).subscribe(p => {

          if (this.segurosPropiedades.length) {
            this.segurosPropiedades.value.forEach((seguro: SeguroModel) => {
              this.propiedadesService.postSeguro(p.id, seguro).subscribe(res => {
                this.propiedades.find(prop => prop.id == p.id)!.seguros.unshift(res);
              }, err => console.log);
            });
            document.getElementById('closeModal')?.click();
            this.reiniciarModals();
            this.propiedades.unshift(p);
          } else {
            document.getElementById('closeModal')?.click();
            this.reiniciarModals();
            this.propiedades.unshift(p);
          }
        }, err => console.log(err))

      } else
        this.propiedadesService.putPropiedad(this.formularioAddPropiedad.value, this.fotosSeleccionadas).subscribe(propiedad => {

          if (this.segurosPropiedades.length) {
            this.segurosPropiedades.value.forEach((seguro: SeguroModel) => {
              this.propiedadesService.postSeguro(propiedad.id, seguro).subscribe(res => {
                this.propiedades.find(p => p.id == propiedad.id)!.seguros.unshift(res);
              }, err => console.log);
            });
            document.getElementById('closeModal')?.click();
            if (this.update != null)
              this.propiedades[this.update] = propiedad;
            this.reiniciarModals();
          } else {
            document.getElementById('closeModal')?.click();
            if (this.update != null)
              this.propiedades[this.update] = propiedad;
            this.reiniciarModals();
          } 5
        }, err => console.log(err))

    } else {
      return Object.values(this.formularioAddPropiedad.controls).forEach(control => control.markAsTouched());
    }

  }

  public agregarSeguro(): void {
    if (this.formularioSeguro.valid) {
      const form = this.formularioSeguro;
      this.segurosPropiedades.push(form);
      this.inicializarFormularioSeguro();
    } else {
      return Object.values(this.formularioSeguro.controls).forEach(control => control.markAllAsTouched);
    }
  }

  removerSeguro(index: number): void {
    this.segurosPropiedades.removeAt(index);
  }

  public reiniciarModals(): void {
    this.update = null;
    this.formularioAddPropiedad.reset();
    this.fotosMostrar = [];
    this.fotosSeleccionadas = [];
    this.imagenesActualesBase64 = [];
    this.segurosPropiedades.clear();
  }

  public modificarPropiedad(index: number): void {

    this.formularioAddPropiedad.patchValue(this.propiedades[index]);
    this.formularioAddPropiedad.get('id')?.setValue(this.propiedades[index].id);

    this.propiedades[index].seguros.forEach(seguro => {
      this.segurosPropiedades.push(this.formBuilder.group(seguro));
    });
    this.update = index;
    this.imagenesActualesBase64 = [];
    document.getElementById('addButton')?.click();

    this.propiedades[index].imagenes.forEach(imagen => {

      this.propiedadesService.getImagen(imagen.ruta).subscribe(image => {
        this.imagenesActualesBase64.push({ image: ('data:' + image.type + ';base64, ' + image.image), id: imagen.id });
      }, err => console.log(err));

    });

  }

  prepararImpuestosModal(index: number): void {
    let propiedad = this.propiedades[index];
    this.propiedadImpuestos = propiedad.impuestos;
    this.idPropiedad = propiedad.id;
    document.getElementById('openImpuestosModal')?.click();
  }

  documentosModal(index: number, isInsurance: boolean = false): void {
    if (isInsurance) {
      let seguro = this.segurosPropiedades.at(index).value;
      this.documentacion = [seguro.documentacion];
      this.idPropiedad = seguro.id;
      this.isDocumentoAseguradora = true;
    } else {
      this.isDocumentoAseguradora = false;
      let propiedad = this.propiedades[index];
      this.documentacion = propiedad.documentacion;
      this.idPropiedad = propiedad.id;
    }
    document.getElementById('openArchivosModal')?.click();
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

  private inicializarFormulario(): void {
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
      seguros: this.formBuilder.array([]),
      productos: this.formBuilder.array([])
    });
    this.inicializarFormularioSeguro();
  }

  private inicializarFormularioSeguro(): void {
    this.formularioSeguro = this.formBuilder.group({
      id: [],
      categoria: ['', [Validators.required]],
      poliza: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaTermino: ['', [Validators.required]],
      deducible: [0, [Validators.min(1), Validators.required]],
      nombreArchivo: ['', [Validators.required]],
      documentacion: ['', [Validators.required]],
      rango: [],
      aseguradora: this.formBuilder.group({
        id: [0, [Validators.min(1)]]
      }),
    });
  }

  getInfoAseguradora(): void {
    let propiedad = this.formularioAddPropiedad.get('aseguradora')?.value.id!;
    if (!propiedad) {
      this.infoAseguradora = null;
      return;
    }

    this.infoAseguradora = this.aseguradoras.find((a) => a.id == propiedad);
  }

  subirArchivos(data: { archivos: File[], tipo: number }): void {
    if (this.isDocumentoAseguradora) {
      this.propiedadesService.postArchivosAseguradora(this.idPropiedad, data.archivos, data.tipo).subscribe(res => {
        res.forEach(element => {
          this.documentacion.push(element);
        });
      });
    } else {
      this.propiedadesService.postArchivos(this.idPropiedad, data.archivos, data.tipo).subscribe(res => {
        res.forEach(element => {
          this.documentacion.push(element);
        });
      });
    }
  }

  toggleCalendar(): void {
    this.cdr.detectChanges();
    this.myDp.toggleCalendar();
  }

  seleccionarFechas(e: any): void {
    this.formularioSeguro.patchValue({ 'fechaInicio': e.dateRange.formatted.split(" - ")[0] });
    this.formularioSeguro.patchValue({ 'fechaTermino': e.dateRange.formatted.split(" - ")[1] });
  }

  subirArchivoSeguro(e: any): void {
    let file = '';
    if (e.target.files.length > 0) {
      file = e.target.files[0];
    }
    this.formularioSeguro.patchValue({
      documentacion: file
    });
  }
}
