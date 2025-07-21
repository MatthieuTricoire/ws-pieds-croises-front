import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthUser } from '../../shared/models/authUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #router: Router = inject(Router);
  #http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080';
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  userSignal = signal<AuthUser | null>(null);
  isLoggedInSignal = signal<boolean>(false);

  isAdminSignal = computed(() => this.userSignal()?.roles.includes('ROLE_ADMIN') ?? false);

  isCoachSignal = computed(() => this.userSignal()?.roles.includes('ROLE_COACH') ?? false);

  get isLoggedIn$(): Observable<boolean> {
    return this._isLoggedIn.asObservable();
  }

  private returnUrl: string | null = null;

  constructor() {
    this.checkAuthStatus();
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
            this.isLoggedInSignal.set(true);
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
            return of(false);
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

  logout() {
    return this.#http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.markAsLoggedOut();
        this.#router.navigate(['/login']);
      }),
      catchError((error) => {
        console.error('[AuthService] Erreur logout:', error);
        this.markAsLoggedOut();
        this.#router.navigate(['/login']);
        return of();
      }),
    );
  }

  markAsLoggedOut() {
    if (!this.isCurrentlyLoggedIn()) {
      this._isLoggedIn.next(false);
      this.userSignal.set(null);
    }
  }

  setReturnUrl(url: string) {
    this.returnUrl = url;
  }

  private navigateAfterLogin() {
    if (this.returnUrl) {
      this.#router.navigateByUrl(this.returnUrl);
    } else {
      this.#router.navigate(['/test']);
    }
  }

  getCurrentUser() {
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

  isCurrentlyLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }
}
