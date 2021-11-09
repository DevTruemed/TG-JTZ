import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ContratoModel, PagoContratoModel } from '../models/contratos.model';
import { Observable } from 'rxjs';
import { DocumentoModel } from '../models/catalogos.models';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {


  urlBase: string = environment.api + '/jtz/contratos';

  constructor(private http: HttpClient) { }

  getContratos(type: string): Observable<any> {

    let params: HttpParams = new HttpParams().set('type', type);
    return this.http.get<ContratoModel[]>(this.urlBase, { params: params });

  }

  getContrato(id: number): Observable<ContratoModel> {
    return this.http.get<any>(this.urlBase + '/' + id);
  }

  createContrato(contrato: ContratoModel): Observable<ContratoModel> {

    let formData: FormData = new FormData();

    formData.append('propiedad', contrato.propiedad.id.toString());
    formData.append('cliente', contrato.cliente.id.toString());
    formData.append('tipo', contrato.tipo.id.toString());
    formData.append('monto', contrato.monto.toString());
    formData.append('fechaInicio', contrato.fechaInicio.toString());
    formData.append('fechaTermino', contrato.fechaTermino.toString());

    return this.http.post<ContratoModel>(this.urlBase, formData);

  }

  postArchivos(idContrato: number, archivos: File[], idTipo: number) {
    let formData: FormData = new FormData();

    archivos.forEach(archivo => formData.append('archivos', archivo));
    formData.append('id', idContrato.toString());
    formData.append('idTipo', idTipo.toString());

    return this.http.post<DocumentoModel[]>(this.urlBase + '/archivos', formData);
  }

  deleteContrato(id: number): Observable<any> {
    return this.http.delete<any>(this.urlBase + '/' + id);
  }

  addPago(pago: PagoContratoModel) {
    let formData: FormData = new FormData();

    formData.append('idContrato', pago.contrato.id.toString());
    formData.append('concepto', pago.concepto);
    formData.append('monto', pago.monto.toString());
    formData.append('banco', pago.banco.id.toString());
    if (!pago.tipoEntrada) {
      formData.append('idProveedor', pago.proveedor.id.toString());
    }
    formData.append('tipoEntrada', pago.tipoEntrada.toString());

    return this.http.post<PagoContratoModel>(this.urlBase + '/pagos', formData);
  }
}
