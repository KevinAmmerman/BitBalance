import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationHandlingService } from '../../shared/services/notification-handling.service';

@Component({
  selector: 'app-verification-success',
  standalone: true,
  imports: [],
  templateUrl: './verification-success.component.html',
  styleUrl: './verification-success.component.scss',
})
export class VerificationSuccessComponent {
  constructor(
    private route: ActivatedRoute, 
    private afAuth: AngularFireAuth,
    private router: Router,
    private notificationService: NotificationHandlingService
  ) {
    this.route.queryParams.subscribe((params) => {
      const oobCode = params['oobCode'];
      this.verifyEmailAddress(oobCode)
    });
  }

  verifyEmailAddress(oobCode: string) {
    if (oobCode) {
      this.afAuth
        .applyActionCode(oobCode)
        .then(() => {
          this.notificationService.success('Email address successfully verified')
        })
        .catch((error) => {
          this.notificationService.error('Something went wrong!')
        });
    }
    setTimeout(() => {
      this.router.navigate(['sign-in']);
    }, 6000);
  }
}
