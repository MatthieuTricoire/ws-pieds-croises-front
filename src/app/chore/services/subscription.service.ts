import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getAllSubscriptions(): Observable<AppSubscription[]> {
    return this.http.get<AppSubscription[]>(`${this.baseUrl}/subscriptions`, {
      withCredentials: true,
    });
  }

  getUserSubscriptions(): Observable<UserSubscription[]> {
    const user = this.auth.userSignal();
    if (!user) throw new Error('Utilisateur non connecté');
    return this.http.get<UserSubscription[]>(`${this.baseUrl}/user-subscriptions/user/${user.id}`, {
      withCredentials: true,
    });
  }
}
