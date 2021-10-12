import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    if ( this.authService.isAuth() ){
      return true;
    }else {
      this.router.navigate(['login']);
      return false;
    }

  }
}
