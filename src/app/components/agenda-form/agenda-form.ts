import {
  Component,
  effect,
  EventEmitter,
  Inject,
  inject,
  Input,
  OnInit,
  Output,
  Signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contato } from '../../interfaces/agenda.interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgendaService } from '../../services/agenda-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agenda-form',
  standalone: false,
  templateUrl: './agenda-form.html',
  styleUrl: './agenda-form.scss',
})
export class AgendaForm implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AgendaForm>);
  readonly agendaService = inject(AgendaService);
  readonly toast = inject(ToastrService);

  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { contato?: Contato; isEdicao: boolean }
  ) { }

  contatoForm = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    telefone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email],
    }),
  });

  ngOnInit(): void {
    if (this.data.contato) {
      this.contatoForm.patchValue({
        nome: this.data.contato.nome ?? '',
        telefone: this.data.contato.telefone ?? '',
        email: this.data.contato.email ?? '',
      });
    }
  }

  adicionarContato() {
    if (this.contatoForm.invalid) return;
    this.isLoading = true;
    const novoContato = {
      nome: this.contatoForm.controls.nome.value,
      telefone: this.contatoForm.controls.telefone.value,
      email: this.contatoForm.controls.email.value,
    };

    this.agendaService.addContato(novoContato).subscribe({
      next: () => {
        this.toast.success('Contato adicionado com sucesso!', 'Parabéns', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'decreasing',
        });
        this.dialogRef.close();
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Erro ao adicionar contato!', 'Erro', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'decreasing',
        });
        this.isLoading = false;
      }
    });
  }

  confirmarEditar() {
    if (this.contatoForm.invalid) return;
    this.isLoading = true;
    const contatoAtualizado = {
      id: this.data.contato?.id,
      nome: this.contatoForm.controls.nome.value,
      telefone: this.contatoForm.controls.telefone.value,
      email: this.contatoForm.controls.email.value,
    };
    this.agendaService.updateContato(contatoAtualizado).subscribe({
      next: () => {
        this.toast.success('Contato atualizado com sucesso!', 'Parabéns', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'decreasing',
        });
        this.dialogRef.close();
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Erro ao atualizar contato!', 'Erro', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'decreasing',
        });
        this.isLoading = false;
      }
    });
  }

  cancelarEditar() {
    this.contatoForm.reset();
    this.dialogRef.close();
  }

  limparOuCancelar() {
    this.dialogRef.close();
  }
}
