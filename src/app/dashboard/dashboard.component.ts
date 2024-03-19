import { Component } from '@angular/core';
import { BitcoinChartComponent } from '../bitcoin-chart/bitcoin-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BitcoinChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
