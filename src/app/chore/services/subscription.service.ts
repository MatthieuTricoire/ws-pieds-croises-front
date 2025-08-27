import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  UserSubscription,
  Subscription as AppSubscription,
} from '../../shared/models/subscription';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly baseUrl = 'http://localhost:8080';
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  /** état réactif des abonnements utilisateur */
  userSubscription = signal<UserSubscription | null>(null);

  loadUserSubscription() {
    const user = this.auth.userSignal();
    if (!user) throw new Error('Utilisateur non connecté');

    this.http
      .get<UserSubscription>(`${this.baseUrl}/user-subscriptions/user/${user.id}`, {
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

    const now = new Date();
    const startDate = new Date(now.getTime() + 1 * 60 * 60 * 1000);

    return this.http
      .post<UserSubscription>(
        `${this.baseUrl}/user-subscriptions`,
        { userId: user.id, subscriptionId, startDate },
        { withCredentials: true },
      )
      .pipe(
        tap((newSub) => {
          // met à jour automatiquement le signal
          if (newSub) {
            this.userSubscription.set(newSub);
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
