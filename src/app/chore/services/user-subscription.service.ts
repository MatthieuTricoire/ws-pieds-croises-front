import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';
import { SubscriptionValidation, UserSubscription } from '../../shared/models/user-subscription';

@Injectable({
  providedIn: 'root',
})
export class UserSubscriptionService {
  private apiUrl = 'http://localhost:8080/user-subscriptions';
  private http = inject(HttpClient);

  getUserSubscriptions(userId: number): Observable<UserSubscription[]> {
    return this.http.get<UserSubscription[]>(`${this.apiUrl}/user/${userId}`, {
      withCredentials: true,
    });
  }

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

  validateSubscriptionForCourse(userId: number): Observable<SubscriptionValidation> {
    return this.getUserActiveSubscription(userId).pipe(
      map((subscription) => {
        if (!subscription) {
          return {
            isValid: false,
            canRegister: false,
            reason: 'Aucun abonnement actif trouvé',
          };
        }

        return {
          isValid: true,
          canRegister: true,
          weeklyLimit: subscription.subscription.sessionPerWeek,
        };
      }),
      catchError(() =>
        of({
          isValid: false,
          canRegister: false,
          reason: "Erreur lors de la vérification de l'abonnement",
        }),
      ),
    );
  }

  getWeeklyRegistrationsCount(userId: number, courseDate: Date): Observable<number> {
    const courseDateParam = courseDate.toISOString().split('T')[0];

    return this.http
      .get<number>(`http://localhost:8080/courses/user/${userId}/weekly-count`, {
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

  // private getStartOfWeek(date: Date): Date {
  //   const startOfWeek = new Date(date);
  //   const day = startOfWeek.getDay();
  //   const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  //   startOfWeek.setDate(diff);
  //   startOfWeek.setHours(0, 0, 0, 0);
  //   return startOfWeek;
  // }

  // private getEndOfWeek(date: Date): Date {
  //   const endOfWeek = new Date(this.getStartOfWeek(date));
  //   endOfWeek.setDate(endOfWeek.getDate() + 6);
  //   endOfWeek.setHours(23, 59, 59, 999);
  //   return endOfWeek;
  // }
}
