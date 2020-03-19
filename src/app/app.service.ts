import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//http imports
import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Cookie } from 'ng2-cookies/ng2-cookies';
 
@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url =  'https://chatapi.edwisor.com';

  constructor(
    public http: HttpClient
  ) {  }  


  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } 


  public setUserInfoInLocalStorage = (data) =>{

    localStorage.setItem('userInfo', JSON.stringify(data))


  }

  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)
      .set('apiKey', data.apiKey);

    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  } 

  public signinFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);
  } 

  
  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))

    return this.http.post(`${this.url}/api/v1/users/logout`, params);

  }

  

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } 

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  } 

}

