import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProveedorModel } from '../models/catalogos.models';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  urlBase: string = environment.api + '/jtz/proveedores'

  constructor(private http: HttpClient) { }

  getProveedores(): Observable<ProveedorModel[]>{

    return this.http.get<ProveedorModel[]>(this.urlBase);

  }

  getProveedor(id: number): Observable<ProveedorModel>{

    return this.http.get<ProveedorModel>( this.urlBase + '/' +id )

  }

  postProveedor( proveedor: ProveedorModel ): Observable<ProveedorModel>{

    return this.http.post<ProveedorModel>(this.urlBase, proveedor);

  }

  putProveedor( proveedor: ProveedorModel ): Observable<ProveedorModel>{

    return this.http.put<ProveedorModel>(this.urlBase + '/' + proveedor.id, proveedor);

  }

  desactiveProveedor( id: number ): Observable<void>{
    return this.http.delete<void>(this.urlBase + '/' + id);
  }

}
