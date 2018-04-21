import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Config } from '../config';
import { User } from '../model/user';
import { EntityInfo } from '../model/entityInfo/entityInfo';
import { ModalService } from '../modal/modal.service';

@Injectable()
export class AppService {
  authenticated = false;
  constructor(private http: HttpClient, private modal: ModalService) {
  }
  authenticate(credentials, callback) {
    const headers = new HttpHeaders(credentials ? {
      'content-type': 'application/x-www-form-urlencoded'
    } : {});
    const params = new HttpParams()
      .set('username', credentials['username'])
      .set('password', credentials['password']);
    this.http.post(Config.server + 'login', params.toString(), { headers: headers }).subscribe(response => {
      Config.user = Object.setPrototypeOf(response, User);
      this.authenticated = true;
      if (callback) { callback(); }
    }, () => {
      this.invalidateSession();
      this.modal.open('Erro!', 'Não foi possível acessar');
    });
  }
  invalidateSession() {
    this.authenticated = false;
    Config.user = new User();
  }
  setEntities() {
    const headers = new HttpHeaders({
      'content-type': 'application/json'
    });
    this.http.post(Config.server + 'entity/list', {}, { headers: headers }).subscribe(response => {
      Config.entities = Object.setPrototypeOf(response, Array<EntityInfo>());
    }, () => {
      Config.entities = [];
    });
  }
}
