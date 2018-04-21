import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable, Input, Component } from '@angular/core';

export class ModalButtons {
  name: string;
  callback: Function;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() titulo;
  @Input() mensagem;
  @Input() fechar;
  @Input() botoes: ModalButtons[];

  constructor(public activeModal: NgbActiveModal) { }
}


@Injectable()
export class ModalService {
  constructor(private modalService: NgbModal) { }

  open(title, message, close?, buttons?) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });

    modalRef.componentInstance.titulo = title || '';
    modalRef.componentInstance.mensagem = message || '';
    modalRef.componentInstance.fechar =  close || 'Fechar';
    modalRef.componentInstance.botoes =  buttons || [];
  }
}
