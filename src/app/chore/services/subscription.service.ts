import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSubscription } from '../../shared/models/subscription';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl = 'http://localhost:8080/user-subscriptions';

  #http = inject(HttpClient);
  #auth = inject(AuthService);

  getUserSubscriptions(): Observable<UserSubscription[]> {
    const user = this.#auth.userSignal();
    console.log(user);
    if (!user) {
      throw new Error('Aucun utilisateur connecté');
    }

    return this.#http.get<UserSubscription[]>(`${this.apiUrl}/user/${user.id}`, {
      withCredentials: true,
    });
  }
}
