import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CxpService {

  urlBase: string = environment.api + '/jtz/cxp'

  constructor(private http: HttpClient){

  }

  getCuentasPorPagar(estatus: string): Observable<any> {

    let params: HttpParams = new HttpParams().set('estatus', estatus);

    return this.http.get<any>(this.urlBase, {params});

  }

  putRevisar(id: number): Observable<void>{
    return this.http.put<void>(this.urlBase + '/' + id + '/revisar', null);
  }

  putAutorizar(id: number): Observable<void>{
    return this.http.put<void>(this.urlBase + '/' + id + '/autorizar', null);
  }

  getPago(id: number): Observable<Blob> {

    return this.http.get<Blob>(this.urlBase + '/' + id + '/pago', { responseType: 'blob' as 'json' });
    
  }

  sendPago(id: number, file: File, idBanco: number): Observable<void> {

    let formData: FormData = new FormData();

    formData.append('pago', file)
    formData.append('banco', idBanco.toString());

    return this.http.post<void>(this.urlBase + '/' + id + '/pagar', formData);

  }


}
