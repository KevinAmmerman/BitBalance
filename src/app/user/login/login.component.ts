import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { UserInterface } from '../../shared/modules/user.interface';
import { Subscription } from 'rxjs';
import { Auth, FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, OAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { NotificationHandlingService } from '../../shared/services/notification-handling.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  unsubscribeAuth: Subscription = new Subscription();
  unsubscribeGoogleSsoAuth: Subscription = new Subscription();
  rememberMe: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private auth: Auth,
    private notificationService: NotificationHandlingService
  ) {
    this.rememberMe = this.checkRememberMeLocalStorage();
    this.loginForm = new FormGroup({
      email: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email]),
      password: new FormControl({ value: '', disabled: false }, [Validators.required]),
      rememberMe: new FormControl({ value: this.rememberMe, disabled: false })
    })
  }

  onSubmit() {
    const rawUserData = this.loginForm.getRawValue()
    const newUser: UserInterface = { username: rawUserData.username, email: rawUserData.email, password: rawUserData.password }
    this.unsubscribeAuth = this.authService.login(newUser, rawUserData.rememberMe).subscribe(({
      next: () => this.router.navigateByUrl('dashboard'),
      error: (err: Error) => this.notificationService.error(`Something went wrong! ${err.message}`)
    }))
  }

  ngOnDestroy() {
    this.unsubscribeAuth.unsubscribe();
    this.unsubscribeGoogleSsoAuth.unsubscribe();
  }

  googleSsoLogin() {
    this.unsubscribeGoogleSsoAuth = this.authService.googleSsoLogin().subscribe({
      next: () => this.router.navigateByUrl('dashboard'),
      error: (err: Error) => this.notificationService.error(`Something went wrong! ${err.message}`)
    })
  }

  checkRememberMeLocalStorage() {
    if (localStorage.getItem('RememberMe') === 'true') return true;
    else return false;
  }
}
