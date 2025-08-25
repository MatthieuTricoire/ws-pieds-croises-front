import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';
import { Role } from '../../shared/models/authUser';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si on a déjà un utilisateur chargé, pas besoin de refaire les vérifications
  if (authService.isLoggedInSignal() && authService.userSignal()) {
    return of(true);
  }

  return authService.isAuthenticated().pipe(
    take(1), // Évite les abonnements multiples
    switchMap((isAuth) => {
      if (isAuth) {
        // Utilisateur authentifié mais données pas chargées
        if (!authService.userSignal()) {
          console.log('[AuthGuard] Chargement des données utilisateur...');
          return authService.loadCurrentUser().pipe(
            map(() => {
              console.log('[AuthGuard] Données utilisateur chargées');
              return true;
            }),
            catchError((err) => {
              console.error('[AuthGuard] Erreur chargement utilisateur:', err);
              return redirectToLogin(authService, router, state.url);
            }),
          );
        }
        return of(true);
      } else {
        console.log('[AuthGuard] Non authentifié, redirection...');
        return redirectToLogin(authService, router, state.url);
      }
    }),
    catchError((err) => {
      console.error('[AuthGuard] Erreur inattendue dans le guard:', err);
      return redirectToLogin(authService, router, state.url);
    }),
  );
};

// Guard pour les rôles spécifiques
export const roleGuard = (requiredRole: Role): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Vérification rapide avec les signals si déjà authentifié
    if (authService.isLoggedInSignal() && authService.userSignal()) {
      const user = authService.userSignal();
      if (user?.roles.includes(requiredRole)) {
        return of(true);
      } else {
        console.log(`[RoleGuard] Rôle ${requiredRole} requis, accès refusé`);
        return of(router.parseUrl('/unauthorized'));
      }
    }

    // Sinon, vérifier l'authentification puis le rôle
    return authService.isAuthenticated().pipe(
      take(1),
      switchMap((isAuth) => {
        if (isAuth) {
          if (!authService.userSignal()) {
            return authService.loadCurrentUser().pipe(
              map(() => {
                const user = authService.userSignal();
                if (user?.roles.includes(requiredRole)) {
                  return true;
                } else {
                  console.log(`[RoleGuard] Rôle ${requiredRole} requis, accès refusé`);
                  return router.parseUrl('/unauthorized');
                }
              }),
              catchError((err) => {
                console.error('[RoleGuard] Erreur chargement utilisateur:', err);
                return redirectToLogin(authService, router, state.url);
              }),
            );
          } else {
            // Utilisateur déjà chargé, vérifier le rôle
            const user = authService.userSignal();
            if (user?.roles.includes(requiredRole)) {
              return of(true);
            } else {
              console.log(`[RoleGuard] Rôle ${requiredRole} requis, accès refusé`);
              return of(router.parseUrl('/unauthorized'));
            }
          }
        } else {
          console.log('[RoleGuard] Non authentifié, redirection...');
          return redirectToLogin(authService, router, state.url);
        }
      }),
      catchError((err) => {
        console.error('[RoleGuard] Erreur inattendue:', err);
        return redirectToLogin(authService, router, state.url);
      }),
    );
  };
};
function redirectToLogin(
  authService: AuthService,
  router: Router,
  url: string,
): Observable<UrlTree> {
  authService.markAsLoggedOut();
  authService.setReturnUrl(url);
  return of(router.parseUrl('/login'));
}

// Guards spécifiques
export const adminGuard: CanActivateFn = roleGuard('ROLE_ADMIN');
export const coachGuard: CanActivateFn = roleGuard('ROLE_COACH');
