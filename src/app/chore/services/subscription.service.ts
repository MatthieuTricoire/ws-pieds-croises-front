import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Subscription, UserSubscription } from '../../shared/models/user-subscription';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  readonly apiUrl = environment.apiUrl;
  #http = inject(HttpClient);
  #auth = inject(AuthService);

  userSubscription = signal<UserSubscription | null>(null);
  availableSubscriptions = signal<Subscription[]>([]);

  getActiveUserSubscription() {
    const user = this.#auth.userSignal();
    if (!user) throw new Error('Utilisateur non connecté');

    this.#http
      .get<UserSubscription>(`${this.apiUrl}/user-subscriptions/user/${user.id}`, {
        params: { status: 'ACTIVE' },
        withCredentials: true,
      })
      .subscribe((sub) => this.userSubscription.set(sub));
  }

  getAllSubscriptions(): Observable<Subscription[]> {
    return this.#http
      .get<Subscription[]>(`${this.apiUrl}/subscriptions`, {
        withCredentials: true,
      })
      .pipe(
        tap((subscriptions) => {
          this.availableSubscriptions.set(subscriptions);
        }),
      );
  }

  createUserSubscription(subscriptionId: number) {
    const user = this.#auth.userSignal();
    if (!user) throw new Error('Utilisateur non connecté');

    return this.#http
      .post<UserSubscription>(
        `${this.apiUrl}/user-subscriptions`,
        { userId: user.id, subscriptionId },
        { withCredentials: true },
      )
      .pipe(
        tap((newUserSubscription) => {
          if (newUserSubscription) {
            this.userSubscription.set(newUserSubscription);
          }
        }),
      );
  }
  createUserSubscriptionForUser(
    userId: number,
    subscriptionId: number,
  ): Observable<UserSubscription> {
    return this.#http.post<UserSubscription>(
      `${this.apiUrl}/user-subscriptions`,
      { userId, subscriptionId },
      { withCredentials: true },
    );
  }

  deleteUserSubscription(userSubscriptionId: number): Observable<void> {
    return this.#http
      .delete<void>(`${this.apiUrl}/user-subscriptions/${userSubscriptionId}`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.userSubscription.set(null);
        }),
      );
  }

  createSubscription(subscription: Partial<Subscription>): Observable<Subscription> {
    return this.#http
      .post<Subscription>(`${this.apiUrl}/subscriptions`, subscription, {
        withCredentials: true,
      })
      .pipe(
        tap((newSubscription) => {
          const currentSubscriptions = this.availableSubscriptions();
          this.availableSubscriptions.set([...currentSubscriptions, newSubscription]);
        }),
        catchError((error) => {
          console.error('Error creating subscription:', error);
          return throwError(() => error);
        }),
      );
  }

  updateSubscription(
    subscriptionId: number,
    subscriptionData: Partial<Subscription>,
  ): Observable<Subscription> {
    return this.#http
      .put<Subscription>(`${this.apiUrl}/subscriptions/${subscriptionId}`, subscriptionData, {
        withCredentials: true,
      })
      .pipe(
        tap((updatedSubscription) => {
          const currentSubscriptions = this.availableSubscriptions();
          const updatedSubscriptions = currentSubscriptions.map((sub) =>
            sub.id === subscriptionId ? updatedSubscription : sub,
          );
          this.availableSubscriptions.set(updatedSubscriptions);
        }),
        catchError((error) => {
          console.error('Error updating subscription:', error);
          return throwError(() => error);
        }),
      );
  }
  deleteSubscription(subscriptionId: number): Observable<void> {
    return this.#http
      .delete<void>(`${this.apiUrl}/subscriptions/${subscriptionId}`, { withCredentials: true })
      .pipe(
        tap(() => {
          const currentSubscriptions = this.availableSubscriptions();
          const filteredSubscriptions = currentSubscriptions.filter(
            (sub) => sub.id !== subscriptionId,
          );
          this.availableSubscriptions.set(filteredSubscriptions);
        }),
        catchError((error) => {
          console.error('Error deleting subscription:', error);
          return throwError(() => error);
        }),
      );
  }
}
