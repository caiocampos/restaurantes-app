import { Component, OnInit } from '@angular/core';
import { AppService } from '../main/app.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { EntityInfo } from '../model/entityInfo/entityInfo';
import { Config } from '../config';
import { CRUDRequest } from '../model/service/crudRequest';
import { EntityInfoField } from '../model/entityInfo/EntityInfoField';

@Component({
  templateUrl: './dynaview.component.html',
  styleUrls: ['./dynaview.component.css']
})
export class DynaviewComponent implements OnInit {
  entityInfo: EntityInfo = new EntityInfo();
  records = [];
  data = null;
  formMode = false;

  constructor(private app: AppService, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.return();
    if (this.app.authenticated) {
      this.route.params.subscribe(params => {
        this.return();
        this.entityInfo = Config.entities.find((element) => element.entity.toLocaleLowerCase() === params['nome']);

        const req = new CRUDRequest();
        req.entity = this.entityInfo.entity;
        this.app.request('findall', req, (response) => {
          this.records = response;
        }, (err) => {
          this.return();
          this.records = [];
        });
      });
    } else {
      this.router.navigateByUrl('/');
    }
  }

  getValue(record, field: EntityInfoField, form?: boolean) {
    if (record[field.name] == null) {
      return '';
    } else if (field.name === 'password' && !form) {
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
      case 'PHONE' : return 'tel';
      case 'NUMBER' : return 'number';
      case 'VALUE' : return 'number';
      case 'TOGGLE' : return 'checkbox';
      case 'PASS' : return 'password';
      default: return 'text';
    }
  }

  searh(busca) {
    const req = new CRUDRequest();
    req.entity = this.entityInfo.entity;
    req.param = [busca];
    this.app.request('findnome', req, (response) => {
      this.records = response;
    }, (err) => {
      this.records = [];
    });
  }

  newRecord() {
    this.formMode = true;
  }

  edit(record) {
    this.formMode = true;
    this.data = record;
  }

  save() {
    this.return();
  }

  return() {
    this.formMode = false;
    this.data = null;
  }
}
