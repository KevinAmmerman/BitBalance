import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const angularFireAuth = inject(Auth);
  const router = inject(Router)
  const user = angularFireAuth.currentUser;
  const isLoggedIn = !!user;
  if (!isLoggedIn) router.navigateByUrl('sign-in');
  return isLoggedIn;
};
