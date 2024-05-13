import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  userForm: FormGroup;

  constructor(public modal: NgbActiveModal) {
    this.userForm = new FormGroup({
      email: new FormControl({ value: '', disabled: false }, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl({ value: '', disabled: false }, [
        Validators.required,
      ])
    })
  }

  onSubmit() {}
}
