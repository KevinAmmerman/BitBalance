import { Component, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, debounceTime, tap } from 'rxjs';
import { NotificationHandlingService } from '../services/notification-handling.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgbAlertModule, NgbAlert],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | any;
  unsubscribeNotification: Subscription = new Subscription();
  noteMessage: string = '';
  type: string = '';

  constructor(private notificationService: NotificationHandlingService) {
    this.unsubscribeNotification = notificationService.getNotificationMessage.pipe(
      takeUntilDestroyed(),
      tap(message => {
        this.noteMessage = message.message;
        this.type = message.type;
      }),
      debounceTime(5000)
    ).subscribe(() => this.selfClosingAlert?.close())
  }

}
