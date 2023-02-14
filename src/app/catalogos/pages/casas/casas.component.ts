import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoModel, PropiedadModel, TipoModel } from 'src/app/core/models/catalogos.models';
import { AseguradoraModel, PropiedadImpuestoModel, DocumentoModel, SeguroModel } from '../../../core/models/catalogos.models';
import { ProductosService } from 'src/app/core/services/productos.service';
import { PropiedadesService } from 'src/app/core/services/propiedades.service';
import { AseguradorasService } from '../../../core/services/aseguradoras.service';
import { AngularMyDatePickerDirective, IAngularMyDpOptions } from 'angular-mydatepicker';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';

declare var $: any;
@Component({
  selector: 'app-casas',
  templateUrl: './casas.component.html',
  styleUrls: ['./casas.component.css']
})
export class CasasComponent implements OnInit {

  formularioAddPropiedad!: FormGroup;

  formularioSeguro!: FormGroup;

  imagenesActualesBase64: { image: string, id: number, tipo?: string }[] = [];

  fotosSeleccionadas: File[] = [];

  propiedades: PropiedadModel[] = [];

  sumatoriaVenta: number = 0;

  fotosMostrar: {data: string, isPdf: boolean}[] = [];

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

  addPropiedadValoresIniciales: any;

  addSeguroValoresIniciales: any;

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
    private authService: AuthService,
    private cdr: ChangeDetectorRef) {

    this.inicializarFormulario();
    document.getElementById('closeAllModals')?.click();

  }

  ngOnInit(): void {

    this.propiedadesService.getPropiedades().subscribe(
      propiedades => {
        this.sumatoriaVenta = 0;
        this.propiedades = propiedades;
        this.propiedades.map(p => {
          p.cortarDetalle = true;
          p.venta = p.productos.find(prod => prod.cuenta.id == 142)?.precio || 0;
          this.sumatoriaVenta += p.venta
        });
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
        Swal.fire({
          text: 'Cargando',
          allowEscapeKey: false,
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.propiedadesService.postPropiedad(this.formularioAddPropiedad.value, this.fotosSeleccionadas).subscribe(p => {

          if (this.segurosPropiedades.length) {
            this.segurosPropiedades.value.forEach((seguro: SeguroModel) => {
              this.propiedadesService.postSeguro(p.id, seguro).subscribe(res => {
                this.propiedades.find(prop => prop.id == p.id)!.seguros.unshift(res);
              }, err => console.log);
            });
            document.getElementById('closeModal')?.click();
            this.ngOnInit();
            this.reiniciarModals();
          } else {
            document.getElementById('closeModal')?.click();
            this.ngOnInit();
            this.reiniciarModals();
          }
          Swal.close();
        }, err => {console.log(err); Swal.close()})

      } else
        Swal.fire({
          text: 'Cargando',
          allowEscapeKey: false,
          allowOutsideClick: false
        });
        Swal.showLoading();
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
            this.ngOnInit();
            this.reiniciarModals();
          } else {
            document.getElementById('closeModal')?.click();
            if (this.update != null)
              this.propiedades[this.update] = propiedad;
            this.ngOnInit();
            this.reiniciarModals();
          }
          Swal.close();
        }, err => {console.log(err); Swal.close()})
      
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
    this.formularioAddPropiedad.reset(this.addPropiedadValoresIniciales);
    this.formularioSeguro.reset(this.addSeguroValoresIniciales);
    this.fotosMostrar = [];
    this.fotosSeleccionadas = [];
    this.imagenesActualesBase64 = [];
    this.segurosPropiedades.clear();
  }

  public modificarPropiedad(index: number, tipo: string): void {

    console.log(this.propiedades[index])
    this.formularioAddPropiedad.patchValue(this.propiedades[index]);
    this.formularioAddPropiedad.get('id')?.setValue(this.propiedades[index].id);
    this.formularioAddPropiedad.get('venta')?.setValue(this.propiedades[index].productos.find(prod => prod.cuenta.id == 142)?.precio);
    this.formularioAddPropiedad.get('renta')?.setValue(this.propiedades[index].productos.find(prod => prod.cuenta.id == 141)?.precio);

    this.propiedades[index].seguros.forEach(seguro => {
      this.segurosPropiedades.push(this.formBuilder.group(seguro));
    });
    this.update = index;
    this.imagenesActualesBase64 = [];
    if (tipo === 'read') {
      this.formularioAddPropiedad.get('tipo')?.disable();
      document.getElementById('readButton')?.click();
    }
    if (tipo === 'update') {
      this.formularioAddPropiedad.get('tipo')?.enable();
      document.getElementById('addButton')?.click();
    }

    this.propiedades[index].imagenes.forEach(imagen => {

      this.propiedadesService.getImagen(imagen.ruta).subscribe(image => {
        this.imagenesActualesBase64.push({ image: ('data:' + image.type + ';base64, ' + image.image), id: imagen.id, tipo: imagen.tipo });
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
      if (event.target.files[index].type === 'image/png' || event.target.files[index].type === 'image/jpg' || event.target.files[index].type === 'image/jpeg' || event.target.files[index].type === 'application/pdf') {

        this.fotosSeleccionadas.push(event.target.files[index]);
        this.arrayBufferToBase64(event.target.files[index].arrayBuffer(), event.target.files[index].type === 'application/pdf' ? true : false)

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

  private arrayBufferToBase64(buffer: Promise<ArrayBuffer>, isPdf: boolean = false): void {

    buffer.then((arraybuffer: ArrayBuffer) => {
      var binary = '';
      var bytes = new Uint8Array(arraybuffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      this.fotosMostrar.push({data: window.btoa(binary), isPdf: isPdf});
    })


  }

  private inicializarFormulario(): void {
    this.formularioAddPropiedad = this.formBuilder.group({
      id: [null],
      direccion: ['', [Validators.minLength(3), Validators.maxLength(200), Validators.required]],
      estado: ['', [Validators.minLength(2), Validators.maxLength(50), Validators.required]],
      pais: ['USA'],
      cp: ['', [Validators.minLength(4), Validators.maxLength(10), Validators.required]],
      numeroExterior: ['', [Validators.minLength(1), Validators.maxLength(10), Validators.required]],
      venta: [1, [Validators.min(1), Validators.required]],
      renta: [1, [Validators.min(1), Validators.required]],
      habitaciones: [0, [Validators.min(0), Validators.required]],
      terreno: [1, [Validators.min(1), Validators.required]],
      terrenoConstruido: [0, [Validators.min(0)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      tipo: this.formBuilder.group({
        id: [1]
      }),
      noPisos: [0, [Validators.min(0), Validators.max(10), Validators.required]],
      piso: [0, [Validators.min(0), Validators.max(500)]],
      recamaras: [0, [Validators.min(0), Validators.max(30), Validators.required]],
      banos: [0, [Validators.min(0), Validators.max(10), Validators.required]],
      estacionamientos: [0, [Validators.min(0), Validators.max(10), Validators.required]],
      seguros: this.formBuilder.array([]),
      productos: this.formBuilder.array([])
    });
    this.addPropiedadValoresIniciales = this.formularioAddPropiedad.value;
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
    this.addSeguroValoresIniciales = this.formularioSeguro.value;
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

  public canCreate(): boolean {return this.authService.canCreate()};

  public canRead(): boolean {return this.authService.canRead()};

  public canUpdate(): boolean {return this.authService.canUpdate()};
}
