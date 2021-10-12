import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClienteModel } from '../models/catalogos.models';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  urlBase: string = environment.api + '/jtz/clientes'

  constructor(private http: HttpClient) { }

  getClientes(): Observable<ClienteModel[]>{

    return this.http.get<ClienteModel[]>(this.urlBase);

  }

  
  postCliente(Cliente: ClienteModel): Observable<ClienteModel>{
    
    return this.http.post<ClienteModel>(this.urlBase, Cliente);
    
  }
  
  putCliente(Cliente: ClienteModel): Observable<ClienteModel>{
    
    return this.http.put<ClienteModel>(this.urlBase + '/' + Cliente.id, Cliente);
    
  }
  
  deleteCliente(id: number): Observable<any>{
    return this.http.delete<any>( this.urlBase + '/' + id );
  }

}
