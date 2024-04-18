import { Component, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { Transaction } from '../modules/transaction.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  transactionData: Subject<Transaction> = new Subject();

  constructor(private modalService: NgbModal) {}

  openModal(component: any) {
    this.modalService.open(component);
  }

  get getObservable(): Observable<Transaction> {
    return this.transactionData.asObservable();
  }

  editTransaction(transaction: Transaction) {
    this.transactionData.next(transaction);
  }
}
