import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInterface } from '../../shared/modules/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  newUserForm: FormGroup;
  authSub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private route: Router
    ) {
      this.newUserForm = new FormGroup({
        username: new FormControl({ value: '', disabled: false }, [Validators.required]),
        email: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email]),
        password: new FormControl({ value: '', disabled: false }, [Validators.required])
      })
    }

    onSubmit() {
      const rawUserData = this.newUserForm.getRawValue()
      const newUser: UserInterface = {username: rawUserData.username, email: rawUserData.email, password: rawUserData.password}
      this.authSub = this.authService.register(newUser).subscribe(() => {
        this.route.navigateByUrl('sign-in');
      });
    }


    ngOnDestroy() {
      this.authSub.unsubscribe();
    }

}
