import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, catchError, combineLatest, map, of, tap } from 'rxjs';
import { BitcoinPrice } from '../shared/modules/bitcoin-price.interface';
import { Transaction } from '../shared/modules/transaction.interface';
import { AuthService } from '../shared/services/auth.service';
import { BitcoinDataService } from '../shared/services/bitcoin-data.service';
import { FirestoreDataService } from '../shared/services/firestore-data.service';
import { UtilityService } from '../shared/services/utility.service';

@Component({
	selector: 'app-transactions-table',
	standalone: true,
	imports: [NgbPaginationModule, NgbTypeaheadModule, CommonModule, FormsModule],
	templateUrl: './transactions-table.component.html',
	styleUrl: './transactions-table.component.scss'
})
export class TransactionsTableComponent {

	page: number = 1;
	pageSize: number = 5;
	transactions: Transaction[] = [];
	collectionSize: number = 0;

	transactionData: Transaction[] = [];
	unsubscribeTransactionData: Subscription = new Subscription();
	unsubscribeCurrentUserData: Subscription = new Subscription();

	constructor(
		private firestoreDataService: FirestoreDataService,
		private utilityService: UtilityService,
		private bitcoinDataService: BitcoinDataService,
		private authService: AuthService
	) {
		this.unsubscribeCurrentUserData = authService.currentUser.subscribe((user: any) => {
			if(user) this.getDataForTable(user.uid)
		});
	}


	ngOnDestroy() {
		this.unsubscribeTransactionData.unsubscribe();
		this.unsubscribeCurrentUserData.unsubscribe();
	}


	getDataForTable(uid: string) {
		this.unsubscribeTransactionData = combineLatest([
			this.firestoreDataService.getCollection(uid),
			this.bitcoinDataService.getCurrentBitcoinPrice()
		]).pipe(
			map(([transactionData, bitcoinPrice]) => transactionData.map((transaction: any) => ({
				...transaction,
				amount: this.utilityService.transformAmount(transaction),
				date: this.utilityService.getDate(transaction),
				value: this.utilityService.getCurrentValue(transaction, bitcoinPrice as BitcoinPrice)
			}))),
			tap((data: Transaction[]) => {
				this.transactionData = data;
				this.collectionSize = data.length;
				this.refreshTransactions();
			}),
			catchError((err: Error) => {
				console.log(err.message);
				return of([]);
			})
		).subscribe()
	}


	refreshTransactions() {
		this.transactions = this.transactionData.map((transaction, i) => ({ newId: i + 1, ...transaction })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}
}
