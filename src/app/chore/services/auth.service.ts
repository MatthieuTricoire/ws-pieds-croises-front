import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthUser, Role } from '../../shared/models/authUser';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signals unifiés
  userSignal = signal<AuthUser | null>(null);
  isLoggedInSignal = signal<boolean>(false);
  isAdminSignal = computed(() => this.userSignal()?.roles.includes('ROLE_ADMIN') ?? false);
  isCoachSignal = computed(() => this.userSignal()?.roles.includes('ROLE_COACH') ?? false);
  userUpdateSignal = signal<AuthUser | null>(null);

  // Injections
  #router: Router = inject(Router);
  #http = inject(HttpClient);

  // Configuration
  readonly apiUrl = environment.apiUrl;
  readonly #defaultRoute = '/dashboard'; // Plus parlant que /test
  readonly #returnUrlKey = 'auth_return_url';

  constructor() {
    this.checkAuthStatus();
  }

  getApiUrl(): string {
    return this.apiUrl; // 👈 accessible depuis le template
  }

  login(email: string, password: string): Observable<boolean> {
    return this.#http
      .post(
        `${this.apiUrl}/auth/login`,
        { email, password },
        {
          withCredentials: true,
          observe: 'response',
        },
      )
      .pipe(
        switchMap(() => this.isAuthenticated()),
        switchMap((isAuth) => {
          if (isAuth) {
            return this.loadCurrentUser().pipe(
              tap(() => {
                console.log('[AuthService] Login réussi, utilisateur chargé.');
                this.navigateAfterLogin();
              }),
              switchMap(() => of(true)),
            );
          } else {
            console.error('[AuthService] Login ok mais isAuthenticated retourne false.');
            this.markAsLoggedOut();
            return throwError(() => new Error('Authentication failed'));
          }
        }),
        catchError((err) => {
          console.error('[AuthService] Erreur login:', err);
          this.markAsLoggedOut();
          return throwError(() => err);
        }),
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.#http
      .get<boolean>(`${this.apiUrl}/auth/check`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('[AuthService] Erreur isAuthenticated:', error);
          return of(false);
        }),
      );
  }

  firstLogin(password: string, registrationToken: string): Observable<string> {
    return this.#http.post(
      `${this.apiUrl}/auth/register`,
      { password, registrationToken },
      { responseType: 'text', withCredentials: true },
    );
  }

  askNewPassword(email: string): Observable<string> {
    return this.#http.post(
      `${this.apiUrl}/auth/forgot-password`,
      { email },
      { responseType: 'text' },
    );
  }

  resetPassword(resetPasswordToken: string, newPassword: string): Observable<string> {
    return this.#http.post(
      `${this.apiUrl}/auth/reset-password`,
      { resetPasswordToken, newPassword },
      { responseType: 'text' },
    );
  }

  logout(): Observable<void> {
    return this.#http.post<void>(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.markAsLoggedOut();
        this.clearReturnUrl();
        this.#router.navigate(['/login']);
      }),
      catchError((error) => {
        console.error('[AuthService] Erreur logout:', error);
        this.markAsLoggedOut();
        this.clearReturnUrl();
        this.#router.navigate(['/login']);
        return throwError(() => error);
      }),
    );
  }

  markAsLoggedOut(): void {
    this.userSignal.set(null);
    this.isLoggedInSignal.set(false);
  }

  // Persistance de l'URL de retour
  setReturnUrl(url: string): void {
    sessionStorage.setItem(this.#returnUrlKey, url);
  }

  private getReturnUrl(): string | null {
    return sessionStorage.getItem(this.#returnUrlKey);
  }

  private clearReturnUrl(): void {
    sessionStorage.removeItem(this.#returnUrlKey);
  }

  getCurrentUser(): Observable<AuthUser> {
    return this.#http.get<AuthUser>(`${this.apiUrl}/auth/me`, { withCredentials: true });
  }

  loadCurrentUser(): Observable<AuthUser> {
    return this.getCurrentUser().pipe(
      tap((user) => {
        this.userSignal.set(user);
        this.isLoggedInSignal.set(true);
      }),
      catchError((error) => {
        this.markAsLoggedOut();
        return throwError(() => error);
      }),
    );
  }

  checkAuthStatus(): void {
    this.isAuthenticated()
      .pipe(
        switchMap((isAuth) => {
          this.isLoggedInSignal.set(isAuth);
          return isAuth ? this.loadCurrentUser() : of(null);
        }),
      )
      .subscribe({
        error: (error) => {
          console.error('[AuthService] Check status error', error);
          this.markAsLoggedOut();
        },
      });
  }

  private navigateAfterLogin(): void {
    const returnUrl = this.getReturnUrl();
    if (returnUrl) {
      this.clearReturnUrl();
      this.#router.navigateByUrl(returnUrl);
    } else {
      this.#router.navigate([this.#defaultRoute]);
    }
  }

  // Méthodes utilitaires pour les guards/composants
  requireAuth(): boolean {
    if (!this.isLoggedInSignal()) {
      this.setReturnUrl(this.#router.url);
      this.#router.navigate(['/login']);
      return false;
    }
    return true;
  }

  requireRole(role: Role): boolean {
    const user = this.userSignal();
    return user?.roles.includes(role) ?? false;
  }
}
