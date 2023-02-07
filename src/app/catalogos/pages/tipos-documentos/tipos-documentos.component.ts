import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TiposDocumentosService } from '../../../core/services/tipos-documentos.service';
import { TipoDocumentoModel } from '../../../core/models/catalogos.models';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-tipos-documentos',
  templateUrl: './tipos-documentos.component.html',
  styleUrls: ['./tipos-documentos.component.css']
})
export class TiposDocumentosComponent implements OnInit {

  //@ts-ignore
  @ViewChild('sideBar', { static: false }) sideBar: SidebarComponent;

  formulario !: FormGroup;

  documentos: TipoDocumentoModel[];

  update: number | null;

  height: number = screen.height - 165;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private documentoService: TiposDocumentosService) {

    this.update = null;

    this.documentos = [];

    this.inicializarFormularios();

  }

  ngOnInit(): void {

    this.documentoService.getTiposDocumentos().subscribe(res => this.documentos = res);

  }

  public agregarTipoDocumento(): void {

    if (this.formulario.valid) {

      if (this.update == null)
        this.documentoService.postTipoDocumento(this.formulario.value).subscribe(documento => {
          this.documentos.unshift(documento)
          document.getElementById('closeModal')?.click();
        });

      else
        this.documentoService.putTipoDocumento(this.formulario.value).subscribe(documento => {
          if (this.update != null)
            this.documentos[this.update] = documento;
          document.getElementById('closeModal')?.click();
        });

    } else {
      return Object.values(this.formulario.controls).forEach(control => control.markAsTouched());
    }

  }

  public prepararUpdate(index: number, tipo: string): void {

    this.formulario.patchValue(this.documentos[index]);
    if (tipo === 'read') {
      document.getElementById('readButton')?.click();
    }
    if (tipo === 'update') {
      document.getElementById('addButton')?.click();
    }
    this.update = index;

  }

  // public desactivarTipoDocumento(index: number): void {

  //   this.clienteService.deleteCliente(this.documentos[index].id).subscribe(() => this.documentos.splice(index, 1));

  // }

  public isValid(form: FormGroup, field: string): boolean {
    //@ts-ignore
    return form.get(field).invalid && form.get(field).touched;
  }

  public reiniciarModals() {
    this.formulario.reset();
    this.update = null;
  }

  public openSideBar(): void {
    this.sideBar.isOpen = true;
  }

  private inicializarFormularios(): void {

    this.formulario = this.fb.group({

      id: [],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],

    })

  }

  public canCreate(): boolean {return this.authService.canCreate()};

  public canRead(): boolean {return this.authService.canRead()};

  public canUpdate(): boolean {return this.authService.canUpdate()};
}
