import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AngularMyDatePickerDirective, IAngularMyDpOptions } from 'angular-mydatepicker';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ContratoModel } from '../../../core/models/contratos.model';
import { PropiedadModel, ClienteModel, TipoContratoModel } from '../../../core/models/catalogos.models';
import { Router } from '@angular/router';
import { ClientesService } from '../../../core/services/clientes.service';
import { PropiedadesService } from '../../../core/services/propiedades.service';
import { TiposContratosService } from '../../../core/services/tipos-contratos.service';
import { ContratosService } from '../../../core/services/contratos.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  contrato: ContratoModel = new ContratoModel();
  formulario!: FormGroup;
  propiedades: PropiedadModel[] = [];
  clientes: ClienteModel[] = [];
  tipos: TipoContratoModel[] = [];
  height: number = screen.height - 165;
  width: number = screen.width;
  @ViewChild('dp') myDp!: AngularMyDatePickerDirective;
  myOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'yyyy-mm-dd',
    appendSelectorToBody: true,
  };

  constructor(private fb: FormBuilder,
    private propiedadService: PropiedadesService,
    private clienteService: ClientesService,
    private tiposService: TiposContratosService,
    private contratosService: ContratosService,
    private cdr: ChangeDetectorRef,
    private router: Router) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {

    this.propiedadService.getPropiedades("contratable").subscribe(propiedades => {
      this.propiedades = propiedades;
      this.formulario.patchValue({ 'propiedad': this.propiedades[0] });
      let monto = this.propiedades[0].productos.filter(producto => producto.cuenta.id == 141)[0].precio;
      this.formulario.patchValue({ 'monto': monto });
    });
    this.clienteService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
      this.formulario.patchValue({ 'cliente': this.clientes[0] })
    });
    this.tiposService.getTiposContratos().subscribe(tipos => {
      this.tipos = tipos;
      this.formulario.patchValue({ 'tipo': this.tipos[0] })
    });
  }

  public create() {
    if (this.formulario.valid) {
      this.contratosService.createContrato(this.formulario.value).subscribe(() => this.router.navigate(['/leases']),
        err => console.log(err));
    } else
      return this.markFormGroupTouched(this.formulario);
  }

  get pagosForm(): FormArray {
    return this.formulario.get('pagos') as FormArray;
  }

  get ticketsForm(): FormArray {
    return this.formulario.get('tickets') as FormArray;
  }

  private inicializarFormulario(): void {

    this.formulario = this.fb.group({
      id: [],
      propiedad: this.fb.group({
        id: [0, [Validators.required]],
      }),
      cliente: this.fb.group({
        id: [0, [Validators.required]],
      }),
      tipo: this.fb.group({
        id: [0, [Validators.required]],
      }),
      monto: [0, [Validators.min(1), Validators.required]],
      rango: [],
      fechaInicio: ['', [Validators.required]],
      fechaTermino: ['', [Validators.required]],
      pagos: this.fb.array([]),
      tickets: this.fb.array([])
    });

  }

  public selectPropiedad(index: number): void {
    this.formulario.patchValue({ 'propiedad': this.propiedades[index] });
    let monto = this.propiedades[index].productos.filter(producto => producto.cuenta.id == 141)[0].precio;
    this.formulario.patchValue({ 'monto': monto });
  }

  public selectCliente(index: number): void {
    this.formulario.patchValue({ 'cliente': this.clientes[index] })
  }

  public selectTipo(index: number): void {
    this.formulario.patchValue({ 'tipo': this.tipos[index] })
  }

  public isValid(form: FormGroup, field: string): boolean {
    // @ts-ignore
    return form.get(field).invalid && form.get(field).touched;
  }

  toggleCalendar(): void {
    this.cdr.detectChanges();
    this.myDp.toggleCalendar();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    //@ts-ignore
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  seleccionarFechas(e: any): void {
    this.formulario.patchValue({ 'fechaInicio': e.dateRange.formatted.split(" - ")[0] });
    this.formulario.patchValue({ 'fechaTermino': e.dateRange.formatted.split(" - ")[1] });
  }
}
