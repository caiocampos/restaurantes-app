import { Component } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/finally';
import { Config } from '../config';
import { AppHelper } from '../app.helper';
import { EntityInfo } from '../model/entityInfo/entityInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private app: AppService, private http: HttpClient, private router: Router) {
    this.app.setEntities();
  }
  logout() {
    this.http.post('logout', {}).finally(() => {
      this.app.authenticated = false;
      this.router.navigateByUrl('/login');
    }).subscribe();
  }

  get entities() { return Config.entities; }
  get authenticated() { return this.app.authenticated; }
  get nomeUsuario() { return (Config.user.nome || 'Ninja') + (Config.user.sobrenome !== undefined ? (' ' + Config.user.sobrenome) : ''); }

  parseLink(title) {
    return AppHelper.parseToLowerNormalized(title);
  }
}
