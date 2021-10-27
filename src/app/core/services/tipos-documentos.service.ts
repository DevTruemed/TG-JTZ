import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { TipoDocumentoModel } from '../models/catalogos.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposDocumentosService {

  urlBase: string = environment.api + '/jtz/tipos_documentos'

  constructor(private http: HttpClient) { }

  getTiposDocumentos(): Observable<TipoDocumentoModel[]> {

    return this.http.get<TipoDocumentoModel[]>(this.urlBase);

  }


  postTipoDocumento(TipoDocumento: TipoDocumentoModel): Observable<TipoDocumentoModel> {

    return this.http.post<TipoDocumentoModel>(this.urlBase, TipoDocumento);

  }

  putTipoDocumento(TipoDocumento: TipoDocumentoModel): Observable<TipoDocumentoModel> {

    return this.http.put<TipoDocumentoModel>(this.urlBase + '/' + TipoDocumento.id, TipoDocumento);

  }
}
