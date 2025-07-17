import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { AuthUser, Role } from '../../shared/models/authUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #router: Router = inject(Router);
  #http = inject(HttpClient);

  firstLogin(password: string, registrationToken: string): Observable<string> {
    return this.#http.post(
      `${this.apiUrl}/auth/register`,
      { password, registrationToken },
      { responseType: 'text' },
    );
  }
  private apiUrl = 'http://localhost:8080';

  private currentUser: AuthUser | null = null;

  login(email: string, password: string): Observable<string> {
    return this.#http
      .post(`${this.apiUrl}/auth/login`, { email, password }, { responseType: 'text' })
      .pipe(
        tap((token: string) => {
          this.saveToken(token);
        }),
      );
  }

  private buildAuthUserFromToken(token: string): void {
    try {
      const decoded = jwtDecode<{
        sub: string;
        exp: number;
        roles: { authority: Role }[];
      }>(token);

      const authorities = decoded.roles.map((role) => role.authority);

      let mainRole: Role = 'ROLE_USER';

      if (authorities.includes('ROLE_ADMIN')) {
        mainRole = 'ROLE_ADMIN';
      } else if (authorities.includes('ROLE_COACH')) {
        mainRole = 'ROLE_COACH';
      }

      this.currentUser = {
        email: decoded.sub,
        exp: decoded.exp,
        role: mainRole,
      };
    } catch {
      this.currentUser = null;
    }
  }

  logout(): void {
    this.clearToken();
    this.#router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.buildAuthUserFromToken(token);
  }

  clearToken(): void {
    localStorage.removeItem('access_token');
  }

  verifyToken(): void {
    const token = this.getToken();

    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const expiryDate = new Date(decodedToken.exp! * 1000);

      if (expiryDate < new Date()) {
        this.clearToken();
      }
    } catch {
      this.clearToken();
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      const expiryDate = new Date(decodedToken.exp! * 1000);
      if (expiryDate < new Date()) {
        this.clearToken();
        return false;
      }
      return true;
    } catch {
      this.clearToken();
      return false;
    }
  }

  getCurrentUser(): AuthUser | null {
    if (this.currentUser) return this.currentUser;

    const token = this.getToken();
    if (!token) return null;

    this.buildAuthUserFromToken(token);
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ROLE_ADMIN';
  }

  isCoach(): boolean {
    return this.getCurrentUser()?.role === 'ROLE_COACH';
  }

  isUser(): boolean {
    return this.getCurrentUser()?.role === 'ROLE_USER';
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
}
