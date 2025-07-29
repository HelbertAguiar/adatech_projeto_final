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
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  contatos = this.agendaService.contatos;
  filtro = signal('');
  pageSize = signal(15);
  currentPage = signal(0);

  contatosFiltradosPaginados = computed(() => {
    const all = this.contatos()
      .filter((c) => c.nome.toLowerCase().includes(this.filtro().toLowerCase()))
      .sort((a, b) => a.nome.localeCompare(b.nome));

    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    return all.slice(start, end);
  });

  get totalFiltrados(): number {
    return this.contatos().filter((c) =>
      c.nome.toLowerCase().includes(this.filtro().toLowerCase())
    ).length;
  }

  

  onExcluirContato(id: string): void {
    this.agendaService.deleteContato(id).subscribe(() => {
      this.toast.success('Contato excluído com sucesso!', 'Parabéns', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'decreasing',
      });
      this.agendaService.refreshDados();
    });
  }

  onEditarContato(contato: Contato): void {
    const ref = this.dialogService.open(AgendaForm, {
      data: { contato, isEdicao: true },
    });

    ref.afterClosed().subscribe(() => {
      this.agendaService.refreshDados();
    });
  }

  abrirModalAdd(): void {
    const ref = this.dialogService.open(AgendaForm, {
      data: { isEdicao: false },
    });

    ref.afterClosed().subscribe(() => {
      this.agendaService.refreshDados();
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
