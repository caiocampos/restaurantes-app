import {
  HttpErrorResponse,
  HttpParams,
  HttpHeaders,
  HttpClient,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { retry, finalize } from "rxjs/operators";
import { ModalStructure } from "../model/service/modal-structure";
import { Config } from "../static/config";
import { User } from "../model/user";
import { ModalService } from "./modal/modal.service";
import { MOCK_ENTITIES } from "../mock/mock-entities";
import { EntityInfo } from "../model/entityInfo/entity-info";
import { CrudRequest } from "../model/service/crud-request";

@Injectable({
  providedIn: "root",
})
export class AppService {
  authenticated = false;

  headers = {
    headers: new HttpHeaders({
      "content-type": "application/json",
    }),
    withCredentials: true,
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private modal: ModalService
  ) {}

  navigateTo(route) {
    this.router.navigateByUrl(route);
  }

  authenticate(credentials, callback) {
    const headers = new HttpHeaders(
      credentials
        ? {
            "content-type": "application/x-www-form-urlencoded",
          }
        : {}
    );

    const params = new HttpParams()
      .set("username", credentials["username"])
      .set("password", credentials["password"]);

    this.http
      .post<User>(Config.server + "login", params.toString(), {
        headers: headers,
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          Config.user = response;
          this.authenticated = true;
          if (callback) {
            callback();
          }
        },
        error: (err) => {
          this.invalidateSession();
          this.openModalDetail(
            "Erro!",
            "Não foi possível acessar o Sistema!",
            err
          );
        },
      });
  }

  logout() {
    this.http.post(Config.server + "logout", {}).pipe(
      retry(1),
      finalize(() => {
        this.invalidateSession();
        this.navigateTo("/login");
      })
    );
  }

  invalidateSession() {
    this.authenticated = false;
    Config.user = new User();
  }

  setEntities() {
    this.http
      .get<Array<EntityInfo>>(Config.server + "entity/list")
      .pipe(retry(5))
      .subscribe({
        next: (response) => {
          Config.entities = response;
        },
        error: (err) => {
          if (
            Config.location === Config.Location.GitHub ||
            Config.location === Config.Location.Local
          ) {
            Config.entities = MOCK_ENTITIES;
            this.authenticateAsTest();
            this.navigateTo("/");
            this.openSimpleModal(
              "Servidor não inicializado",
              "Serão utilizados dados de teste somente para visualização!"
            );
          } else {
            Config.entities = [];
            this.openModalDetail(
              "Erro!",
              "Não foi possível carregar as telas do Sistema!",
              err
            );
          }
        },
      });
  }

  private authenticateAsTest() {
    Config.user = {
      username: "test",
      roles: ["user"],
      nome: "Test",
      sobrenome: "Test",
      enabled: true,
    };
    this.authenticated = true;
  }

  request(
    action,
    req: CrudRequest,
    callback?: (value: any) => void,
    errorCallback?: (error: any) => void
  ) {
    return this.http
      .post(Config.server + action, req, this.headers)
      .subscribe({ next: callback, error: errorCallback });
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
