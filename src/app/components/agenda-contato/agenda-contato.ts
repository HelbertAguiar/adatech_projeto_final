import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contato, ContatoResponse } from '../../interfaces/agenda.interfaces';

@Component({
  selector: 'app-agenda-contato',
  standalone: false,
  templateUrl: './agenda-contato.html',
  styleUrl: './agenda-contato.scss',
})
export class AgendaContato {
  @Input({ required: true }) contato!: ContatoResponse;
  @Output() excluirContato = new EventEmitter<string>();
  @Output() editarContato = new EventEmitter<ContatoResponse>();
}
