import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';
import { SubscriptionValidation, UserSubscription } from '../../shared/models/user-subscription';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserSubscriptionService {
  private apiUrl = environment.apiUrl + '/subscriptions';
  private http = inject(HttpClient);

  getUserActiveSubscription(userId: number): Observable<UserSubscription | null> {
    return this.getUserSubscriptions(userId).pipe(
      map((subscriptions) => {
        const now = new Date();
        const activeSubscription = subscriptions.find((sub) => {
          const startDate = new Date(sub.startDate);
          const endDate = new Date(sub.endDate);
          return startDate <= now && endDate >= now;
        });
        return activeSubscription || null;
      }),
      catchError(() => of(null)),
    );
  }

  getUserSubscriptions(userId: number): Observable<UserSubscription[]> {
    return this.http.get<UserSubscription[]>(`${this.apiUrl}/user/${userId}`, {
      withCredentials: true,
    });
  }

  getWeeklyRegistrationsCount(userId: number, courseDate: Date): Observable<number> {
    const courseDateParam = courseDate.toISOString().split('T')[0];

    return this.http
      .get<number>(`${this.apiUrl}/courses/user/${userId}/weekly-count`, {
        params: {
          weekDate: courseDateParam,
        },
        withCredentials: true,
      })
      .pipe(catchError(() => of(0)));
  }

  canRegisterToCourse(userId: number, courseDate: Date): Observable<SubscriptionValidation> {
    return combineLatest([
      this.getUserActiveSubscription(userId),
      this.getWeeklyRegistrationsCount(userId, courseDate),
    ]).pipe(
      map(([subscription, weeklyCount]) => {
        if (!subscription) {
          return { isValid: false, canRegister: false, reason: 'Aucun abonnement actif' };
        }
        const limit = subscription.subscription.sessionPerWeek;
        if (weeklyCount >= limit) {
          return {
            isValid: true,
            canRegister: false,
            reason: `Limite atteinte: ${weeklyCount}/${limit} séances cette semaine`,
          };
        }
        return {
          isValid: true,
          canRegister: true,
          weeklyLimit: limit,
          weeklyRegistrations: weeklyCount,
        };
      }),
    );
  }
}
