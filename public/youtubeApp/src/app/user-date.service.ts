import { Credientials } from './login/login.component';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class UserDateService {
  baseUrl: string = environment.REST_BASE_API;
  constructor(private http: HttpClient) {}
  public resgiter(user: Credientials): Observable<Credientials> {
    return this.http.post<Credientials>(this.baseUrl + '/users', user.json());
  }

  public login(user: Credientials): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/users', user.json());
  }
}
