import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { UserInterface } from '../../shared/modules/user.interface';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private route: Router
    ) {
    this.loginForm = new FormGroup({
      email: new FormControl ({ value: '', disabled: false }, [Validators.required, Validators.email]),
      password: new FormControl ({ value: '', disabled: false }, [Validators.required])
    })
  }

  onSubmit() {
    const rawUserData = this.loginForm.getRawValue()
    const newUser: UserInterface = {username: rawUserData.username, email: rawUserData.email, password: rawUserData.password}
    this.authService.login(newUser).subscribe(({
      next: () => this.route.navigateByUrl('dashboard'),
      error: (err) => console.log(err)
    }))
  }

}
