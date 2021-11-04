import { Component, OnInit } from '@angular/core';
import { ContratosService } from '../../../core/services/contratos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ContratoModel } from '../../../core/models/contratos.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TicketsService } from '../../../core/services/tickets.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  formulario!: FormGroup;
  contrato: ContratoModel = new ContratoModel();
  height: number = screen.height - 165;
  width: number = screen.width;
  constructor(private fb: FormBuilder,
    private contratosService: ContratosService,
    private ticketsService: TicketsService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.inicializarFormularios();
    this.contratosService.getContrato(this.activeRoute.snapshot.params.id).subscribe(contrato => this.contrato = contrato,
      err => this.router.navigate(['/leases']));
  }

  agregarPago(): void {
    if (this.formulario.valid) {
      this.formulario.patchValue({ 'contrato': { id: this.activeRoute.snapshot.params.id } });
      this.contratosService.addPago(this.formulario.value).subscribe(() => {
        this.ngOnInit()
      },
        err => console.log(err));
    } else
      return this.markFormGroupTouched(this.formulario);
  }

  cambiarEstatus(index: number, estatus: boolean): void {
    let ticket = this.contrato.tickets[index];
    if (!ticket.observacion) ticket.observacion = '';
    this.ticketsService.updateEstatus(ticket.id, estatus, ticket.observacion).subscribe(res => {
      this.contrato.tickets[index] = res;
    });
  }

  saveComment(index: number): void {
    let ticket = this.contrato.tickets[index];

    if (!ticket.observacion) ticket.observacion = '';

    this.ticketsService.updateComentario(ticket.id, ticket.observacion).subscribe(res => {
      this.contrato.tickets[index] = res;
    });
  }

  private inicializarFormularios(): void {

    this.formulario = this.fb.group({
      contrato: this.fb.group({
        id: [0],
      }),
      concepto: ['', [Validators.max(150), Validators.required]],
      monto: ['', [Validators.min(1), Validators.required]],
    });

  }

  public isValid(form: FormGroup, field: string): boolean {
    // @ts-ignore
    return form.get(field).invalid && form.get(field).touched;
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

  get total(): number {
    return this.contrato.pagos.reduce((sum: any, value: any) => (sum + value['monto']), 0);
  }
}
