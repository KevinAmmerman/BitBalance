import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserInterface } from '../../shared/modules/user.interface';
import { Subscription } from 'rxjs';
import { NotificationHandlingService } from '../../shared/services/notification-handling.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  newUserForm: FormGroup;
  unsubscribeAuth: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private route: Router,
    private notificationService: NotificationHandlingService
  ) {
    this.newUserForm = new FormGroup({
      email: new FormControl({ value: '', disabled: false }, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl({ value: '', disabled: false }, [
        Validators.required,
      ])
    });
  }

  onSubmit() {
    const rawUserData = this.newUserForm.getRawValue();
    const newUser: UserInterface = {
      email: rawUserData.email,
      password: rawUserData.password,
    };
    this.unsubscribeAuth = this.authService.register(newUser).subscribe({
      next: () => {
        this.route.navigateByUrl('verification');
      },
      error: (err: Error) =>
        this.notificationService.error(`Something went wrong! ${err.message}`),
    });
  }

  ngOnDestroy() {
    this.unsubscribeAuth.unsubscribe();
  }
}
