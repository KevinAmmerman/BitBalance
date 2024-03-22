import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Transaction } from '../shared/modules/transaction';
import { FirestoreDataService } from '../shared/services/firestore-data.service';

@Component({
  selector: 'app-add-transaction-dialog',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-transaction-dialog.component.html',
  styleUrl: './add-transaction-dialog.component.scss'
})
export class AddTransactionDialogComponent {

  addTransactionForm: FormGroup;

  constructor(public modal: NgbActiveModal, private firebaseService: FirestoreDataService) {
    this.addTransactionForm = new FormGroup({
      bitcoin: new FormControl({ value: '', disabled: false }, [Validators.required]),
      unitType: new FormControl({ value: 'Unit', disabled: false }, Validators.required),
      cost: new FormControl({ value: '', disabled: false }, Validators.required),
      transactionType: new FormControl({ value: 'Buy / Sell', disabled: false }, [Validators.required, Validators.pattern('buy|sell')]),
      date: new FormControl({ value: '', disabled: false }, Validators.required),
      exchange: new FormControl({ value: '', disabled: false })
    })
  }

  onSubmit() {
    try {
      if (this.addTransactionForm.valid) {
        const formData = this.setFormData();
        this.firebaseService.addDoc('test', formData.id, formData)
      }
    } catch (error) {
      console.log('Test')
    }
  }


  setFormData(): Transaction {
    return {
      amount: this.addTransactionForm.value.bitcoin,
      unit: this.addTransactionForm.value.unitType,
      cost: this.addTransactionForm.value.cost,
      date: this.addTransactionForm.value.date,
      id: new Date().getTime(),
      exchange: this.addTransactionForm.value.exchange,
      transactionType: this.addTransactionForm.value.transactionType
    }
  }


  resetForm() {
    this.addTransactionForm.reset({
      bitcoin: '',
      unitType: 'Unit',
      currency: '',
      transactionType: 'Buy / Sell',
      date: '',
      exchange: ''
    });
  }
}
