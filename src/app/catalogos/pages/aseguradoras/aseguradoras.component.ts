import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AseguradoraModel } from '../../../core/models/catalogos.models';
import { AseguradorasService } from '../../../core/services/aseguradoras.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  constructor(private formB: FormBuilder, private aseguradorasService: AseguradorasService,
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
      if (this.update == null)
        this.aseguradorasService.postAseguradora(this.formulario.value).subscribe(aseguradora => {
          this.aseguradoras.unshift(aseguradora)
          document.getElementById('closeModal')?.click();
        });

      else
        this.aseguradorasService.putAseguradora(this.formulario.value).subscribe(aseguradora => {
          if (this.update != null)
            this.aseguradoras[this.update] = aseguradora;
          document.getElementById('closeModal')?.click();
        });
    } else {
      return Object.values(this.formulario.controls).forEach(control => control.markAsTouched());
    }

  }

  public prepararUpdate(index: number): void {
    this.formulario.patchValue(this.aseguradoras[index]);
    document.getElementById('addButton')?.click();
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
      telefonoContacto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      telefonoReclamaciones: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    })

  }
}
