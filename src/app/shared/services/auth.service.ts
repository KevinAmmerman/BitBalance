import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { browserLocalPersistence } from 'firebase/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, from, map } from 'rxjs';
import { UserInterface } from '../modules/user.interface';
import { NotificationHandlingService } from './notification-handling.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  afAuth = inject(AngularFireAuth);
  router = inject(Router);
  userData: any;
  user$: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(private notificationService: NotificationHandlingService) {
    onAuthStateChanged(this.firebaseAuth, (user) => {
      if (user) this.user$.next(user);
    });
  }

  register(user: UserInterface): Observable<void> {
    return from(
      createUserWithEmailAndPassword(
        this.firebaseAuth,
        user.email,
        user.password
      )
    ).pipe(
      map((userCredentials: UserCredential) => {
        sendEmailVerification(userCredentials.user);
      }),
      catchError(() => {
        throw Error;
      })
    );
  }

  login(user: UserInterface): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      user.email,
      user.password
    ).then(() => {});
    return from(promise);
  }

  googleSsoLogin(): Observable<void> {
    const promise = signInWithPopup(
      this.firebaseAuth,
      new GoogleAuthProvider()
    ).then(() => {});
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  get currentUser(): Observable<string> {
    return this.user$.asObservable();
  }

  verifyEmail(code: string): Observable<void> {
    const promise = this.afAuth.applyActionCode(code);
    return from(promise);
  }
}
