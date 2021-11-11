import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { TicketModel } from '../models/tickets.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  urlBase: string = environment.api + '/jtz/tickets';

  constructor(private http: HttpClient) { }

  getTickets(type: string): Observable<any> {

    let params: HttpParams = new HttpParams().set('type', type);
    return this.http.get<TicketModel[]>(this.urlBase, { params: params });

  }

  getTicket(id: number): Observable<TicketModel> {
    return this.http.get<any>(this.urlBase + '/' + id);
  }

  createTicket(ticket: any): Observable<TicketModel> {

    let formData: FormData = new FormData();

    formData.append('propiedad', ticket.idPropiedad.id.toString());
    formData.append('descripcion', ticket.descripcion);

    return this.http.post<TicketModel>(this.urlBase, formData);

  }

  updateEstatus(id: number, estatus: boolean, comentario: string): Observable<TicketModel> {
    let formData: FormData = new FormData();

    formData.append('estatus', String(estatus));
    formData.append('comentario', comentario);

    return this.http.put<TicketModel>(this.urlBase + '/' + id, formData);
  }

  updateComentario(id: number, comentario: string): Observable<TicketModel> {
    let formData: FormData = new FormData();
    formData.append('comentario', comentario);

    return this.http.put<TicketModel>(this.urlBase + '/' + id, formData);
  }
}
