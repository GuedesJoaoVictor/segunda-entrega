import {Component, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { BankService } from '../../../core/services/bank.service';
import { BankDTO } from '../../../core/models/bank.dto';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-bank-component',
  imports: [
    CommonModule,
    MatIcon,
    MatButton,
    MatFormField,
    MatInput,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatLabel,
    MatError
  ],
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.css',
})
export class BankComponent implements OnInit {
  editing = false;

  form: FormGroup = new FormGroup({});
  banks: BankDTO[] = [];

  bankTypes: string[] = [
    'Banco Comercial',
    'Banco de Investimento',
    'Banco Múltiplo',
    'Cooperativa de Crédito',
    'Fintech',
    'Banco de Desenvolvimento',
    'Banco Público'
  ];

  constructor(
    private bankService: BankService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      type: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadBanks();
  }

  private loadBanks(): void {
    this.bankService.findAll().subscribe({
      next: (response) => {
        this.banks = response.data || [];
      },
      error: (err) => {
        console.error('Erro ao carregar bancos:', err);
      }
    });
  }

  protected adicionarBanco() {
    if (this.form.valid) {
      const {name, type, agency, number} = this.form.value;
      this.bankService.create({name, type, agency, number} as BankDTO).subscribe({
        next: (bank) => {
          this.banks = [...this.banks, bank];
          this.resetForm();
          this.loadBanks();
        },
        error: (err) => {
          console.error('Erro ao criar banco:', err);
        }
      });
    }
  }

  protected deletarBanco(bank: BankDTO) {
    if (confirm(`Tem certeza que deseja excluir o banco ${bank.name}?`)) {
      this.bankService.delete(bank.id as number).subscribe({
        next: () => {
          this.banks = this.banks.filter(b => b.id !== bank.id);
          window.location.reload();
        },
        error: (err) => {
          console.error('Erro ao excluir banco:', err);
        }
      });
    }
  }

  protected editarBanco(bank: BankDTO) {
    this.editing = true;

    this.form.setValue({
      id: bank.id,
      name: bank.name,
      type: bank.type,
    });
  }

  protected atualizarBanco() {
    if (this.form.valid) {
      const {id, name, type, agency, number} = this.form.value;

      this.bankService.update(id, {id, name, type } as BankDTO).subscribe({
        next: (bankAtualizado: any) => {
          this.banks = this.banks.map(bank => bank.id === id ? bankAtualizado : bank);
          this.resetForm();
          this.loadBanks();
        },
        error: (err) => {
          console.error('Erro ao atualizar banco:', err);
        }
      });
    }
  }

  resetForm() {
    this.form.reset();
    this.editing = false;
  }
}
