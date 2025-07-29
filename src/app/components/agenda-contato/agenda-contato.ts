import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contato } from '../../interfaces/agenda.interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-agenda-contato',
  standalone: false,
  templateUrl: './agenda-contato.html',
  styleUrl: './agenda-contato.scss',
})
export class AgendaContato {
  @Input({ required: true }) contato!: Contato;
  @Output() excluirContato = new EventEmitter<string>();
  @Output() editarContato = new EventEmitter<Contato>();

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'whatsapp',
      sanitizer.bypassSecurityTrustResourceUrl('images/whatsapp.svg')
    );
  }
}
