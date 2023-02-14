import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteModel } from 'src/app/core/models/catalogos.models';
import { ClientesService } from 'src/app/core/services/clientes.service';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { DocumentoModel } from '../../../core/models/catalogos.models';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth.service';

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
    private authService: AuthService,
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

      if (this.update == null) {
        Swal.fire({
          text: 'Cargando',
          allowEscapeKey: false,
          allowOutsideClick: false
        });
        Swal.showLoading();
        this.clienteService.postCliente(this.formulario.value).subscribe(cliente => {
          this.clientes.unshift(cliente)
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
        this.clienteService.putCliente(this.formulario.value).subscribe(cliente => {
          if (this.update != null)
            this.clientes[this.update] = cliente;
          document.getElementById('closeModal')?.click();
          Swal.close();
        });
      }

    } else {
      return Object.values(this.formulario.controls).forEach(control => control.markAsTouched());
    }

  }

  public prepararUpdate(index: number, tipo: string): void {

    this.formulario.patchValue(this.clientes[index]);
    if (tipo === 'read') {
      document.getElementById('readButton')?.click();
    }
    if (tipo === 'update') {
      document.getElementById('addButton')?.click();
    }
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
      // direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]],
      saldo: [0, [Validators.required, Validators.min(0)]],
      metodoPago: [0, [Validators.required, Validators.min(1)]],
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

  generarLogin(index: number): void {
    Swal.fire({
      icon: 'question',
      text: 'Generate user login?',
      showCancelButton: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.generarLogin(this.clientes[index].id).subscribe(usuario => {
          this.clientes[index].usuario = usuario;
          Swal.fire({
            icon: 'success',
            title: 'Access Login generated',
            timer: 3000
          });
        });
      }
    });
  }

  mostrarUsuario(index: number): void {
    console.log(this.clientes[index]);
  }

  public canCreate(): boolean {return this.authService.canCreate()};

  public canRead(): boolean {return this.authService.canRead()};

  public canUpdate(): boolean {return this.authService.canUpdate()};

  public canDelete(): boolean {return this.authService.canDelete()};
}
