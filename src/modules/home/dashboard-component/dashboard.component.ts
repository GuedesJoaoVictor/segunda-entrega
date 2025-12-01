import { Component, OnInit } from '@angular/core';
import { BankService } from '../../../core/services/bank.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { VinculateBankModalComponent } from './vinculate-bank-modal-component/vinculate-bank-modal.component';

@Component({
  selector: 'app-dashboard-component',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {

  public banks: any[] = [];

  constructor(
    private bankService: BankService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarBancosVinculados();
  }

  private carregarBancosVinculados(): void {
    const user = JSON.parse(localStorage.getItem('auth_user')!);
    const uuid = user.id;
    this.bankService.findAllVinculosByUserUuid(uuid).subscribe({
      next: (response) => {
        this.banks = response || [];
      },
      error: (err) => {
        console.error('Erro ao buscar bancos vinculados:', err);
      }
    });
  }

  abrirModalVinculacao(): void {
    const dialogRef = this.dialog.open(VinculateBankModalComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarBancosVinculados();
      }
    });
  }

  desvincularBanco(bankId: number): void {
    if (confirm('Tem certeza que deseja desvincular este banco?')) {
      this.bankService.desvincularBanco(bankId).subscribe({
        next: () => {
          this.carregarBancosVinculados();
        },
        error: (err) => {
          console.error('Erro ao desvincular banco:', err);
        }
      });
    }
  }
}
