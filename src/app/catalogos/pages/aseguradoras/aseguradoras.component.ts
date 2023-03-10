import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AseguradoraModel } from '../../../core/models/catalogos.models';
import { AseguradorasService } from '../../../core/services/aseguradoras.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aseguradoras',
  templateUrl: './aseguradoras.component.html',
  styleUrls: ['./aseguradoras.component.css']
})
export class AseguradorasComponent implements OnInit {

  // @ts-ignore
  @ViewChild('sideBar', { static: false }) sideBar: SidebarComponent;

  formulario !: FormGroup;
  aseguradoras: AseguradoraModel[];
  update: number | null;
  height: number = screen.height - 165;

  constructor(private formB: FormBuilder, private aseguradorasService: AseguradorasService, private authService: AuthService,
    private router: Router) {

    this.aseguradoras = [];
    this.update = null;
    this.inicializarFormularios();
  }

  ngOnInit(): void {
    this.aseguradorasService.getAseguradoras().subscribe(aseguradoras => this.aseguradoras = aseguradoras);
  }

  public agregarAseguradora(): void {

    if (this.formulario.valid) {
      if (this.update == null) {
        Swal.fire({
          text: 'Cargando',
          allowEscapeKey: false,
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.aseguradorasService.postAseguradora(this.formulario.value).subscribe(aseguradora => {
          this.aseguradoras.unshift(aseguradora)
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
        this.aseguradorasService.putAseguradora(this.formulario.value).subscribe(aseguradora => {
          if (this.update != null)
            this.aseguradoras[this.update] = aseguradora;
          document.getElementById('closeModal')?.click();
          Swal.close();
        });
      }
    } else {
      return Object.values(this.formulario.controls).forEach(control => control.markAsTouched());
    }

  }

  public prepararUpdate(index: number, tipo: string): void {
    this.formulario.patchValue(this.aseguradoras[index]);
    if (tipo === 'read') {
      document.getElementById('readButton')?.click();
    }
    if (tipo === 'update') {
      document.getElementById('addButton')?.click();
    }
    this.update = index;
  }

  public desactivarAseguradora(index: number): void {
    this.aseguradorasService.deleteAseguradora(this.aseguradoras[index].id).subscribe(() => this.aseguradoras.splice(index, 1));
  }

  public isValid(form: FormGroup, field: string): boolean {
    return form.get(field)!.invalid && form.get(field)!.touched;
  }

  public reiniciarModals() {
    this.formulario.reset();
    this.update = null;
  }

  public openSideBar(): void {
    this.sideBar.isOpen = true;
  }

  private inicializarFormularios(): void {

    this.formulario = this.formB.group({

      id: [],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      paginaWeb: ['', [Validators.required, Validators.maxLength(255)]],
      nombreContacto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      correoContacto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.email]],
      telefonoContacto: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      telefonoReclamaciones: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    })

  }

  public canCreate(): boolean {return this.authService.canCreate()};

  public canRead(): boolean {return this.authService.canRead()};

  public canUpdate(): boolean {return this.authService.canUpdate()};
}
