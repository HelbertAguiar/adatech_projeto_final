import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Contato, ContatoResponse } from '../interfaces/agenda.interfaces';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  private httpClient = inject(HttpClient);

  private readonly urlApi = 'http://localhost:3000';

  private _contatos = signal<ContatoResponse[] | null>(null);
  public contatos = this._contatos.asReadonly();

  constructor(private toastr: ToastrService) {
    this.refreshDados();
  }

  private getContatos(): Observable<ContatoResponse[]> {
    return this.httpClient
      .get<ContatoResponse[]>(`${this.urlApi}/contatos`)
      .pipe(tap((res) => this._contatos.set(res)));
  }

  public refreshDados() {
    this.getContatos().subscribe();
  }

  public addContato(novoContato: Contato): Observable<Contato> {

    const status_add = this.httpClient.post<Contato>(
      `${this.urlApi}/contatos`,
      novoContato
    );

    if (status_add) {
      this.toastr.success('Contato adicionado com sucesso!', 'Parabéns', {
        timeOut: 3000, progressBar: true, progressAnimation: "decreasing"
      });
    } else {
      this.toastr.error('Não foi possivel incluir tarefa. Tente mais tarde!', 'Atenção', {
        timeOut: 3000, progressBar: true, progressAnimation: "decreasing"
      });
    }
    return status_add;
  }
}
