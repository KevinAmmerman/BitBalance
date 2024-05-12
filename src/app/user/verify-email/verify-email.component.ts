import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationHandlingService } from '../../shared/services/notification-handling.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {

  unsubscribeVerifyEmail: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationHandlingService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    const mode = this.route.snapshot.queryParams['mode'];
    const actionCode = this.route.snapshot.queryParams['oobCode'];

    if (mode === 'verifyEmail' && actionCode) {
      this.unsubscribeVerifyEmail = this.authService.verifyEmail(actionCode).subscribe({
        next: () => this.router.navigateByUrl('sign-in'),
        error: (err) => this.notificationService.error('Something went wrong!') 
      });
    }
  }
}
