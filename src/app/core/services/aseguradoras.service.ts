import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AseguradoraModel } from '../models/catalogos.models';

@Injectable({
  providedIn: 'root'
})
export class AseguradorasService {

  urlBase: string = environment.api + '/jtz/aseguradoras'

  constructor(private http: HttpClient) { }

  getAseguradoras(): Observable<AseguradoraModel[]>{

    return this.http.get<AseguradoraModel[]>(this.urlBase);

  }

  getAseguradora(id: number): Observable<AseguradoraModel>{

    return this.http.get<AseguradoraModel>( this.urlBase + '/' +id )

  }

  postAseguradora( aseguradora: AseguradoraModel ): Observable<AseguradoraModel>{

    return this.http.post<AseguradoraModel>(this.urlBase, aseguradora);

  }

  putAseguradora( aseguradora: AseguradoraModel ): Observable<AseguradoraModel>{

    return this.http.put<AseguradoraModel>(this.urlBase + '/' + aseguradora.id, aseguradora);

  }

  deleteAseguradora(id: number){
    return this.http.delete( this.urlBase + '/' + id );
  }
}
