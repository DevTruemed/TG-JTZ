import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductoModel, TipoModel } from '../models/catalogos.models';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  urlBase: string = environment.api + '/jtz/productos'

  constructor(private http: HttpClient) { }

  getProductos(tipo: string = 'all'): Observable<ProductoModel[]> {

    let params: HttpParams = new HttpParams().set('tipo', tipo);

    return this.http.get<ProductoModel[]>(this.urlBase, { params });

  }

  postProductos(producto: ProductoModel): Observable<ProductoModel> {

    return this.http.post<ProductoModel>(this.urlBase, producto);

  }

  putProductos(producto: ProductoModel): Observable<ProductoModel> {

    return this.http.put<ProductoModel>(this.urlBase + '/' + producto.id, producto);

  }

  cloneProduct(producto: number, nombre: string, precio: number, proveedor: number, idOc: number) {
    let formData = new FormData();
    formData.append("idProducto", producto.toString());
    formData.append("nombre", nombre);
    formData.append("precio", precio.toString());
    formData.append("idProveedor", proveedor.toString());
    formData.append("idOc", idOc.toString());

    return this.http.post(this.urlBase + "/clone", formData);
  }

  putPrecioProveedor(idProv: number, idProd: number, precio: number) {
    let formData: FormData = new FormData();
    formData.append("idProducto", idProd.toString());
    formData.append("idProveedor", idProv.toString());
    formData.append("precio", precio.toString());

    return this.http.put(this.urlBase + "/supplierPrice", formData);
  }

}
