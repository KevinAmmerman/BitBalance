import { Component } from '@angular/core';
import { BitcoinChartComponent } from '../bitcoin-chart/bitcoin-chart.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTransactionDialogComponent } from '../add-transaction-dialog/add-transaction-dialog.component';
import { StatusComponent } from '../status/status.component';
import { TransactionsTableComponent } from '../transactions-table/transactions-table.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BitcoinChartComponent, StatusComponent, TransactionsTableComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(private modalService: NgbModal) {}


  open() {
    this.modalService.open(AddTransactionDialogComponent);
  }
}
