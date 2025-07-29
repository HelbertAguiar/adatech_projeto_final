import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Contato } from '../../interfaces/agenda.interfaces';
import { AgendaService } from '../../services/agenda-service';
import { MatDialog } from '@angular/material/dialog';
import { AgendaForm } from '../agenda-form/agenda-form';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agenda-container',
  standalone: false,
  templateUrl: './agenda-container.html',
  styleUrl: './agenda-container.scss',
})
export class AgendaContainer {
  private readonly agendaService = inject(AgendaService);
  private readonly dialogService = inject(MatDialog);
  private readonly toast = inject(ToastrService);

  @ViewChild('form') form!: ElementRef<HTMLDivElement>;

  contatos = this.agendaService.contatos;
  contatoParaEditarSignal = signal<Contato | null>(null);

  resetarForm = signal<boolean>(false);
  editMode = signal<boolean>(false);

  filtro = signal('');
  contatosFiltrados = computed(() =>
    this.contatos()
      .filter((c) => c.nome.toLowerCase().includes(this.filtro().toLowerCase()))
      .sort((a, b) => a.nome.localeCompare(b.nome))
  );

  onExcluirContato(id: string) {
    this.agendaService.deleteContato(id).subscribe(() => {
      this.toast.success('Contato excluido com sucesso!', 'Parabéns', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'decreasing',
      });
      this.agendaService.refreshDados();
    });
  }

  onEditarContato(contato: Contato) {
    const ref = this.dialogService.open(AgendaForm, {
      data: { contato: contato, isEdicao: true },
    });
    ref.afterClosed().subscribe(() => {
      this.agendaService.refreshDados();
    });
  }

  onCancelarEdicao() {
    this.contatoParaEditarSignal.set(null);
  }

  abrirModalAdd(): void {
    const ref = this.dialogService.open(AgendaForm, {
      data: { isEdicao: false },
    });
    ref.afterClosed().subscribe(() => {
      this.agendaService.refreshDados();
    });
  }
}
