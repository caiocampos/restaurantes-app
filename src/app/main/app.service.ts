import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Config } from '../config';
import { User } from '../model/user';
import { EntityInfo } from '../model/entityInfo/entityInfo';
import { ModalService } from '../modal/modal.service';
import { CRUDRequest } from '../model/service/crudRequest';

@Injectable()
export class AppService {
  authenticated = false;

  headers = {
    headers: new HttpHeaders({
      'content-type': 'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient, private modal: ModalService) {
  }

  authenticate(credentials, callback) {
    const headers = new HttpHeaders(credentials ? {
      'content-type': 'application/x-www-form-urlencoded'
    } : {});

    const params = new HttpParams()
      .set('username', credentials['username'])
      .set('password', credentials['password']);

    this.http.post(Config.server + 'login', params.toString(), { headers: headers, withCredentials: true }).subscribe(response => {
      Config.user = Object.setPrototypeOf(response, User);
      this.authenticated = true;
      if (callback) { callback(); }
    }, () => {
      this.invalidateSession();
      this.openModal('Erro!', 'Não foi possível acessar o Sistema!');
    });
  }

  invalidateSession() {
    this.authenticated = false;
    Config.user = new User();
  }

  setEntities() {
    this.http.post(Config.server + 'entity/list', {}, this.headers).subscribe(response => {
      Config.entities = Object.setPrototypeOf(response, Array<EntityInfo>());
    }, () => {
      Config.entities = [];
      this.openModal('Erro!', 'Não foi possível carregar as telas do Sistema!');
    });
  }

  request(action, req: CRUDRequest, callback, errorCallback?) {
    return this.http.post(Config.server + action, req, this.headers).subscribe(callback, errorCallback);
  }

  openModal(title, message, close?, buttons?) {
    return this.modal.open(title, message, close, buttons);
  }
}
