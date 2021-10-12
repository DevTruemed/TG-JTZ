import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { CuentaContableModel, TipoModel } from '../models/catalogos.models'

@Injectable({
  providedIn: 'root'
})
export class CcService {

  urlBase: string = environment.api + '/jtz/cc'

  constructor(private http: HttpClient) { }

  getCuentas(): Observable<CuentaContableModel[]>{

    return this.http.get<CuentaContableModel[]>(this.urlBase);

  }

  getSubCuentas(): Observable<CuentaContableModel[]>{

    return this.http.get<CuentaContableModel[]>(this.urlBase+'/sub');

  }
  
  postCuenta(producto: CuentaContableModel): Observable<CuentaContableModel>{
    
    return this.http.post<CuentaContableModel>(this.urlBase, producto);
    
  }
  
  putCuenta(producto: CuentaContableModel): Observable<CuentaContableModel>{
    
    return this.http.put<CuentaContableModel>(this.urlBase + '/' + producto.id, producto);
    
  }
  
  deleteCuenta(id: number): Observable<any>{
    return this.http.delete<any>( this.urlBase + '/' + id );
  }

}
