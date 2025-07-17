import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SubscriptionService } from '../../../chore/services/subscription.service';
import { Subscription } from '../../models/subscription';
import { SubscriptionCardComponent } from '../subscription-card/subscription-card.component';

@Component({
  selector: 'app-subscriptions-list',
  templateUrl: './subscriptions-list.component.html',
  imports: [CommonModule, SubscriptionCardComponent],
})
export class SubscriptionsListComponent {
  private subscriptionService = inject(SubscriptionService);
  readonly subscriptions = signal<Subscription[]>([]);

  constructor() {
    this.subscriptionService
      .getUserSubscriptions(1)
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        console.log(data);
        // this.subscriptions.set(data);
      });
  }
}
