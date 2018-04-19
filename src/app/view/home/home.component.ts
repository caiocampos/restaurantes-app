import { Component, OnInit } from '@angular/core';
import { AppService } from '../../main/app.service';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../config';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {

  constructor(private app: AppService, private http: HttpClient) {
  }

  authenticated() { return this.app.authenticated; }
  nomeUsuario() { return Config.user['nome'] + ' ' + Config.user['sobrenome']; }

}
