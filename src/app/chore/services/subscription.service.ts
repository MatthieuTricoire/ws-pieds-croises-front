import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  Subscription as AppSubscription,
  UserSubscription,
} from '../../shared/models/subscription';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly baseUrl = 'http://localhost:8080';
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  // Signals
  userSubscription = signal<UserSubscription | null>(null);
  availableSubscriptions = signal<AppSubscription[]>([]);

  getActiveUserSubscription() {
    const user = this.auth.userSignal();
    if (!user) throw new Error('Utilisateur non connecté');

    this.http
      .get<UserSubscription>(`${this.baseUrl}/user-subscriptions/active/user/${user.id}`, {
        withCredentials: true,
      })
      .subscribe((sub) => this.userSubscription.set(sub));
  }

  getAllSubscriptions(): Observable<AppSubscription[]> {
    return this.http.get<AppSubscription[]>(`${this.baseUrl}/subscriptions`, {
      withCredentials: true,
    });
  }

  createUserSubscription(subscriptionId: number) {
    const user = this.auth.userSignal();
    if (!user) throw new Error('Utilisateur non connecté');

    return this.http
      .post<UserSubscription>(
        `${this.baseUrl}/user-subscriptions`,
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

  deleteUserSubscription(userSubscriptionId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/user-subscriptions/${userSubscriptionId}`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.userSubscription.set(null);
        }),
      );
  }
}
