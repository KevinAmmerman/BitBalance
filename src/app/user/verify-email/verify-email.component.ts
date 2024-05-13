import { Component } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationHandlingService } from '../../shared/services/notification-handling.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [AngularFireAuthModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {

  unsubscribeVerifyEmail: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationHandlingService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {

  }

  ngOnInit(): void {
    const mode = this.route.snapshot.queryParams['mode'];
    const actionCode = this.route.snapshot.queryParams['oobCode'];

    if (mode === 'verifyEmail' && actionCode) {
      this.verifyEmail(actionCode);
    }
  }

  verifyEmail(code: string): void {
    this.afAuth.applyActionCode(code)
      .then(() => this.router.navigateByUrl('sign-in'))
      .catch(err => this.notificationService.error(`Something went wrong: ${err}`));
  }
}
