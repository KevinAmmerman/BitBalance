import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn =  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) => {
  const router = inject(Router);
  const auth = inject(Auth);

  return authState(auth).pipe(
    map(user => !!user),
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigate(['/sign-in']);
      }
    })
  );
};
