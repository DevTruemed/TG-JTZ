import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClienteModel, DocumentoModel } from '../models/catalogos.models';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  urlBase: string = environment.api + '/jtz/clientes'

  constructor(private http: HttpClient) { }

  getClientes(): Observable<ClienteModel[]> {

    return this.http.get<ClienteModel[]>(this.urlBase);

  }


  postCliente(Cliente: ClienteModel): Observable<ClienteModel> {

    return this.http.post<ClienteModel>(this.urlBase, Cliente);

  }

  putCliente(Cliente: ClienteModel): Observable<ClienteModel> {

    return this.http.put<ClienteModel>(this.urlBase + '/' + Cliente.id, Cliente);

  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete<any>(this.urlBase + '/' + id);
  }

  postArchivos(idCliente: number, archivos: File[], idTipo: number) {
    let formData: FormData = new FormData();

    archivos.forEach(archivo => formData.append('archivos', archivo));
    formData.append('id', idCliente.toString());
    formData.append('idTipo', idTipo.toString());

    return this.http.post<DocumentoModel[]>(this.urlBase + '/archivos', formData);
  }

  generarLogin(idCliente: number) {
    let formData: FormData = new FormData();
    formData.append('idCliente', idCliente.toString());

    return this.http.post(this.urlBase + '/login', formData);
  }

}
