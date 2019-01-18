import { Component } from '@angular/core';
import { Config } from '../../static/config';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-login',
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
