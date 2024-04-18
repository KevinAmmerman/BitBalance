import { Component } from '@angular/core';
import { BitcoinChartComponent } from '../bitcoin-chart/bitcoin-chart.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTransactionDialogComponent } from '../add-transaction-dialog/add-transaction-dialog.component';
import { StatusComponent } from '../status/status.component';
import { TransactionsTableComponent } from '../transactions-table/transactions-table.component';
import { HeaderComponent } from '../shared/header/header.component';
import { NotificationComponent } from '../shared/notification/notification.component';
import { ModalService } from '../shared/services/modal.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BitcoinChartComponent,
    StatusComponent,
    TransactionsTableComponent,
    HeaderComponent,
    NotificationComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(private modalService: ModalService) {}

  open() {
    this.modalService.openModal(AddTransactionDialogComponent);
  }
}
