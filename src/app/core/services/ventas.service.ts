import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VentaModel } from '../models/ventas.model';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  urlBase: string = environment.api + '/jtz/ventas'

  constructor(private http: HttpClient) { }

  getVentas(estatus: string = 'cotizaciones', idCliente: number | null = null): Observable<any> {

    let params: HttpParams = new HttpParams().set('estatus', estatus);
    
    if ( idCliente != null )
      params = params.set('cliente',idCliente.toString());

    return this.http.get<any>(this.urlBase, {params: params});

  }

  getVenta(id: number): Observable<VentaModel>{
    return this.http.get<any>(this.urlBase + '/' + id);
  }

  getFactura(id: number): Observable<Blob>{
    return this.http.get<Blob>(this.urlBase + '/' + id + '/factura', {responseType: 'blob' as 'json'})
  }
  createVenta(venta: VentaModel): Observable<VentaModel> {

    return this.http.post<VentaModel>(this.urlBase, venta);

  }

  update(venta: VentaModel): Observable<VentaModel>{
    return this.http.put<VentaModel>(this.urlBase + '/' + venta.id, venta);
  }

  facturar(id: number): Observable<void>{
    return this.http.put<void>(this.urlBase + '/' + id + '/facturar', null);
  }

  cancelar(id: number): Observable<void>{
    return this.http.delete<void>(this.urlBase + '/' + id );
  }

  depositar(dto: any): Observable<void>{
    return this.http.post<void>(this.urlBase + '/deposito', dto );
  }

}
