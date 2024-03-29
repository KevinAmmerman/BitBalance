import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';

const redirectToLogin = redirectUnauthorizedTo(['sign-in']);

export const routes: Routes = [
    { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
    { path: 'sign-in', component: LoginComponent },
    {
        path: 'dashboard', component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectToLogin }
    },
    { path: 'sign-up', component: RegisterComponent }
];
