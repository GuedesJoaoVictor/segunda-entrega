import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BankDTO } from '../../../../core/models/bank.dto';
import { BankService } from '../../../../core/services/bank.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserBankDTO } from '../../../../core/models/user-bank.dto';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle } from "@angular/material/card";

@Component({
  selector: 'app-vinculate-bank-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle
],
  templateUrl: './vinculate-bank-modal.component.html',
  styleUrls: ['./vinculate-bank-modal.component.css']
})
export class VinculateBankModalComponent implements OnInit {
  bancos: BankDTO[] = [];
  form: FormGroup;
  carregando = false;

  constructor(
    private bankService: BankService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<VinculateBankModalComponent>
  ) {
    this.form = this.fb.group({
      banco: [null, Validators.required],
      nomeVinculo: ['', [Validators.required, Validators.minLength(3)]],
      valorInicial: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.carregarBancos();
  }

  carregarBancos(): void {
    this.carregando = true;
    this.bankService.findAll().subscribe({
      next: (response) => {
        this.bancos = response.data || [];
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar bancos:', err);
        this.snackBar.open('Erro ao carregar bancos!', 'Fechar', { duration: 3000 });
        this.carregando = false;
      }
    });
  }

  vincular(): void {
    if (this.form.valid) {
      const usuario = this.authService.getUser();
      if (!usuario?.id) {
        this.snackBar.open('Usuário não encontrado!', 'Fechar', { duration: 3000 });
        return;
      }

      const userBankDTO: UserBankDTO = {
        name: this.form.value.nomeVinculo,
        totalAmount: this.form.value.valorInicial,
        bank: this.form.value.banco
      };

      this.bankService.vincularBanco(usuario.id, userBankDTO).subscribe({
        next: (response) => {
          this.snackBar.open('Banco vinculado com sucesso!', 'Fechar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Erro completo:', err);
          if (err.error?.message) {
            this.snackBar.open(err.error.message, 'Fechar', { duration: 5000 });
          } else {
            this.snackBar.open('Erro ao vincular banco!', 'Fechar', { duration: 3000 });
          }
        }
      });
    } else {
      this.form.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos corretamente!', 'Fechar', { duration: 3000 });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  get bancoSelecionado(): BankDTO | null {
    return this.form.get('banco')?.value;
  }
}
