import { Injectable } from '@angular/core';
import { Transaction } from '../modules/transaction';
import { BitcoinPrice } from '../modules/bitcoin-price';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  getFullStack(data: any) {
    return data.reduce((acc: number, d: any) => {
      if (d.unit === 'sat' && d.transactionType === 'buy') {
        acc += d.amount / 100000000;
      } else if (d.unit === 'btc' && d.transactionType === 'buy') {
        acc += d.amount;
      }
      return acc;
    }, 0)
  }


  getFullCost(data: any[]) {
    return data.reduce((acc: number, d:any) => {
      acc += d.cost;
      return acc
    }, 0)
  }


  getStackValue(data: any) {
    return data.timeframedData.map((d: any) => [d[0], parseFloat((d[1] * data.fullStack).toFixed(2))])
  }


  getDate(data: any) {
    const date = new Date(data.date.year, data.date.month - 1, data.date.day);
    return new Intl.DateTimeFormat('de-DE', 
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
    ).format(date);
  }


  getCurrentValue(data: Transaction, btcPrice: BitcoinPrice) {
    const formatedAmount = this.getFullStack([data])
    return this.formatNumber((btcPrice['EUR'] * formatedAmount), 2);
  }


  transformAmount(data: Transaction) {
    return Intl.NumberFormat('de-DE').format(
      data.amount,
    )
  }


  formatNumber(value: number, decimalPlaces: number): number {
    return parseFloat(value.toFixed(decimalPlaces));
  }
}
