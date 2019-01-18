import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Config } from '../config';
import { User } from '../model/user';
import { EntityInfo } from '../model/entityInfo/entityInfo';
import { ModalService, ModalStructure } from '../modal/modal.service';
import { CRUDRequest } from '../model/service/crudRequest';
import { retry } from 'rxjs/operators';
import { ENTITIES } from '../mock/mock-entities';

@Injectable({ providedIn: 'root' })
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
    }, err => {
      this.invalidateSession();
      this.openModalDetail('Erro!', 'Não foi possível acessar o Sistema!', err);
    });
  }

  invalidateSession() {
    this.authenticated = false;
    Config.user = new User();
  }

  setEntities() {
    this.http.post(Config.server + 'entity/list', {}, this.headers).pipe(
      retry(1),
    ).subscribe(response => {
      Config.entities = Object.setPrototypeOf(response, Array<EntityInfo>());
    }, err => {
      if (window.location.href.includes('github') || window.location.href.includes('localhost')) {
        this.authenticateAsTest();
        Config.entities = ENTITIES;
        this.openSimpleModal('Servidor não encontado', 'Serão utilizados dados de teste somente para visualização!');
      } else {
        Config.entities = [];
        this.openModalDetail('Erro!', 'Não foi possível carregar as telas do Sistema!', err);
      }
    });
  }

  private authenticateAsTest() {
    Config.user = {
      username: 'test',
      roles: ['user'],
      nome: 'Test',
      sobrenome: 'Test',
      enabled: true
    };
    this.authenticated = true;
  }

  request(action, req: CRUDRequest, callback, errorCallback?) {
    return this.http.post(Config.server + action, req, this.headers).subscribe(callback, errorCallback);
  }

  openSimpleModal(title, message, close?, buttons?) {
    return this.openModalDetail(title, message, undefined, close, buttons);
  }

  openModalDetail(title, message, detail, close?, buttons?) {
    if (detail instanceof HttpErrorResponse) {
      detail = `
      <b>Mensagem:</b> ${detail.message}<br>
      <b>Estado:</b> ${detail.status} - ${detail.statusText}<br><br>
      <b>Detalhamento:</b> ${JSON.stringify(detail)}`;
    } else if (detail instanceof Object) {
      detail = JSON.stringify(detail);
    }
    return this.modal.open(title, message, detail, close, buttons);
  }

  openModal(structure: ModalStructure) {
    return this.modal.openFromStructure(structure);
  }
}
