import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private http: HttpClient) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      Swal.fire({
        text:'Cargando',
        allowEscapeKey:false,
        allowOutsideClick: false
      });
      Swal.showLoading();

    return this.checkRoute(this.getRuta(state.url));

  }

  private checkRoute(route: string): Observable<boolean>{

    const params: HttpParams = new HttpParams().set('route', route);

    return this.http.get<boolean>('https://localhost:8090/security/checkRoute', { params })
    .pipe(
      map(res => {

        if ( !res )
          Swal.fire('Access denied','', 'error');

        else
          Swal.close();

        return res;
      }),
      catchError(error => {

            Swal.fire({
              icon: 'error',
              title: 'Error '
            })

          return new Observable<boolean>(observer => observer.next(false));
        })
      );

  }

  private getRuta(route: string): string {
    const array: string[] = route.split("/");

    let ruta: string = '/';

    for (let index = 1; index < array.length; index++) {
      const element = array[index];

      ruta += element;

      if (index < array.length - 1)
        ruta += ',';
    }

    return ruta;
  }

}
