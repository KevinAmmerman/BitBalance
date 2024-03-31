import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription, catchError, combineLatest, map, of } from 'rxjs';
import { Transaction } from '../shared/modules/transaction.interface';
import { AuthService } from '../shared/services/auth.service';
import { BitcoinDataService } from '../shared/services/bitcoin-data.service';
import { FirestoreDataService } from '../shared/services/firestore-data.service';
import { UtilityService } from '../shared/services/utility.service';
import { NotificationHandlingService } from '../shared/services/notification-handling.service';

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

  unsubscribeUserData: Subscription = new Subscription();
  unsubscribeCurrentUserData: Subscription = new Subscription();
  combinedData: CombinedData | any;

  constructor(
    private fsd: FirestoreDataService, 
    private utility: UtilityService, 
    private bds: BitcoinDataService, 
    private authService: AuthService,
    private notificationService: NotificationHandlingService
    ) {
    this.unsubscribeCurrentUserData = authService.currentUser.pipe(
      catchError((err: Error) => {
        this.notificationService.error(`Something went wrong! ${err.message}`);
        return of([]);
      })
    ).subscribe((user: any) => {
      if(user) this.getData(user.uid)
    });
  }


  getData(uid: string) {
    this.unsubscribeUserData = combineLatest([this.fsd.getCollection(uid).pipe(
      map((data: any[]) => this.getTransformedData(data))
    ), this.bds.getCurrentBitcoinPrice()]).pipe(
      map(([transformedData, bitcoinPrice]) => this.getCombinedData(transformedData, bitcoinPrice)),
      catchError((err: Error) => {
        this.notificationService.error(`Something went wrong! ${err.message}`);
        return of([]);
      })
    ).subscribe((combinedData: CombinedData | never[]) => this.combinedData = combinedData);
  }


  ngOnDestroy() {
    this.unsubscribeUserData.unsubscribe();
    this.unsubscribeCurrentUserData.unsubscribe();
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