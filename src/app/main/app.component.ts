import { Component } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/finally';
import { Config } from '../config';
import { EntityInfoAcess } from '../model/entityInfo/entityInfoAcess';

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
    this.http.post(Config.server + 'logout', {}).finally(() => {
      this.app.invalidateSession();
      this.router.navigateByUrl('/login');
    }).subscribe();
  }

  get entities() {
    return Config.entities;
  }

  get authenticated() {
    return this.app.authenticated;
  }

  get nomeUsuario() {
    return (Config.user.nome || 'Ninja') + (Config.user.sobrenome != null ? (' ' + Config.user.sobrenome) : '');
  }

  canAcess(userAcess: EntityInfoAcess) {
    const roles = Config.user.roles;
    if (roles == null) {
      return false;
    } else if (roles.includes('admin')) {
      return true;
    } else if (roles.includes('user')) {
      return userAcess.read;
    }
    return false;
  }
}
