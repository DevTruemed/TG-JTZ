import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  urlBase: string = environment.api + '/jtz/documentos'

  constructor(private http: HttpClient) { }

  descargarArchivo(id: number): Observable<any> {
    const requestOptions: Object = {
      responseType: 'arrayBuffer'
    }
    return this.http.get(this.urlBase + '/' + id, requestOptions)
  }

  deleteArchivo(idArchivo: number) {
    return this.http.delete(this.urlBase + '/' + idArchivo);
  }
}
