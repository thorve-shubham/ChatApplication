import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatRouterGuardService implements CanActivate {

  constructor(
    private router :Router
  ) { }
  canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): any {
    console.log('inside Route Guard');
    if(Cookie.get('authToken') === "" || Cookie.get('authToken')==null || Cookie.get('authToken') ==undefined){
      this.router.navigate(['/']);
    }else{
      return true;
    }
  }
  
}
