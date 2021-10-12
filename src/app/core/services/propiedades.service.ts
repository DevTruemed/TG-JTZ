import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PropiedadModel, TipoModel } from '../models/catalogos.models';

@Injectable({
  providedIn: 'root'
})
export class PropiedadesService {

  urlBase: string = environment.api + '/jtz/propiedades'

  constructor(private http: HttpClient) { }

  getPropiedades(): Observable<PropiedadModel[]>{

    return this.http.get<PropiedadModel[]>(this.urlBase);

  }

  getTipos(): Observable<TipoModel[]>{

    return this.http.get<TipoModel[]>(this.urlBase+'/tipos');

  }

  getImagen(ruta: string): Observable<any>{

    const params: HttpParams = new HttpParams().append('ruta',ruta);
   
    return this.http.get<any>(this.urlBase + '/images', {params})
    
  } 
  
  postPropiedad(propiedad: PropiedadModel, imagenes: File[]): Observable<PropiedadModel>{
 
    let formData: FormData = new FormData();

    imagenes.forEach( imagen => formData.append('images', imagen) );

    propiedad.productos.forEach( producto => {formData.append('productos', producto.id.toString())});
    
    formData.append('descripcion', propiedad.descripcion) 
    formData.append('direccion',propiedad.direccion)
    formData.append('estado',propiedad.estado)
    formData.append('cp',propiedad.cp)
    formData.append('numeroExterior',propiedad.numeroExterior)
    formData.append('tipo',propiedad.tipo.id.toString())
    formData.append('renta',propiedad.renta.toString())
    formData.append('venta',propiedad.venta.toString())
    formData.append('habitaciones',propiedad.habitaciones.toString())
    formData.append('terreno',propiedad.terreno.toString())
    formData.append('terrenoConstruido',propiedad.terrenoConstruido.toString())
    formData.append('noPisos', propiedad.noPisos.toString())
    formData.append('pais', propiedad.pais)
    formData.append('piso', propiedad.piso.toString())
    formData.append('recamaras', propiedad.recamaras.toString())
    formData.append('banos', propiedad.banos.toString())
    formData.append('estacionamientos', propiedad.estacionamientos.toString())
    return this.http.post<PropiedadModel>(this.urlBase, formData);

  }

  putPropiedad(propiedad: PropiedadModel, imagenes: File[]): Observable<PropiedadModel>{

    let formData: FormData = new FormData();

    imagenes.forEach( imagen => formData.append('images', imagen) );
    
    formData.append('descripcion', propiedad.descripcion) 
    formData.append('direccion',propiedad.direccion)
    formData.append('estado',propiedad.estado)
    formData.append('cp',propiedad.cp)
    formData.append('numeroExterior',propiedad.numeroExterior)
    formData.append('tipo',propiedad.tipo.id.toString())
    formData.append('renta',propiedad.renta.toString())
    formData.append('venta',propiedad.venta.toString())
    formData.append('habitaciones',propiedad.habitaciones.toString())
    formData.append('terreno',propiedad.terreno.toString())
    formData.append('terrenoConstruido',propiedad.terrenoConstruido.toString())
    formData.append('noPisos', propiedad.noPisos.toString())
    formData.append('pais', propiedad.pais)
    formData.append('piso', propiedad.piso.toString())
    formData.append('recamaras', propiedad.recamaras.toString())
    formData.append('banos', propiedad.banos.toString())
    formData.append('estacionamientos', propiedad.estacionamientos.toString())

    return this.http.put<PropiedadModel>(this.urlBase+'/'+propiedad.id, formData);

  }

  deleteImagen(idImagen: number): Observable<boolean>{

    return this.http.delete<boolean>(this.urlBase + '/images/' + idImagen);

  }

}
