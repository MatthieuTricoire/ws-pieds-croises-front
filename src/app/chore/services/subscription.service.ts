import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSubscription } from '../../shared/models/subscription';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl = 'http://localhost:8080/user-subscriptions';

  #http = inject(HttpClient);

  getUserSubscriptions(): Observable<UserSubscription[]> {
    return this.#http.get<UserSubscription[]>(`${this.apiUrl}/user/1`);
  }
}
