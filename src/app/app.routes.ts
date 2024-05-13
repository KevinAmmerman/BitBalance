import { redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './shared/guards/auth.guard';
import { EmailVerificationComponent } from './user/email-verification/email-verification.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { VerifyEmailComponent } from './user/verify-email/verify-email.component';


export const routes: Routes = [
    { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
    { path: 'sign-in', component: LoginComponent },
    {
        path: 'dashboard', component: DashboardComponent,
        canActivate: [authGuard]
    },
    { path: 'sign-up', component: RegisterComponent },
    { path: 'verification', component: EmailVerificationComponent },
    { path: 'verify-email', component: VerifyEmailComponent }
];
