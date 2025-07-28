import {
  Component,
  effect,
  EventEmitter,
  Input,
  Output,
  Signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contato } from '../../interfaces/agenda.interfaces';

@Component({
  selector: 'app-agenda-form',
  standalone: false,
  templateUrl: './agenda-form.html',
  styleUrl: './agenda-form.scss',
})
export class AgendaForm {
  @Input() resetarForm = false;
  @Input() contatoSignal!: Signal<Contato | null>;

  @Output() criarContato = new EventEmitter<Contato>();
  @Output() confirmarEdicao = new EventEmitter<Contato>();
  @Output() cancelarEdicao = new EventEmitter<void>();

  contatoForm = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    telefone: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.pattern(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/)
      ]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.email
      ]
    }),
  });

  constructor() {
    effect(() => {
      const tarefa = this.contatoSignal();

      if (tarefa) {
        // Corrige campos null para string vazia
        this.contatoForm.patchValue({
          nome: tarefa.nome ?? '',
          telefone: tarefa.telefone ?? '',
          email: tarefa.email ?? ''
        });
      } else {
        this.contatoForm.reset();

      }
    });
  }

  adicionarContato() {
    if (this.contatoForm.invalid) return;
    const novoContato = {
      nome: this.contatoForm.controls.nome.value,
      telefone: this.contatoForm.controls.telefone.value,
      email: this.contatoForm.controls.email.value,
    };
    this.criarContato.emit(novoContato);
    this.contatoForm.reset();
  }

  confirmarEditar() {
    if (this.contatoForm.invalid) return;
    const contatoAtualizado = {
      id: this.contatoSignal()?.id,
      nome: this.contatoForm.controls.nome.value,
      telefone: this.contatoForm.controls.telefone.value,
      email: this.contatoForm.controls.email.value,
    };
    this.confirmarEdicao.emit(contatoAtualizado);
  }

  cancelarEditar() {
    this.cancelarEdicao.emit();
  }

  limparOuCancelar() {
    this.contatoForm.reset();
    
    if (this.contatoSignal && this.contatoSignal()) {
      this.cancelarEditar();
    }
  }
}
