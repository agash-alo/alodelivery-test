// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor() { }

// }

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { from as fromPromise } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authorization: any;
  userId: any;

  public loggedIn: BehaviorSubject<boolean>;
  jwtHelper: any;

  constructor(private router: Router, private http: HttpClient) {
    this.loggedIn = new BehaviorSubject<boolean>(false);
  }

  //login api

  /** get authenticat state */
  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('tokenA');
      if(token != null){
        return true;
      }else{
        return false;
      }
    // Check whether the token is expired and return
    // true or false
    
  }

  /** Login  */
  postLogin(url: string, pbody: any): Observable<any> {
    url = environment?.baseUrl + url;
    return this.http.post(url, pbody).pipe(map((res) => res));
  }
  getGuestAuthApiData(url: string): Observable<any> {
    this.authorization = sessionStorage.getItem('tokenA')
      ? sessionStorage.getItem('tokenA')
      : '';
    this.userId = localStorage.getItem('useridA')
      ? JSON.parse(localStorage.getItem('useridA') || '')
      : '';
    // console.log(this.authorization);
    url = environment?.baseUrl + url;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authorization,
        userId: this.userId,
      },
    };

    return this.http.get<any>(url, options).pipe(
      tap((_) => console.log('test')),
      catchError(this.handleError('err', []))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (err: any): Observable<T> => {
      // console.log('SERVER ERR', err); // log to console instead ad
      // console.log(`${operation} failed: ${err.message}`);
      if (err.status == 500) {
        // this.snackBar.open(err.error.message, 'close');
        return err.error.message;
      }
      if (err.error.statusCode == 401) {
        this.router.navigate(['/login']);
      } else {
        return err;
      }
      return of(result as T);
    };
  }
  guestAuthGetapi(url: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getGuestAuthApiData(url).subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  guestpost(url: string, pbody: any): Observable<any> {
    url = environment?.baseUrl + url;
    return this.http.post(url, pbody).pipe(map((res) => res));
  }

  postGuestAuthApiData(url: string, body: any): Observable<any> {
    this.authorization = sessionStorage.getItem('tokenA')
      ? sessionStorage.getItem('tokenA')
      : '';
    this.userId = localStorage.getItem('useridA')
      ? JSON.parse(localStorage.getItem('useridA') || '')
      : '';
    console.log(this.authorization);
    url = environment?.baseUrl + url;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authorization,
        userId: this.userId,
      },
    };
    return this.http.post<any>(url, body, options).pipe(
      tap((_) => console.log('test')),
      catchError(this.handleError('err', []))
    );
  }

  putGuestAuthApiData(url: string, body: any): Observable<any> {
    this.authorization = sessionStorage.getItem('tokenA')
      ? sessionStorage.getItem('tokenA')
      : '';
    this.userId = localStorage.getItem('useridA')
      ? JSON.parse(localStorage.getItem('useridA') || '')
      : '';
    console.log(this.authorization);
    url = environment?.baseUrl + url;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authorization,
        userId: this.userId,
      },
    };
    return this.http.put<any>(url, body, options).pipe(
      tap((_) => console.log('test')),
      catchError(this.handleError('err', []))
    );
  }

  deleteGuestAuthApiData(url: string): Observable<any> {
    this.authorization = sessionStorage.getItem('tokenA')
      ? sessionStorage.getItem('tokenA')
      : '';
    this.userId = localStorage.getItem('useridA')
      ? JSON.parse(localStorage.getItem('useridA') || '')
      : '';
    console.log(this.authorization);
    url = environment?.baseUrl + url;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authorization,
        userId: this.userId,
      },
    };

    return this.http.delete<any>(url, options).pipe(
      tap((_) => console.log('test')),
      catchError(this.handleError('err', []))
    );
  }
}
