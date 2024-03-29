import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { UserInterface } from '../modules/user.interface';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth)

  constructor() { }

  register(user: UserInterface) {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, user.email, user.password).then((response) => 
    updateProfile(response.user, { displayName: user.username }));
    return from(promise);
  }
}
