import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";
import { BehaviorSubject, Subscription, catchError, first, map, of, switchMap, tap } from 'rxjs';
import { BitcoinTimestampsAndPrices } from '../shared/modules/bitcoin-price.interface';
import { Transaction } from '../shared/modules/transaction.interface';
import { AuthService } from '../shared/services/auth.service';
import { BitcoinDataService } from '../shared/services/bitcoin-data.service';
import { FirestoreDataService } from '../shared/services/firestore-data.service';
import { UtilityService } from '../shared/services/utility.service';
import { NotificationHandlingService } from '../shared/services/notification-handling.service';

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


interface TransactionDate {
  [key: string]: number;
}

interface formattedData {
  formattedData: any;
  [index: number]: [number, number];
  timeframeData: number;
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
  unsubscribeCurrentUserData: Subscription = new Subscription();

  constructor(
    private bds: BitcoinDataService, 
    private fds: FirestoreDataService, 
    private utility: UtilityService,
    private authService: AuthService,
    private notificationService: NotificationHandlingService
    ) {
    this.getTransactionDates();
    this.unsubscribeCurrentUserData = authService.currentUser.subscribe((user: any) => {
      if(user) this.getDataForChart(user.uid);
    });
  }

  ngOnDestroy() {
    this.unsubscribeDate.unsubscribe();
    this.unsubscribeData.unsubscribe();
    this.unsubscribeCurrentUserData.unsubscribe();
  }


  getDataForChart(uid: string) {
    this.unsubscribeData = this.bds.getHistoricalData().pipe(
      map((data: any) => this.formatHistoricalData(data.prices)),
      switchMap((formattedData: BitcoinTimestampsAndPrices[]) => this.timeframe.pipe(
        map((timeframeData: number) => ({ formattedData, timeframeData }))
      )),
      map((data: formattedData) => this.filterDataForChart(data)),
      switchMap((timeframedData: formattedData) => this.fds.getCollection(uid).pipe(
        map(data => this.utility.getFullStack(data)),
        map((fullStack: number) => ({ timeframedData, fullStack }))
      )),
      map(data => this.utility.getStackValue(data)),
      tap(data => this.initChart(data)),
      catchError((err: Error) => {
        this.notificationService.error(`Something went wrong!, ${err.message}`);
        return of([]);
      })
    ).subscribe()
  }


  formatHistoricalData(data: any): BitcoinTimestampsAndPrices[] {
    return data.map((d: BitcoinTimestampsAndPrices) => [d.time * 1000, d.EUR]);
  }


  filterDataForChart(dataArray: formattedData) {
    const jetzt = Date.now();
    const timeframe = dataArray.timeframeData === this.OLDEST_TRANSACTION_DATE ? this.OLDEST_TRANSACTION_DATE : jetzt - dataArray.timeframeData;
    return dataArray.formattedData.filter((timestamp: number[]) => timestamp[0] >= timeframe);
  }


  getTransactionDates() {
    this.unsubscribeDate = this.fds.getCollection('test').pipe(
      map((data: any) => data.map((data: Transaction) => data.date)),
      map((data: TransactionDate[]) => this.filterOldestDate(data)),
      tap(date => this.OLDEST_TRANSACTION_DATE = date),
      first(),
      catchError((err: Error) => {
        this.notificationService.error(`Something went wrong!, ${err.message}`);
        return of([]);
      })
    ).subscribe()
  }


  filterOldestDate(data: TransactionDate[]) {
    const transformedDates = data.map((date: TransactionDate) => new Date(date['year'], date['month'] - 1, date['day']).getTime())
    return Math.min(...transformedDates);
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


  initChart(data: BitcoinTimestampsAndPrices[]): void {
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
