import {
  Component,
  effect,
  EventEmitter,
  Input,
  Output,
  Signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContatoResponse } from '../../interfaces/agenda.interfaces';

@Component({
  selector: 'app-agenda-form',
  standalone: false,
  templateUrl: './agenda-form.html',
  styleUrl: './agenda-form.scss',
})
export class AgendaForm {
  @Input() resetarForm = false;
  @Input() contatoSignal!: Signal<ContatoResponse | null>;

  @Output() criarContato = new EventEmitter<ContatoResponse>();
  @Output() confirmarEdicao = new EventEmitter<ContatoResponse>();
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
        Object.keys(this.contatoForm.controls).forEach((key) => {
          //@ts-ignore
          this.contatoForm.controls[key].setErrors(null);
        });
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
    Object.keys(this.contatoForm.controls).forEach((key) => {
      //@ts-ignore
      this.contatoForm.controls[key].setErrors(null);
    });
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
}
