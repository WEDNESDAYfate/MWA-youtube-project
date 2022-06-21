import { AuthenticationService } from './../authentication.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Credientials } from '../login/login.component';
import { UserDateService } from '../user-date.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  errorMessage: String = '';
  successMessage: string = '';
  haveSuccess: boolean = false;
  haveError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UserDateService,
    private authService: AuthenticationService
  ) {
    this.registerForm = formBuilder.group({
      name: '',
      username: '',
      password: '',
      repeatPassword: '',
    });
  }

  singUp(): void {
    const newUser: Credientials = new Credientials();
    newUser.fillFromFormGroup(this.registerForm);

    this.usersService.resgiter(newUser).subscribe({
      next: (registeredUser) => {
        this.successMessage = 'User registered successfully';
        this.haveSuccess = true;
        this.haveError = false;
      },
      error: (error) => {
        this.errorMessage = 'Error registered successfully';
        this.haveSuccess = false;
        this.haveError = true;
      },
      complete: () => {},
    });
  }
  ngOnInit(): void {}
}
