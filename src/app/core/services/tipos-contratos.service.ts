import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoContratoModel } from '../models/catalogos.models';

@Injectable({
  providedIn: 'root'
})
export class TiposContratosService {

  urlBase: string = environment.api + '/jtz/tipos_contratos'

  constructor(private http: HttpClient) { }

  getTiposContratos(): Observable<TipoContratoModel[]> {

    return this.http.get<TipoContratoModel[]>(this.urlBase);

  }


  postTipoContrato(TipoDocumento: TipoContratoModel): Observable<TipoContratoModel> {

    return this.http.post<TipoContratoModel>(this.urlBase, TipoDocumento);

  }

  putTipoContrato(TipoDocumento: TipoContratoModel): Observable<TipoContratoModel> {

    return this.http.put<TipoContratoModel>(this.urlBase + '/' + TipoDocumento.id, TipoDocumento);

  }
}
