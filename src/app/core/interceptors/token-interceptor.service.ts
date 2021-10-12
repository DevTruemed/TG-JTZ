import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let reqClone = req.clone();

    if (this.authService.isAuth()) {

      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.readToken()
      });

      reqClone = req.clone({ headers });

    }

    return next.handle(reqClone)
      .pipe(
        catchError(error => {

          if (error.error.message) {

            Swal.fire({
              icon: 'error',
              title: 'Error ' + error.status,
              text: error.error.message,
            })

          }

          return throwError(error);
        }));

  }

}
