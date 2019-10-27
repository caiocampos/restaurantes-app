import { Component } from '@angular/core';

import { AppService } from 'src/app/service/app.service';
import { Config } from '../../static/config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private app: AppService) {
  }

  get authenticated(): boolean {
    return this.app.authenticated;
  }

  get onGithub(): boolean {
    return Config.location === Config.Location.GitHub;
  }

  get nomeUsuario(): string {
    return Config.user.nome + ' ' + Config.user.sobrenome;
  }
}
