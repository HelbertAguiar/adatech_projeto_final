import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ContatoResponse } from '../../interfaces/agenda.interfaces';
import { AgendaService } from '../../services/agenda-service';

@Component({
  selector: 'app-agenda-container',
  standalone: false,
  templateUrl: './agenda-container.html',
  styleUrl: './agenda-container.scss',
})
export class AgendaContainer {
  private readonly agendaService = inject(AgendaService);

  @ViewChild('form') form!: ElementRef<HTMLDivElement>;

  contatos = this.agendaService.contatos;
  contatoParaEditarSignal = signal<ContatoResponse | null>(null);

  resetarForm = signal<boolean>(false);
  editMode = signal<boolean>(false);

  filtro = signal('');
  contatosFiltrados = computed(() =>
    this.contatos().filter((c) =>
      c.nome.toLowerCase().includes(this.filtro().toLowerCase())
    )
  );

  onAdicionarContato(novoContato: ContatoResponse) {
    this.agendaService.addContato(novoContato).subscribe({
      next: (_) => {
        this.agendaService.refreshDados();
        this.resetarForm.set(true);
        setTimeout(() => {
          this.resetarForm.set(false);
        }, 200);
      },
    });
  }

  onExcluirContato(id: string) {
    this.agendaService.deleteContato(id).subscribe({
      next: (_) => this.agendaService.refreshDados(),
    });
  }

  onEditarContato(contato: ContatoResponse) {
    this.contatoParaEditarSignal.set(contato);

    setTimeout(() => {
      this.form.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }

  onConfirmarEdicao(contato: ContatoResponse) {
    this.agendaService.updateContato(contato).subscribe({
      next: (_) => {
        this.contatoParaEditarSignal.set(null);
        this.agendaService.refreshDados();
      },
    });
  }

  onCancelarEdicao() {
    this.contatoParaEditarSignal.set(null);
  }
}
