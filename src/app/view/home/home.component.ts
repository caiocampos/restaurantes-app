import { Component } from '@angular/core';
import { AppService } from '../../main/app.service';
import { Config } from '../../config';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(private app: AppService) {
  }

  get authenticated() {
    return this.app.authenticated;
  }

  get nomeUsuario() {
    return Config.user.nome + ' ' + Config.user.sobrenome;
  }
}
