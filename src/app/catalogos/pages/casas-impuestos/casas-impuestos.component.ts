import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PropiedadImpuestoModel } from '../../../core/models/catalogos.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PropiedadesService } from '../../../core/services/propiedades.service';
import { AngularMyDatePickerDirective, IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';

@Component({
  selector: 'app-casas-impuestos',
  templateUrl: './casas-impuestos.component.html',
  styleUrls: ['./casas-impuestos.component.css']
})
export class CasasImpuestosComponent implements OnInit {

  formularioAddImpuesto!: FormGroup;
  @Input() idPropiedad: number = 0;
  @Input() impuestos: PropiedadImpuestoModel[] = [];
  @ViewChild('dp') myDp!: AngularMyDatePickerDirective;
  myOptions: IAngularMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
    defaultView: 3,
    monthSelector: false,
    appendSelectorToBody: true,
  };

  constructor(private formBuilder: FormBuilder,
    private propiedadesService: PropiedadesService,
    private cdr: ChangeDetectorRef) { 
    this.inicializarFormulario();
  }

  ngOnInit(): void {
  }

  public agregarImpuesto(): void {
    if (this.formularioAddImpuesto.valid) {
      this.formularioAddImpuesto.get('propiedad')?.setValue(this.idPropiedad);
      this.propiedadesService.postImpuesto(this.formularioAddImpuesto.value).subscribe(i => {
        // console.log(i);
        // document.getElementById('closeImpuestosModal')?.click();
        this.reiniciarForm();
        this.impuestos.push(i);
      }, err => console.log(err));
    } else {
      return Object.values(this.formularioAddImpuesto.controls).forEach(control => control.markAsTouched());
    }
  }

  eliminarImpuesto(impuesto: PropiedadImpuestoModel,index: number): void {
    this.propiedadesService.deleteImpuesto(impuesto.id).subscribe( () => this.impuestos.splice(index,1));
  }

  public isValid(form: FormGroup, field: string): boolean {

    //@ts-ignore
    return form.get(field).invalid && form.get(field).touched;

  }

  public reiniciarForm(): void {
    this.formularioAddImpuesto.reset();
  }

  private inicializarFormulario(): void{
    // let model: IMyDateModel = {isRange: false};
    this.formularioAddImpuesto = this.formBuilder.group({
      propiedad: [0],
      monto: [0, [Validators.min(1), Validators.required]],
      fechaImpuesto: ['', [Validators.required]]
    });
  }

  toggleCalendar(): void {
    this.cdr.detectChanges();
    this.myDp.toggleCalendar();
  }
}
