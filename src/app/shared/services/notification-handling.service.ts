import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationHandlingService {

  message$: Subject<string> = new Subject()

  constructor() { }

  get getNotificationMessage() {
    return this.message$.asObservable();
  }

  get submitNotificationMessage() {
    return this.message$;
  }
}
