import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    switchMap((isAuth) => {
      if (isAuth) {
        if (!authService.userSignal()) {
          return authService.loadCurrentUser().pipe(
            map(() => true),
            catchError((err) => {
              console.error('[AuthGuard] Erreur chargement utilisateur:', err);
              authService.markAsLoggedOut();
              authService.setReturnUrl(state.url);
              return of(router.parseUrl('/login'));
            }),
          );
        }
        return of(true);
      } else {
        console.log('[AuthGuard] Non authentifié, redirection...');
        authService.markAsLoggedOut();
        authService.setReturnUrl(state.url);
        return of(router.parseUrl('/login'));
      }
    }),
    catchError((err) => {
      console.error('[AuthGuard] Erreur inattendue dans le guard:', err);
      authService.markAsLoggedOut();
      authService.setReturnUrl(state.url);
      return of(router.parseUrl('/login'));
    }),
  );
};
