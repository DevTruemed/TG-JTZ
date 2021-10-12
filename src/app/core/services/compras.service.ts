import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdenCompraModel } from '../models/compras.model';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  urlBase: string = environment.api + '/jtz/oc'

  constructor(private http: HttpClient) { }

  getOrdenesCompra(estatus: string = 'all'): Observable<any> {

    let params: HttpParams = new HttpParams().set('estatus', estatus);

    return this.http.get<any>(this.urlBase, {params: params});

  }

  getOrdenCompra(id: number): Observable<OrdenCompraModel> {
    return this.http.get<OrdenCompraModel>(this.urlBase + '/' + id);
  }

  postOrdenCompra(oc: OrdenCompraModel): Observable<OrdenCompraModel> {
    return this.http.post<OrdenCompraModel>(this.urlBase, oc);
  }

  putOrdenCompra(oc: OrdenCompraModel): Observable<OrdenCompraModel> {
    return this.http.put<OrdenCompraModel>(this.urlBase + '/' + oc.id, oc);
  }

  cancelOrdenCompra(id: number): Observable<void> {
    return this.http.delete<void>(this.urlBase + '/' + id);
  }

  sendPago(id: number, file: File, folio: string): Observable<void> {

    let formData: FormData = new FormData();

    formData.append('pago', file)
    formData.append('folio', folio);

    return this.http.post<void>(this.urlBase + '/' + id + '/pago', formData);

  }

  getPago(id: number): Observable<Blob> {

    return this.http.get<Blob>(this.urlBase + '/' + id + '/pago', { responseType: 'blob' as 'json' });
    
  }

}
