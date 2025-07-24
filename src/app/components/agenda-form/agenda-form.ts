import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
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
  @Output() criarContato = new EventEmitter<Contato>();

  contatoForm = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    telefone: new FormControl(''),
    email: new FormControl(''),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetarForm']?.currentValue === true) {
      this.contatoForm.reset();
      Object.keys(this.contatoForm.controls).forEach((key) => {
        //@ts-ignore
        this.contatoForm.controls[key].setErrors(null);
      });
    }
  }

  adicionarContato() {
    const novoContato = {
      nome: this.contatoForm.controls.nome.value,
      telefone: this.contatoForm.controls.telefone.value,
      email: this.contatoForm.controls.email.value,
    };
    this.criarContato.emit(novoContato);
  }
}
