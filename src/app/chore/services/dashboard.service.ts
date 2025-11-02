import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Stat } from '../../shared/models/stat';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  #apiUrl = environment.apiUrl;
  #http = inject(HttpClient);

  #stats = signal<Stat | null>(null);
  #error = signal<string | null>(null);
  #loading = signal<boolean>(false);

  // Expositions en lecture seule
  stats = this.#stats.asReadonly();
  error = this.#error.asReadonly();
  loading = this.#loading.asReadonly();

  // getStats gère maintenant l'ensemble du workflow : chargement, mise à jour des signals, gestion d'erreur
  getStats(): Observable<Stat> {
    this.#loading.set(true);
    this.#error.set(null);
    return this.#http.get<Stat>(`${this.#apiUrl}/stats`, { withCredentials: true }).pipe(
      tap((stats) => {
        this.#stats.set(stats);
        this.#loading.set(false);
      }),
      catchError((err) => {
        console.error('Error loading stats:', err);
        this.#error.set('Error during stats loading');
        this.#loading.set(false);
        return of('' as unknown as Stat);
      }),
    );
  }
}
