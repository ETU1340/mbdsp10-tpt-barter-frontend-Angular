import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLoggedIn().then((islogged) => {
    if (islogged) {
      console.log('GUARD: Navigation autorisée');
      return true;
    } else {
      console.log('GUARD: Navigation NON autorisée');
      router.navigate(['/login']);
      return false;
    }
  });
};
