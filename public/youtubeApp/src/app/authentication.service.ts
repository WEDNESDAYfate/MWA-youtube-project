import { environment } from '../environments/environment.dev';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  #isLoggedIn: boolean = false;

  constructor(private jwtService: JwtHelperService) {}
  get isLoggedIn() {
    if (this.token) {
      this.isLoggedIn = true;
    }
    return this.#isLoggedIn;
  }
  set isLoggedIn(isLoggedIn: boolean) {
    this.#isLoggedIn = isLoggedIn;
  }

  get token(): any {
    return localStorage.getItem(environment.token_storage_key);
  }
  set token(token) {
    localStorage.setItem(environment.token_storage_key, token);
    this.#isLoggedIn = true;
  }
  get name(): string {
    let name: string = 'unknown';
    if (this.token) {
      name = this.jwtService.decodeToken(this.token).name;
    }
    return name;
  }
  logout(): void {
    localStorage.clear();
    this.isLoggedIn = false;
  }
}
