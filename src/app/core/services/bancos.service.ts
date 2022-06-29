import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BancoModel, TipoModel } from '../models/catalogos.models';

@Injectable({
  providedIn: 'root'
})
export class BancosService {

  urlBase: string = environment.api + '/jtz/bancos'

  constructor(private http: HttpClient) { }

  getBancos(): Observable<BancoModel[]> {

    return this.http.get<BancoModel[]>(this.urlBase);

  }


  postBanco(banco: BancoModel): Observable<BancoModel> {

    return this.http.post<BancoModel>(this.urlBase, banco);

  }

  postDeposito(deposito: any): Observable<any> {
    return this.http.post<any>(this.urlBase + '/deposito', deposito);
  }

  postPago(pago: any): Observable<any> {
    return this.http.post<any>(this.urlBase + '/pago', pago);
  }

  putPago(pagoId: number, cuentaId: number): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('pagoId', pagoId.toString());
    formData.append('cuentaId', cuentaId.toString());
    return this.http.put<any>(this.urlBase + '/pago', formData);
  }

  putBanco(banco: BancoModel): Observable<BancoModel> {

    return this.http.put<BancoModel>(this.urlBase + '/' + banco.id, banco);

  }

  deleteBanco(id: number): Observable<any> {
    return this.http.delete<any>(this.urlBase + '/' + id);
  }

  getMovimientos(idBanco: number | null = null): Observable<any> {

    let params: HttpParams = new HttpParams();

    if (idBanco != null)
      params = new HttpParams().set("idBanco", idBanco.toString());

    return this.http.get(this.urlBase + '/movimientos', { params })
  }

  getDeposito(id: number): Observable<any> {
    return this.http.get(this.urlBase + '/deposito/' + id);
  }

  addAbonos(abonos: any[], id: number): Observable<void> {
    return this.http.put<void>(this.urlBase + '/deposito/' + id + '/addAbonos', abonos);
  }

  getTiposPago(): Observable<TipoModel[]> {
    return this.http.get<TipoModel[]>(this.urlBase + '/tiposPago');
  }

  deletePago(id: number): Observable<any> {
    return this.http.delete<any>(this.urlBase + '/pago/' + id.toString());
  }

  deleteDeposito(id: number): Observable<any> {
    return this.http.delete<any>(this.urlBase + '/deposito/' + id.toString());
  }

}
