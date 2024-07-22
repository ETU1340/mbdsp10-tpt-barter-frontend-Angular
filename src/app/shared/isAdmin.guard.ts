import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthPopupComponent } from '../popups/auth-popup/auth-popup.component';

export const isAdmin: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean> => {
  const authService = inject(AuthService); // Replace this with proper DI if possible
  const router = inject(Router); // Replace this with proper DI if possible
  const dialog = inject(MatDialog);
  try {
    const isLogged = authService.isAdmin();
    if (isLogged) {
      console.log('GUARD: Navigation authorized');
      return true;
    } else {
      console.log('GUARD: Navigation NOT authorized');
      dialog.open(AuthPopupComponent);
      return false;
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    router.navigate(['/login']); // Redirect on error as well
    return false;
  }
};
