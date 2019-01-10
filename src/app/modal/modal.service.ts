import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable, Input, Component } from '@angular/core';

export class ModalButtons {
  name: string;
  callback: Function;
}

export class ModalStructure {
  title: string;
  message: string;
  detail: string;
  close: string;
  buttons: ModalButtons[];
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() titulo;
  @Input() mensagem;
  @Input() detalhe;
  @Input() fechar;
  @Input() botoes: ModalButtons[];

  public isCollapsed = true;

  constructor(public activeModal: NgbActiveModal) { }
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(private modalService: NgbModal) { }

  open(title: string, message: string, detail?: string, close?: string, buttons?: ModalButtons[]) {
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
