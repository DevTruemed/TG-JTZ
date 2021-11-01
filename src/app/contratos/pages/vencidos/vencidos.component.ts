import { Component, OnInit } from '@angular/core';
import { ContratoModel } from '../../../core/models/contratos.model';
import { ContratosService } from '../../../core/services/contratos.service';
import { DocumentoModel } from '../../../core/models/catalogos.models';

@Component({
  selector: 'app-vencidos',
  templateUrl: './vencidos.component.html',
  styleUrls: ['./vencidos.component.css']
})
export class VencidosComponent implements OnInit {

  contratos: ContratoModel[] = [];

  height: number = screen.height - 165;

  documentacion: DocumentoModel[] = [];

  idContrato: number = 0;

  constructor(private contratosService: ContratosService) { }

  ngOnInit(): void {
    this.contratosService.getContratos("vencidos").subscribe(contratos => this.contratos = contratos)
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

}
