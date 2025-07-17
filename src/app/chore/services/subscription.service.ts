import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from '../../shared/models/subscription';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl = 'http://localhost:8080/user-subscriptions';

  constructor(private http: HttpClient) {}

  getUserSubscriptions(): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/user/1`);
  }
}
