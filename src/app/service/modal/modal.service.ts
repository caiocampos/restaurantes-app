import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/component/modal/modal.component';
import { ModalStructure } from 'src/app/model/service/modal-structure';
import { ModalButton } from 'src/app/model/service/modal-button';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalService: NgbModal) { }

  open(title: string, message: string, detail?: string, close?: string, buttons?: ModalButton[]) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });

    modalRef.componentInstance.titulo = title || '';
    modalRef.componentInstance.mensagem = message || '';
    modalRef.componentInstance.detalhe = detail;
    modalRef.componentInstance.fechar = close || 'Fechar';
    modalRef.componentInstance.botoes = buttons || [];
  }

  openFromStructure(structure: ModalStructure) {
    this.open(
      structure.title,
      structure.message,
      structure.detail,
      structure.close,
      structure.buttons
    );
  }
}
