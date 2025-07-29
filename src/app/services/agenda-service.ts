import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Contato } from '../interfaces/agenda.interfaces';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  private httpClient = inject(HttpClient);

  private readonly urlApi = 'http://localhost:3000/contatos';

  private _contatos = signal<Contato[]>([]);
  public contatos = this._contatos.asReadonly();

  constructor(private toastr: ToastrService) {
    this.refreshDados();
  }

  private getContatos(): Observable<Contato[]> {
    return this.httpClient
      .get<Contato[]>(`${this.urlApi}`)
      .pipe(tap((res) => this._contatos.set(res)));
  }

  public refreshDados() {
    this.getContatos().subscribe();
  }

  public addContato(novoContato: Contato): Observable<Contato> {
    return this.httpClient.post<Contato>(`${this.urlApi}`, novoContato);
  }

  public deleteContato(id: string) {
    return this.httpClient.delete(`${this.urlApi}/${id}`);
  }

  public updateContato(contatoAEditar: Contato) {
    return this.httpClient
      .put<Contato>(`${this.urlApi}/${contatoAEditar.id}`, contatoAEditar)
      .pipe(
        tap((contatoAEditar) => {
          const next = this._contatos()?.map((contato) =>
            contato.id === contatoAEditar.id ? contatoAEditar : contato
          );
          this._contatos.set(next);
        })
      );
  }
}
