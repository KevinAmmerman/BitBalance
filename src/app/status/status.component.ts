import { Component } from '@angular/core';
import { Observable, Subscription, combineLatest, map, tap } from 'rxjs';
import { BitcoinDataService } from '../shared/services/bitcoin-data.service';
import { FirestoreDataService } from '../shared/services/firestore-data.service';
import { UtilityService } from '../shared/services/utility.service';
import { Transaction } from '../shared/modules/transaction.interface';
import { CommonModule } from '@angular/common';

interface TransformedData {
  cost: number;
  stack: number;
}

interface CombinedData {
  cost: number;
  stackValue: number;
  unrelizedGain: number;
  unrelizedGainInPercent: Number;
}

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent {

  userDataSubscription: Subscription = new Subscription();
  combinedData: CombinedData | any;

  constructor(private fsd: FirestoreDataService, private utility: UtilityService, private bds: BitcoinDataService) {

  }


  ngOnInit() {
    this.userDataSubscription = combineLatest([this.fsd.getCollection('test').pipe(
      map((data: any[]) => this.getTransformedData(data))
    ), this.bds.getCurrentBitcoinPrice()]).pipe(
      map(([transformedData, bitcoinPrice]) => this.getCombinedData(transformedData, bitcoinPrice)),
    ).subscribe((combinedData: CombinedData) => this.combinedData = combinedData);
  }


  ngOnDestroy() {
    this.userDataSubscription.unsubscribe();
  }



  getTransformedData(data: Transaction[]): TransformedData {
    return {
      cost: this.utility.getFullCost(data),
      stack: this.utility.getFullStack(data)
    }
  }


  private getCombinedData(transformedData: TransformedData, bitcoinPrice: any): CombinedData {
    const stackValue = this.utility.formatNumber(bitcoinPrice.EUR * transformedData.stack, 2);
    const unrelizedGain = this.utility.formatNumber(stackValue - transformedData.cost, 2);
    const unrelizedGainInPercent = this.utility.formatNumber((unrelizedGain / transformedData.cost) * 100, 2);
    return {
      cost: transformedData.cost,
      stackValue: stackValue,
      unrelizedGain: unrelizedGain,
      unrelizedGainInPercent: unrelizedGainInPercent
    };
  }


  
}
