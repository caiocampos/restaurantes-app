import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Config } from '../config';
import { EntityInfoAcess } from '../model/entityInfo/entityInfoAcess';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private app: AppService, private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.app.setEntities();
  }

  logout() {
    this.http.post(Config.server + 'logout', {})
      .pipe(
        finalize(() => {
          this.app.invalidateSession();
          this.router.navigateByUrl('/login');
        })
      ).subscribe();
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
