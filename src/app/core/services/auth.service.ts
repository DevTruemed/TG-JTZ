import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null;

  private urlService: string = environment.api + '/security';

  constructor(private http: HttpClient) {
    this.token = this.readToken();
  }

  login(username: string, password: string): Observable<any> {

    const urlEndpoint = this.urlService + '/oauth/token';

    const credenciales = btoa('tmapp' + ':' + 'Ag785.-4$795Tyui');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', username);
    params.set('password', password);

    return this.http.post<any>(urlEndpoint, params.toString(), { headers: httpHeaders })
      .pipe(
        map(resp => {
          this.saveToken(resp['access_token'], resp['expires_in']);

          if (resp['accesos'])
            localStorage.setItem('accesos', JSON.stringify(resp['accesos']))

          return { isAuth: true, accesos: resp['accesos'] };
        })
      );
  }

  /* Método que se encarga de almacenar el token y la fecha de
   expiración del mismo en el localStorage*/
  saveToken(token: string, expiresIn: number): void {

    this.token = token;
    localStorage.setItem('token', token);
    let date = new Date();
    date.setSeconds(expiresIn);
    localStorage.setItem('expiration', date.getTime().toString());

  }

  /* Método que se encarga de validar si ya hay un token existente
  e inicializa la variable local con el token o con una cadena vacia*/
  readToken(): string | null {

    if (localStorage.getItem('token'))
      this.token = localStorage.getItem('token');
    else
      this.token = null;

    return this.token;

  }

  /* Método que verifica si hay un token existente y en caso que si lo haya,
  verifica que el mismo no haya expirado  */
  isAuth(): boolean {

    if (this.token === null || this.token.length < 2) {
      return false;
    }

    if (new Date(Number(localStorage.getItem('expiration')) - 310) <= new Date()) {
      return false;
    }

    return true;
  }

  /* Método que elimina el token y su fecha de expiración
  del localStorage */
  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('expiration');

  }

}
