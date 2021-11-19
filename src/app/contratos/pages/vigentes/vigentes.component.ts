import { Component, OnInit } from '@angular/core';
import { ContratoModel } from '../../../core/models/contratos.model';
import { ContratosService } from '../../../core/services/contratos.service';
import { DocumentoModel } from '../../../core/models/catalogos.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vigentes',
  templateUrl: './vigentes.component.html',
  styleUrls: ['./vigentes.component.css']
})
export class VigentesComponent implements OnInit {

  contratos: ContratoModel[] = [];

  height: number = screen.height - 165;

  documentacion: DocumentoModel[] = [];

  idContrato: number = 0;

  constructor(private contratosService: ContratosService) { }

  ngOnInit(): void {

    this.contratosService.getContratos("vigentes").subscribe(contratos => this.contratos = contratos)

  }

  documentosModal(index: number): void {
    let contrato = this.contratos[index];
    this.documentacion = contrato.documentacion;
    this.idContrato = contrato.id
    document.getElementById('openArchivosModal')?.click();
  }

  subirArchivos(data: { archivos: File[], tipo: number }): void {
    this.contratosService.postArchivos(this.idContrato, data.archivos, data.tipo).subscribe(res => {
      res.forEach(element => {
        this.documentacion.push(element);
      });
    });
  }

  eliminarContrato(index: number): void {
    this.contratosService.deleteContrato(this.contratos[index].id).subscribe(() => this.contratos.splice(index, 1));
  }

  checkFechaTermino(i: number): boolean {
    let contrato = this.contratos[i];
    let now = new Date()
    let anio = now.getUTCFullYear();
    let mes: number = now.getUTCMonth();
    let diaActual = now.getUTCDate();

    let fechaTermino = new Date(Date.parse(contrato.fechaTermino));
    now = new Date(Date.UTC(anio, mes, diaActual));
    fechaTermino.setMonth(fechaTermino.getMonth() - 2);

    if (now.toLocaleDateString() >= fechaTermino.toLocaleDateString()) {
      return true
    }

    return false;
  }

  async incrementarFechaTermino(i: number) {
    let contrato = this.contratos[i];
    // @ts-ignore
    const { value: nuevaFechaTermino } = await Swal.fire({
      title: 'Increase expiration date?',
      text: `Current expiration date is: ${contrato.fechaTermino}`,
      icon: 'question',
      input: 'text',
      inputLabel: 'New expiration date (same format): ',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        } else if (!Date.parse(value) || Date.parse(value) <= Date.parse(contrato.fechaTermino)) {
          return 'You need to write a valid date!';
        } else {
          return false;
        }
      }
    });
    if (nuevaFechaTermino) this.actualizarFechaTermino(contrato.id, nuevaFechaTermino, i);
  }

  actualizarFechaTermino(idContrato: number, fecha: string, indexContrato: number): void {
    Swal.fire({
      text: 'Loading',
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.contratosService.updateFechaTermino(idContrato, fecha).subscribe(res => {
      Swal.fire('Lease updated!');
      this.contratos[indexContrato].fechaTermino = res.fechaTermino;
    }, err => Swal.fire({
      icon: 'error',
      title: err.message
    }));
  }

}
