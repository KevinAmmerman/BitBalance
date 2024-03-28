import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, combineLatest, map, tap } from 'rxjs';
import { Transaction } from '../shared/modules/transaction';
import { FirestoreDataService } from '../shared/services/firestore-data.service';
import { UtilityService } from '../shared/services/utility.service';
import { BitcoinDataService } from '../shared/services/bitcoin-data.service';

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
	transactionDataSub: Subscription = new Subscription();
	bitcoinPriceSub: Subscription = new Subscription();
	currentBitcoinPrice: any;

	constructor(
		private firestoreDataService: FirestoreDataService,
		private utilityService: UtilityService,
		private bitcoinDataService: BitcoinDataService
	) {
		// this.getCurrentBitcoinPrice();
		this.getDataForTable()
		// this.transactionDataSub = this.firestoreDataService.getCollection('test').pipe(
		// 	map((data: any[]) => data.map((data: Transaction) => ({
		// 		...data,
		// 		amount: this.utilityService.transformAmount(data),
		// 		date: this.utilityService.getDate(data),
		// 		// gain: this.utilityService.getGainOfSingleTransaction(data)
		// 	})
		// 	)),
		// 	tap((data: any) => this.transactionData = data),
		// 	tap((data: any) => this.collectionSize = data.length),
		// 	tap(() => this.refreshTransactions())
		// ).subscribe();
	}


	ngOnDestroy() {
		this.transactionDataSub.unsubscribe();
	}


	getDataForTable() {
		this.transactionDataSub = combineLatest([
			this.firestoreDataService.getCollection('test'),
			this.bitcoinDataService.getCurrentBitcoinPrice()
		]).pipe(
			map(([transactionData, bitcoinPrice]) => transactionData.map((transaction: any) => ({
				...transaction,
				amount: this.utilityService.transformAmount(transaction),
				date: this.utilityService.getDate(transaction),
				value: this.utilityService.getCurrentValue(transaction, bitcoinPrice)
			}))),
			tap((data: Transaction[]) => this.transactionData = data),
			tap((data: Transaction[]) => this.collectionSize = data.length),
			tap(() => this.refreshTransactions())
		).subscribe()
	}


	refreshTransactions() {
		this.transactions = this.transactionData.map((transaction, i) => ({ newId: i + 1, ...transaction })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}
}
