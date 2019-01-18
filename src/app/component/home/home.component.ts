import { Component } from '@angular/core';
import { Config } from '../../static/config';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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
