import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PropiedadModel, TipoModel, PropiedadImpuestoModel, DocumentoModel, SeguroModel } from '../models/catalogos.models';

@Injectable({
  providedIn: 'root'
})
export class PropiedadesService {

  urlBase: string = environment.api + '/jtz/propiedades'

  constructor(private http: HttpClient) { }

  getPropiedades(type: string = ""): Observable<PropiedadModel[]> {

    if (type) {
      let params: HttpParams = new HttpParams().set('type', type);
      return this.http.get<PropiedadModel[]>(this.urlBase, { params: params });
    }

    return this.http.get<PropiedadModel[]>(this.urlBase);

  }

  getTipos(): Observable<TipoModel[]> {

    return this.http.get<TipoModel[]>(this.urlBase + '/tipos');

  }

  getImagen(ruta: string): Observable<any> {

    const params: HttpParams = new HttpParams().append('ruta', ruta);

    return this.http.get<any>(this.urlBase + '/images', { params })

  }

  postPropiedad(propiedad: PropiedadModel, imagenes: File[]): Observable<PropiedadModel> {

    let formData: FormData = new FormData();

    imagenes.forEach(imagen => formData.append('images', imagen));

    propiedad.productos.forEach(producto => { formData.append('productos', producto.id.toString()) });

    formData.append('descripcion', propiedad.descripcion)
    formData.append('direccion', propiedad.direccion)
    formData.append('estado', propiedad.estado)
    formData.append('cp', propiedad.cp)
    formData.append('numeroExterior', propiedad.numeroExterior)
    formData.append('tipo', propiedad.tipo.id.toString())
    formData.append('renta', propiedad.renta.toString())
    formData.append('venta', propiedad.venta.toString())
    formData.append('habitaciones', propiedad.habitaciones.toString())
    formData.append('terreno', propiedad.terreno.toString())
    formData.append('terrenoConstruido', propiedad.terrenoConstruido.toString())
    formData.append('noPisos', propiedad.noPisos.toString())
    formData.append('pais', propiedad.pais)
    formData.append('piso', propiedad.piso.toString())
    formData.append('recamaras', propiedad.recamaras.toString())
    formData.append('banos', propiedad.banos.toString())
    formData.append('estacionamientos', propiedad.estacionamientos.toString())
    return this.http.post<PropiedadModel>(this.urlBase, formData);

  }

  putPropiedad(propiedad: PropiedadModel, imagenes: File[]): Observable<PropiedadModel> {

    let formData: FormData = new FormData();

    imagenes.forEach(imagen => formData.append('images', imagen));

    formData.append('descripcion', propiedad.descripcion)
    formData.append('direccion', propiedad.direccion)
    formData.append('estado', propiedad.estado)
    formData.append('cp', propiedad.cp)
    formData.append('numeroExterior', propiedad.numeroExterior)
    formData.append('tipo', propiedad.tipo.id.toString())
    formData.append('renta', propiedad.renta.toString())
    formData.append('venta', propiedad.venta.toString())
    formData.append('habitaciones', propiedad.habitaciones.toString())
    formData.append('terreno', propiedad.terreno.toString())
    formData.append('terrenoConstruido', propiedad.terrenoConstruido.toString())
    formData.append('noPisos', propiedad.noPisos.toString())
    formData.append('pais', propiedad.pais)
    formData.append('piso', propiedad.piso.toString())
    formData.append('recamaras', propiedad.recamaras.toString())
    formData.append('banos', propiedad.banos.toString())
    formData.append('estacionamientos', propiedad.estacionamientos.toString())

    return this.http.put<PropiedadModel>(this.urlBase + '/' + propiedad.id, formData);

  }

  deleteImagen(idImagen: number): Observable<boolean> {

    return this.http.delete<boolean>(this.urlBase + '/images/' + idImagen);

  }

  postImpuesto(impuesto: PropiedadImpuestoModel): Observable<PropiedadImpuestoModel> {
    let formData: FormData = new FormData();
    formData.append('propiedad', impuesto.propiedad.toString());
    formData.append('tipo', impuesto.tipo);
    formData.append('identificador', impuesto.identificador);
    formData.append('entidad', impuesto.entidad);
    formData.append('paginaWeb', impuesto.paginaWeb);

    return this.http.post<PropiedadImpuestoModel>(this.urlBase + '/impuestos', formData);
  }

  deleteImpuesto(id: number) {
    return this.http.delete<any>(this.urlBase + '/impuestos/' + id);
  }

  postArchivos(idPropiedad: number, archivos: File[], idTipo: number) {
    let formData: FormData = new FormData();

    archivos.forEach(archivo => formData.append('archivos', archivo));
    formData.append('id', idPropiedad.toString());
    formData.append('idTipo', idTipo.toString());

    return this.http.post<DocumentoModel[]>(this.urlBase + '/archivos', formData);
  }

  postSeguro(idPropiedad: number, seguro: SeguroModel) {
    let formData: FormData = new FormData();

    formData.append('propiedad', idPropiedad.toString());
    formData.append('aseguradora', seguro.aseguradora.id.toString());
    formData.append('categoria', seguro.categoria);
    formData.append('poliza', seguro.poliza);
    formData.append('deducible', seguro.deducible.toString());
    formData.append('fechaInicio', seguro.fechaInicio);
    formData.append('fechaTermino', seguro.fechaTermino);
    formData.append('archivo', seguro.documentacion);

    return this.http.post<SeguroModel>(this.urlBase + '/' + idPropiedad + '/seguros', formData);
  }

  postArchivosAseguradora(idSeguro: number, archivos: File[], idTipo: number) {
    let formData: FormData = new FormData();

    archivos.forEach(archivo => formData.append('archivos', archivo));
    formData.append('id', idSeguro.toString());
    formData.append('idTipo', idTipo.toString());

    return this.http.post<DocumentoModel[]>(this.urlBase + '/seguros/' + idSeguro + '/archivos', formData);
  }
}
