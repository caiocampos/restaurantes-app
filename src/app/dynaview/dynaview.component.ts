import { Component, OnInit } from '@angular/core';
import { AppService } from '../main/app.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { EntityInfo } from '../model/entityInfo/entityInfo';
import { Config } from '../config';
import { CRUDRequest } from '../model/service/crudRequest';
import { EntityInfoField } from '../model/entityInfo/EntityInfoField';
import { Form, NgForm } from '@angular/forms';

@Component({
  templateUrl: './dynaview.component.html',
  styleUrls: ['./dynaview.component.css']
})
export class DynaviewComponent implements OnInit {
  entityInfo: EntityInfo = new EntityInfo();
  records = [];
  data = {};
  formMode = false;

  constructor(private app: AppService, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.return();
    if (this.app.authenticated) {
      this.route.params.subscribe(params => {
        this.return();
        this.entityInfo = Config.entities.find(element => element.entity.toLocaleLowerCase() === params['nome']);

        const req = new CRUDRequest();
        req.entity = this.entityInfo.entity;
        this.app.request('findall', req, response => {
          this.records = response;
        }, err => {
          this.return();
          this.records = [];
        });
      });
    } else {
      this.router.navigateByUrl('/');
    }
  }

  getValue(record, field: EntityInfoField, edit?) {
    if (record[field.name] == null) {
      return '';
    } else if (field.name === 'password' && !edit) {
      return '************';
    } else if (field.type === 'TOGGLE') {
      return record[field.name] ? 'Sim' : 'Não';
    } else if (field.type === 'FOREIGN') {
      if (field.fk != null && field.fk.param != null) {
        return record[field.name][field.fk.param];
      } else {
        return '';
      }
    }
    return record[field.name];
  }

  getType(field: EntityInfoField) {
    switch (field.type) {
      case 'PHONE': return 'tel';
      case 'NUMBER': return 'number';
      case 'VALUE': return 'number';
      case 'TOGGLE': return 'checkbox';
      case 'PASS': return 'password';
      default: return 'text';
    }
  }

  searh(busca) {
    const req = new CRUDRequest();
    req.entity = this.entityInfo.entity;
    req.param = [busca];
    this.app.request('findnome', req, response => {
      this.records = response;
    }, err => {
      this.records = [];
    });
  }

  newRecord() {
    this.formMode = true;
  }

  edit(record, form) {
    const data = Object.assign({}, record);
    this.entityInfo.fields.forEach(field => {
      if (field.type === 'FOREIGN') {
        data[field.name] = this.getValue(record, field, true);
      }
    });
    this.formMode = true;
    this.data = data;
  }

  save(form: NgForm) {
    const req = new CRUDRequest();
    req.entity = this.entityInfo.entity;
    req.data = Object.assign({}, this.data);
    const fk = this.entityInfo.fields.filter(field => {
      return field.type === 'FOREIGN';
    });
    if (fk.length > 0) {
      for (let i = 0; i < fk.length; i++) {
        const field = fk[i];
        if (this.data[field.name] == null || this.data[field.name] === '') {
          req.data[field.name] = null;
        } else {
          const fkReq = new CRUDRequest();
          fkReq.entity = field.fk.entity;
          fkReq.special = field.fk.search;
          fkReq.param = [this.data[field.name]];
          this.app.request('findspecial', fkReq, response => {
            req.data[field.name] = response != null ? (response[0] != null ? response[0] : null) : null;
          }, err => {
            req.data[field.name] = null;
          });
        }
      }
      const wait = 1 +
        (fk.length > 1 ? 1 : 0) +
        (fk.length > 3 ? 1 : 0) +
        (fk.length > 5 ? 1 : 0) +
        (fk.length > 10 ? 1 : 0) +
        (fk.length > 30 ? 1 : 0) +
        (fk.length > 50 ? 1 : 0) +
        (fk.length > 100 ? 1 : 0);
      setTimeout(() => {
        this.saveRequest(req);
      }, 100 * wait);
    } else {
      this.saveRequest(req);
    }
  }

  private saveRequest(req) {
    this.app.request('save', req, response => {
      this.records = this.records.filter(record => {
        return record['id'] !== response['id'];
      });
      this.records.push(response);
      this.return();
      this.app.openModal('Sucesso!', 'Dados gravados!');
    }, err => {
      this.app.openModal('Erro!', 'Não foi possível gravar os dados!');
    });

  }

  delete(id) {
    const req = new CRUDRequest();
    req.entity = this.entityInfo.entity;
    req.id = id;
    this.app.request('delete', req, response => {
      this.records = this.records.filter(record => {
        return record['id'] !== response['id'];
      });
      this.return();
      this.app.openModal('Sucesso!', 'Dados apagados!');
    }, err => {
      this.app.openModal('Erro!', 'Não foi possível apagar os dados!');
    });
  }

  return() {
    this.formMode = false;
    this.data = {};
  }
}
