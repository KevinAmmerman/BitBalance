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
  NgApexchartsModule,
  ApexGrid
} from "ng-apexcharts";
import { BehaviorSubject, Subscription, catchError, first, map, of, switchMap, tap, timestamp } from 'rxjs';
import { BitcoinDataService } from '../shared/services/bitcoin-data.service';
import { FirestoreDataService } from '../shared/services/firestore-data.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  colors: any;
  grid: ApexGrid
};

interface HistoricalDataResponse {
  prices: [number, number][];
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
  unsubscribeDate: Subscription = new Subscription();

  ONE_HOUR_IN_MS = 60 * 60 * 1000;
  ONE_DAY_IN_MS = 24 * this.ONE_HOUR_IN_MS;
  ONE_WEEK_IN_MS = 7 * this.ONE_DAY_IN_MS;
  ONE_MONTH_IN_MS = 30 * this.ONE_DAY_IN_MS;
  ONE_YEAR_IN_MS = 365 * this.ONE_DAY_IN_MS;
  OLDEST_TRANSACTION_DATE: number = 0;
  activeButton: string = '1d';
  timeframe: BehaviorSubject<number> = new BehaviorSubject(this.ONE_DAY_IN_MS);

  constructor(private bds: BitcoinDataService, private fds: FirestoreDataService) {
    this.getTransactionDates();
    this.getDataForChart();
  }

  ngOnDestroy() {
    this.unsubscribeDate.unsubscribe();
    this.unsubscribeData.unsubscribe();
  }


  getDataForChart() {
    this.unsubscribeData = this.bds.getHistoricalData().pipe(
      map((data: any) => this.formatHistoricalData(data.prices)),
      switchMap((formattedData: HistoricalDataResponse[]) => this.timeframe.pipe(
        map((timeframeData: number) => ({ formattedData, timeframeData }))
      )),
      map((data: any) => this.filterDataForChart(data)),
      switchMap((timeframedData: any) => this.fds.getCollection('test').pipe(
        map(data => this.getFullStack(data)),
        map((fullStack: number) => ({ timeframedData, fullStack }))
      )),
      map(data => this.getStackValue(data)),
      tap(data => this.initChart(data)),
      catchError(err => {
        console.log(err);
        return of([]);
      })
    ).subscribe()
  }



  getFullStack(data: any) {
    return data.reduce((acc: number, d: any) => {
      if (d.unit === 'sat') {
        acc += d.amount / 100000000;
      } else {
        acc += d.amount;
      }
      return acc;
    }, 0)
  }


  formatHistoricalData(data: any): HistoricalDataResponse[] {
    return data.map((d: any) => [d.time * 1000, d.EUR]);
  }


  filterDataForChart(dataArray: any) {
    const jetzt = Date.now();
    const timeframe = dataArray.timeframeData === this.OLDEST_TRANSACTION_DATE ? this.OLDEST_TRANSACTION_DATE : jetzt - dataArray.timeframeData;
    return dataArray.formattedData.filter((timestamp: any) => timestamp[0] >= timeframe);
  }


  getTransactionDates() {
    this.unsubscribeDate = this.fds.getCollection('test').pipe(
      map((data: any) => data.map((data: any) => data.date)),
      map(data => this.filterOldestDate(data)),
      tap(date => this.OLDEST_TRANSACTION_DATE = date),
      first()
    ).subscribe()
  }


  filterOldestDate(data: any[]) {
    const transformedDates = data.map(date => new Date(date.year, date.month - 1, date.day).getTime())
    return Math.min(...transformedDates);
  }


  getStackValue(data: any) {
    return data.timeframedData.map((d: any) => [d[0], parseFloat((d[1] * data.fullStack).toFixed(2))])
  }


  setTimeFrame(time: number) {
    this.timeframe.next(time);
    switch (time) {
      case this.ONE_WEEK_IN_MS:
        this.activeButton = '1w';
        break;
      case this.ONE_MONTH_IN_MS:
        this.activeButton = '1m';
        break;
      case this.ONE_YEAR_IN_MS:
        this.activeButton = '1y';
        break
      case this.OLDEST_TRANSACTION_DATE:
        this.activeButton = 'all';
        break;
      default: this.activeButton = '1d';
        break;
    }
  }


  initChart(data: HistoricalDataResponse[]): void {
    this.chartOptions = {
      series: [
        {
          name: 'Bitcoin Price',
          data: data
        }
      ],
      chart: {
        width: '100%',
        height: 350,
        type: 'area',
        offsetX: 0,
        offsetY: 0
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
              color: 'transparent',
              opacity: 0.3
            },
          ]
        }
      },
      xaxis: {
        type: 'datetime',
        tickPlacement: 'on',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          datetimeUTC: false,
          show: false
        }
      },
      tooltip: {
        theme: 'dark',
        x: {
          format: 'dd.MM.yyyy'
        },
        y: {
          formatter: function (val: string) {
            return val + ' €';
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return (val / 1000) + 'K' + ' €';
          },
          show: false
        }
      },
      grid: {
        show: false
      },
      dataLabels: {
        enabled: false,
        enabledOnSeries: undefined
      }
    }
  }
}
