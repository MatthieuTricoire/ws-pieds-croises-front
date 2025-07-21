import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../../chore/services/subscription.service';
import { UserSubscription } from '../../models/subscription';
import { SubscriptionCardComponent } from '../subscription-card/subscription-card.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-subscriptions-list',
  templateUrl: './subscriptions-list.component.html',
  imports: [CommonModule, SubscriptionCardComponent],
})
export class SubscriptionsListComponent {
  private subscriptionService = inject(SubscriptionService);
  readonly userSubscriptions = signal<UserSubscription[]>([]);

  constructor() {
    this.subscriptionService
      .getUserSubscriptions()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        this.userSubscriptions.set(data);
      });
  }
}
