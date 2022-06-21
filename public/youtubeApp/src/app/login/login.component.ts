import { Router } from '@angular/router';
import { AuthenticationService } from './../authentication.service';
import { UserDateService } from './../user-date.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { createDecipheriv } from 'crypto';
import { response } from 'express';
import { HttpErrorResponse } from '@angular/common/http';
export class Credientials {
  #name!: String;
  #username!: String;
  #password!: String;

  get name() {
    return this.#name;
  }
  get username() {
    return this.#username;
  }
  get password() {
    return this.#password;
  }
  fillFromFormGroup(form: FormGroup) {
    this.#name = form.value.name;
    this.#username = form.value.username;
    this.#password = form.value.password;
  }

  json(): any {
    return {
      name: this.name,
      username: this.username,
      password: this.password,
    };
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage!: String;
  haveError: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserDateService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loginForm = formBuilder.group({
      username: '',
      password: '',
    });
  }

  ngOnInit(): void {}

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }
  login(): void {
    this.haveError = false;
    let credientials: Credientials = new Credientials();
    credientials.fillFromFormGroup(this.loginForm);

    this.userService.login(credientials).subscribe({
      next: (response) => {
        this.authService.token = response.token;
        this.authService.isLoggedIn = true;
        this.router.navigate(['']);
      },

      error: (error) => {
        this.errorMessage = error.message;
        this.haveError = true;
      },
      complete: () => {},
    });
  }
}
