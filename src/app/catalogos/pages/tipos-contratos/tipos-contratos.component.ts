import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';
import { TipoContratoModel } from '../../../core/models/catalogos.models';
import { TiposContratosService } from '../../../core/services/tipos-contratos.service';

@Component({
  selector: 'app-tipos-contratos',
  templateUrl: './tipos-contratos.component.html',
  styleUrls: ['./tipos-contratos.component.css']
})
export class TiposContratosComponent implements OnInit {

  //@ts-ignore
  @ViewChild('sideBar', { static: false }) sideBar: SidebarComponent;

  formulario !: FormGroup;

  documentos: TipoContratoModel[];

  update: number | null;

  height: number = screen.height - 165;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private contratoService: TiposContratosService) {

    this.update = null;

    this.documentos = [];

    this.inicializarFormularios();

  }

  ngOnInit(): void {

    this.contratoService.getTiposContratos().subscribe(res => this.documentos = res);

  }

  public agregarTipoContrato(): void {

    if (this.formulario.valid) {

      if (this.update == null) {
        Swal.fire({
          text: 'Cargando',
          allowEscapeKey: false,
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.contratoService.postTipoContrato(this.formulario.value).subscribe(documento => {
          this.documentos.unshift(documento)
          document.getElementById('closeModal')?.click();
          Swal.close();
        });
      } else {
        Swal.fire({
          text: 'Cargando',
          allowEscapeKey: false,
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.contratoService.putTipoContrato(this.formulario.value).subscribe(documento => {
          if (this.update != null)
            this.documentos[this.update] = documento;
          document.getElementById('closeModal')?.click();
          Swal.close();
        });
      }

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
