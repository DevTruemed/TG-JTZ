import { Component, OnInit } from '@angular/core';
import { ContratoModel } from '../../../core/models/contratos.model';
import { ContratosService } from '../../../core/services/contratos.service';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit {

  contratos: ContratoModel[] = [];

  height: number = screen.height - 165;

  constructor(private contratosService: ContratosService) { }

  ngOnInit(): void {
    this.contratosService.getContratos("platform").subscribe(contratos => this.contratos = contratos)
  }

}
