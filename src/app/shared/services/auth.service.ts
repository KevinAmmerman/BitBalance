import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { UserInterface } from '../modules/user.interface';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth)

  constructor() { }

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


  logout(): Observable<void>  {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }
}
