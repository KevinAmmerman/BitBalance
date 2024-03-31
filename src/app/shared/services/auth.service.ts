import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, from } from 'rxjs';
import { UserInterface } from '../modules/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth)
  router = inject(Router)
  userData: any;
  user$: BehaviorSubject<any> = new BehaviorSubject('') 

  constructor() {
    onAuthStateChanged(this.firebaseAuth, user => {
      if (user) this.user$.next(user);
    })
  }

  register(user: UserInterface): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, user.email, user.password).then((response) =>
      updateProfile(response.user, { displayName: user.username }));
    return from(promise);
  }


  login(user: UserInterface): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, user.email, user.password)
      .then(() => {});
    return from(promise);
  }


  googleSsoLogin(): Observable<void> {
    const promise = signInWithPopup(this.firebaseAuth, new GoogleAuthProvider())
      .then(() => { });
    return from(promise);
  }


  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  get currentUser(): Observable<string> {
    return this.user$.asObservable();
  }
}
