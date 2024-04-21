import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationHandlingService } from '../../shared/services/notification-handling.service';
import { applyActionCode, getAuth } from 'firebase/auth';

@Component({
  selector: 'app-verification-success',
  standalone: true,
  imports: [],
  templateUrl: './verification-success.component.html',
  styleUrl: './verification-success.component.scss',
})
export class VerificationSuccessComponent {
  verificationMessage: string = 'Email address successfully verified';
  verificationImage: string = './../../../assets/img/mail_success.png';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationHandlingService
  ) {
    this.route.queryParams.subscribe((params) => {
      const oobCode = params['oobCode'];
      if (oobCode) this.verifyEmailAddress(oobCode);
    });
  }

  async verifyEmailAddress(oobCode: string) {
    try {
      const auth = getAuth();
      await applyActionCode(auth, oobCode);
      this.verificationMessage = 'Email address successfully verified';
      this.verificationImage = './../../../assets/img/mail_success.png';
      this.redirectToSignIn();
    } catch (error) {
      this.verificationMessage =
        'Something went wrong, please contact the provider of this application';
      this.verificationImage = './../../../assets/img/mail_error.png';
    }
  }

  redirectToSignIn() {
    setTimeout(() => {
      this.router.navigate(['sign-in']);
    }, 6000);
  }
}
