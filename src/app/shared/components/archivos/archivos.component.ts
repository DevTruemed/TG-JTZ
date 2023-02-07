import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DocumentoModel, TipoDocumentoModel } from '../../../core/models/catalogos.models';
import { DocumentosService } from '../../../core/services/documentos.service';
import { TiposDocumentosService } from '../../../core/services/tipos-documentos.service';

declare var $: any;

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent implements OnInit {

  tipos: TipoDocumentoModel[] = [];
  tipoSeleccionado: number = 0;
  porSubir: File[] = [];
  @Input() archivos: DocumentoModel[] = [];
  @Output() uploadFiles: EventEmitter<any> = new EventEmitter();
  @Output() deleteFile: EventEmitter<File[]> = new EventEmitter();
  @ViewChild('inputFile') inputFile!: ElementRef;

  constructor(private documentosService: DocumentosService,
    private authService: AuthService,
    private tiposService: TiposDocumentosService) { }

  ngOnInit(): void {
    this.tiposService.getTiposDocumentos().subscribe(res => this.tipos = res);
  }

  seleccionarArchivos(event: any): void {
    for (let index = 0; index < event.target.files.length; index++) {
      this.porSubir.push(event.target.files[index]);
    }
  }

  descargarArchivo(archivo: DocumentoModel): void {
    this.documentosService.descargarArchivo(archivo.id).subscribe(res => {
      let file = new Blob([res], { type: archivo.extension });
      let url = window.URL.createObjectURL(file);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = archivo.nombre;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

  visualizarArchivo(archivo: DocumentoModel): void {
    this.documentosService.descargarArchivo(archivo.id).subscribe(res => {
      let file = new Blob([res], { type: archivo.extension });
      let url = window.URL.createObjectURL(file);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.target = "_blank";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

  borrarArchivoFromServer(idArchivo: number, index: number) {
    this.documentosService.deleteArchivo(idArchivo).subscribe(res => {
      if (res) {
        this.archivos.splice(index, 1);
      }
    });
  }

  agregarArchivos(): void {
    if (this.porSubir.length && this.tipoSeleccionado) {
      this.uploadFiles.emit({ archivos: this.porSubir, tipo: this.tipoSeleccionado });
      this.porSubir = [];
      this.tipoSeleccionado = 0;
      this.inputFile.nativeElement.value = null;
    }
  }

  public canCreate(): boolean {return this.authService.canCreate()};

  public canRead(): boolean {return this.authService.canRead()};

  public canUpdate(): boolean {return this.authService.canUpdate()};

  public canDelete(): boolean {return this.authService.canDelete()};
}
