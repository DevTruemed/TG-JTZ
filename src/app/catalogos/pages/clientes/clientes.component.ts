import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteModel } from 'src/app/core/models/catalogos.models';
import { ClientesService } from 'src/app/core/services/clientes.service';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { DocumentoModel } from '../../../core/models/catalogos.models';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  //@ts-ignore
  @ViewChild('sideBar', { static: false }) sideBar: SidebarComponent;

  formulario !: FormGroup;

  clientes: ClienteModel[];

  documentacion: DocumentoModel[] = [];

  idCliente: number = 0;

  update: number | null;

  height: number = screen.height - 165;

  constructor(private fb: FormBuilder,
    private clienteService: ClientesService) {

    this.update = null;

    this.clientes = [];

    this.inicializarFormularios();

  }

  ngOnInit(): void {

    this.clienteService.getClientes().subscribe(res => this.clientes = res);

  }


  public numeroAbsoluto(numero: number): number {
    return Math.abs(numero);
  }

  public agregarCliente(): void {

    if (this.formulario.valid) {

      if (this.update == null)
        this.clienteService.postCliente(this.formulario.value).subscribe(cliente => {
          this.clientes.unshift(cliente)
          document.getElementById('closeModal')?.click();
        });

      else
        this.clienteService.putCliente(this.formulario.value).subscribe(cliente => {
          if (this.update != null)
            this.clientes[this.update] = cliente;
          document.getElementById('closeModal')?.click();
        });

    } else {
      return Object.values(this.formulario.controls).forEach(control => control.markAsTouched());
    }

  }

  public prepararUpdate(index: number): void {

    this.formulario.patchValue(this.clientes[index]);
    document.getElementById('addButton')?.click();
    this.update = index;

  }

  public desactivarCliente(index: number): void {

    this.clienteService.deleteCliente(this.clientes[index].id).subscribe(() => this.clientes.splice(index, 1));

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
      cliente: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200), Validators.email]],
      contacto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]],
      saldo: [0, [Validators.required, Validators.min(0)]],

    })

  }

  documentosModal(index: number): void {
    let cliente = this.clientes[index];
    this.documentacion = cliente.documentacion;
    this.idCliente = cliente.id;
    document.getElementById('openArchivosModal')?.click();
  }

  subirArchivos(data: { archivos: File[], tipo: number }): void {
    this.clienteService.postArchivos(this.idCliente, data.archivos, data.tipo).subscribe(res => {
      res.forEach(element => {
        this.documentacion.push(element);
      });
    });
  }

}
