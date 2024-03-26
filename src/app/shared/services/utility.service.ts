import { Injectable } from '@angular/core';

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
}
