import { Component } from '@angular/core';
import { BitcoinChartComponent } from '../bitcoin-chart/bitcoin-chart.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTransactionDialogComponent } from '../add-transaction-dialog/add-transaction-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BitcoinChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(private modalService: NgbModal) {}


  open() {
    this.modalService.open(AddTransactionDialogComponent);
  }
}
