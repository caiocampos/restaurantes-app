import { Component, OnInit } from '@angular/core';
import { AppService } from '../../service/app.service';
import { Config } from 'src/app/static/config';
import { EntityInfoAccess } from 'src/app/model/entityInfo/entity-info-access';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private app: AppService) {
  }

  ngOnInit(): void {
    this.app.setEntities();
  }

  logout() {
    this.app.logout();
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

  canAcess(userAcess: EntityInfoAccess) {
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
