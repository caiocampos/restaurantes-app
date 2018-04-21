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
  dataId = '';
  formMode = false;

  constructor(private app: AppService, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.formMode = false;
    if (this.app.authenticated) {
      this.route.params.subscribe(params => {
        this.entityInfo = Config.entities.find((element) => element.entity.toLocaleLowerCase() === params['nome']);

        const req = new CRUDRequest();
        req.entity = this.entityInfo.entity;
        this.app.request('findall', req, (response) => {
          this.records = response;
        }, (err) => {
          this.records = [];
        });
      });
    } else {
      this.router.navigateByUrl('/');
    }
  }

  getValue(record, field: EntityInfoField) {
    if (field.name === 'password') {
      return '************';
    } else if (field.type === 'TOGGLE') {
      return record[field.name] ? 'Sim' : 'Não';
    } else if (field.type === 'FOREIGN') {
      if (field.options !== undefined && field.options[0] !== undefined) {
        return record[field.options[0]];
      } else if (record[field.name]['nome'] !== undefined) {
        return record[field.name]['nome'];
      }
    }
    return record[field.name];
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
    this.dataId = record['id'];
  }

  return() {
    this.formMode = false;
    this.dataId = '';
  }
}
