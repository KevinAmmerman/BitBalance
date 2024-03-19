import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexMarkers,
  ApexAnnotations,
  ApexStroke
} from "ng-apexcharts";
import { HttpClientModule } from '@angular/common/http';
import { BitcoinDataService } from '../shared/services/bitcoin-data.service';
import { Observable, map, tap } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  annotations: ApexAnnotations;
  colors: any;
  toolbar: any;
};

@Component({
  selector: 'app-bitcoin-chart',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './bitcoin-chart.component.html',
  styleUrl: './bitcoin-chart.component.scss'
})
export class BitcoinChartComponent {

  historicalData$: Observable<object> = new Observable();

  constructor(private bitcoinDataService: BitcoinDataService) {

    this.historicalData$ = this.bitcoinDataService.getHistoricalData().pipe(
      map((value: any) => {
      return value.prices
    }))
  }

}
