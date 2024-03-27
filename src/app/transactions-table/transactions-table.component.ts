import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, map, tap } from 'rxjs';
import { Transaction } from '../shared/modules/transaction';
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
	pageSize: number = 4;
	transactions: Transaction[] = [];
	collectionSize: number = 0;

	transactionData: Transaction[] = [];
	transactionDataSub: Subscription = new Subscription();

	constructor(private firestoreDataService: FirestoreDataService, private utilityService: UtilityService) {
		this.transactionDataSub = this.firestoreDataService.getCollection('test').pipe(
			map((data: any[]) => data.map((data: Transaction) => ({
				...data,
				date: this.utilityService.getDate(data)
			})
			)),
			tap((data: any) => this.transactionData = data),
			tap((data: any) => this.collectionSize = data.length),
			tap(() => this.refreshTransactions())
			).subscribe();
	}



	refreshTransactions() {
		this.transactions = this.transactionData.map((transaction, i) => ({ newId: i + 1, ...transaction })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}
}
