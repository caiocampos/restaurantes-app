import { Component, OnInit } from '@angular/core';
import { AppService } from '../../main/app.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Config } from '../../config';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {

  credentials = { username: '', password: '' };

  constructor(private app: AppService, private http: HttpClient, private router: Router) {
  }

  login() {
    this.app.authenticate(this.credentials, () => {
      this.router.navigateByUrl('/');
    });
    return false;
  }
  titulo() { return Config.title; }

}
