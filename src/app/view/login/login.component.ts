import { Component } from '@angular/core';
import { AppService } from '../../main/app.service';
import { Config } from '../../config';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(private app: AppService) {
  }

  login() {
    this.app.authenticate(this.credentials, () => {
      this.app.navigateTo('/');
    });
    return false;
  }

  get titulo() {
    return Config.title;
  }
}
