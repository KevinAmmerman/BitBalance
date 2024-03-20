import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";
import { Subscription, map, tap } from 'rxjs';
import { BitcoinDataService } from '../shared/services/bitcoin-data.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  colors: any;
};

interface BitcoinHistoricalData {
  time: number,
  price: number
}

@Component({
  selector: 'app-bitcoin-chart',
  standalone: true,
  imports: [HttpClientModule, CommonModule, NgApexchartsModule],
  templateUrl: './bitcoin-chart.component.html',
  styleUrl: './bitcoin-chart.component.scss'
})
export class BitcoinChartComponent {

  @ViewChild("chart", { static: false }) chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  unsubscribeData: Subscription = new Subscription();

  constructor(private bitcoinDataService: BitcoinDataService) {
    // this.subscribeToData()
  }

  subscribeToData() {
    this.unsubscribeData = this.bitcoinDataService.getHistoricalData().pipe(
      tap(e => console.log(e)),
      map((data: any) => this.formatHistoricalData(data.prices)),
      tap((formtedData: BitcoinHistoricalData[]) => this.initChart(formtedData)),
      tap(e => console.log(e))
    ).subscribe();
  }

  formatHistoricalData(data: any): BitcoinHistoricalData[] {
    const limitedData = data.length > 1000 ? data.slice(0, 1000) : data;
    const formattedData = limitedData.map((d: any) => [d.time * 1000, d.EUR]);
    return formattedData;
  }

  initChart(data: BitcoinHistoricalData[]): void {
    this.chartOptions = {
      series: [
        {
          name: 'Bitcoin Price',
          data: data
        }
      ],
      chart: {
        height: 350,
        type: 'area'
      },
      colors: ['#FF9900'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100],
          colorStops: [
            {
              offset: 0,
              color: '#FF9900', 
              opacity: 0.8
            },
            {
              offset: 100,
              color: '#FF9900', 
              opacity: 0.3
            },
          ]
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
        }
      },
      tooltip: {
        x: {
          format: 'dd.MM.yyyy'
        },
        y: {
          formatter: function (val: any) {
            return val + ' €';
          }
        }
      },
      yaxis: {
        title: {
          
        },
        labels: {
          formatter: function (val: any) {
            return (val/ 1000) + 'K' + ' €';
          }
        }
      },
      dataLabels: {
        enabled: false,
        enabledOnSeries: undefined
      }
    }
  }
}
