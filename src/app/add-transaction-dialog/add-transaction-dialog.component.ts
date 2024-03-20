import { Component } from '@angular/core';
import { NgbActiveModal, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-transaction-dialog',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-transaction-dialog.component.html',
  styleUrl: './add-transaction-dialog.component.scss'
})
export class AddTransactionDialogComponent {

  addTransactionForm: FormGroup;

  constructor(public modal: NgbActiveModal) {
    this.addTransactionForm = new FormGroup({
      bitcoin: new FormControl({ value: '', disabled: false }, Validators.required),
      currency: new FormControl({ value: '', disabled: false }, Validators.required),
      date: new FormControl({ value: '', disabled: false }, Validators.required),
      exchange: new FormControl({ value: '', disabled: false })
    })
  }

  resetForm() {
    this.addTransactionForm.reset({
      bitcoin: '',
      currency: '',
      date: '',
      exchange: ''
    });
  }
}
