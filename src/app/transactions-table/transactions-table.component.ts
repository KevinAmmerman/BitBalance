import { Component } from '@angular/core';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Transaction } from '../shared/modules/transaction';
import { Observable, map } from 'rxjs';
import { FirestoreDataService } from '../shared/services/firestore-data.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { UtilityService } from '../shared/services/utility.service';

@Component({
	selector: 'app-transactions-table',
	standalone: true,
	imports: [NgbPaginationModule, NgbTypeaheadModule, AsyncPipe, CommonModule],
	templateUrl: './transactions-table.component.html',
	styleUrl: './transactions-table.component.scss'
})
export class TransactionsTableComponent {

	page = 1;
	pageSize = 4;
	transactionData$: Observable<any> = new Observable()
	// collectionSize = TransactionData.length;
	// countries: Country[];

	constructor(private firestoreDataService: FirestoreDataService, private utilityService: UtilityService) {
		// this.refreshCountries();
		this.transactionData$ = this.firestoreDataService.getCollection('test').pipe(
			map((data: any[]) => data.map((data: Transaction) => ({
				...data,
				date: this.utilityService.getDate(data)
		})))
		);
	}

	// refreshCountries() {
	// 	this.countries = COUNTRIES.map((country, i) => ({ id: i + 1, ...country })).slice(
	// 		(this.page - 1) * this.pageSize,
	// 		(this.page - 1) * this.pageSize + this.pageSize,
	// 	);
	// }

}
