import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {}
  onHome(): void {
    this.router.navigate(['']);
  }
  onChannel(): void {
    this.router.navigate(['channel']);
  }
  onAdd(): void {
    this.router.navigate(['add']);
  }
  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }
  get name() {
    return this.authService.name;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
