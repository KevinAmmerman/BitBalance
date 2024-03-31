import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Notification {
  message: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationHandlingService {

  message$: Subject<Notification> = new Subject()

  constructor() { }

  get getNotificationMessage() {
    return this.message$.asObservable();
  }


  error(message: string) {
    this.message$.next({message: message, type: 'warning'});
  }


  success(message: string) {
    this.message$.next({message: message, type: 'success'});
  }
}
