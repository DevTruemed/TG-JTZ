import { Component, OnInit } from '@angular/core';
import { TicketModel } from '../../../core/models/tickets.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PropiedadModel } from '../../../core/models/catalogos.models';
import { PropiedadesService } from '../../../core/services/propiedades.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketsService } from '../../../core/services/tickets.service';

@Component({
  selector: 'app-tickets-form',
  templateUrl: './tickets-form.component.html',
  styleUrls: ['./tickets-form.component.css']
})
export class TicketsFormComponent implements OnInit {

  ticket: TicketModel = new TicketModel();
  formulario!: FormGroup;
  propiedades: PropiedadModel[] = [];
  height: number = screen.height - 165;
  width: number = screen.width;
  update: boolean = false;
  constructor(private fb: FormBuilder,
    private propiedadService: PropiedadesService,
    private ticketsService: TicketsService,
    private router: Router,
    private activeRoute: ActivatedRoute) {
    this.inicializarFormulario();
    if (activeRoute.snapshot.params.id) this.update = true;
  }

  ngOnInit(): void {
    if (this.update)
      this.ticketsService.getTicket(this.activeRoute.snapshot.params.id).subscribe(ticket => {
        this.ticket = ticket;
        this.formulario.patchValue(ticket);
      });
    else
      this.propiedadService.getPropiedades("tickets").subscribe(propiedades => {
        this.propiedades = propiedades;
        this.formulario.patchValue({ 'idPropiedad': this.propiedades[0] });
      });
  }

  public create() {
    if (this.formulario.valid) {
      this.ticketsService.createTicket(this.formulario.value).subscribe(() => this.router.navigate(['/platform', 'tickets']),
        err => console.log(err));
    } else
      return this.markFormGroupTouched(this.formulario);
  }

  private inicializarFormulario(): void {

    this.formulario = this.fb.group({
      id: [],
      idPropiedad: this.fb.group({
        id: [0, [Validators.required]],
      }),
      descripcion: ['', [Validators.required, Validators.max(255)]],
      observacion: ['', [Validators.max(500)]]
    });

  }

  public selectPropiedad(index: number): void {
    this.formulario.patchValue({ 'idPropiedad': this.propiedades[index] });
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

}
