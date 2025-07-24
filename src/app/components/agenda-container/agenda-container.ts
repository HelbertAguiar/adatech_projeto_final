import { Component, inject, signal } from '@angular/core';
import { Contato } from '../../interfaces/agenda.interfaces';
import { AgendaService } from '../../services/agenda-service';

@Component({
  selector: 'app-agenda-container',
  standalone: false,
  templateUrl: './agenda-container.html',
  styleUrl: './agenda-container.scss',
})
export class AgendaContainer {
  private readonly agendaService = inject(AgendaService);

  contatos = this.agendaService.contatos;
  resetarForm = signal<boolean>(false);

  onAdicionarContato(novoContato: Contato) {
    this.agendaService.addContato(novoContato).subscribe({
      next: (_) => {
        this.agendaService.refreshDados();
        this.resetarForm.set(true);
        console.log(this.resetarForm());
        setTimeout(() => {
          this.resetarForm.set(false);
          console.log(this.resetarForm());
        }, 200);
        console.log(this.resetarForm());
      },
    });
  }
}
