import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  #http = inject(HttpClient);
  #router = inject(Router);

  firstLogin(password: string, registrationToken: string): Observable<string> {
    return this.#http.post(
      `${this.apiUrl}/auth/register`,
      { password, registrationToken },
      { responseType: 'text' },
    );
  }

  login(email: string, password: string): Observable<string> {
    return this.#http
      .post(`${this.apiUrl}/auth/login`, { email, password }, { responseType: 'text' })
      .pipe(
        tap((token: string) => {
          this.saveToken(token);
        }),
      );
  }

  logout() {
    this.clearToken();
    this.#router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
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
}
