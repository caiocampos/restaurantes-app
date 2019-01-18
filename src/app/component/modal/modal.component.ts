import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalButton } from 'src/app/model/service/modal-button';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() titulo;
  @Input() mensagem;
  @Input() detalhe;
  @Input() fechar;
  @Input() botoes: ModalButton[];

  public isCollapsed = true;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
