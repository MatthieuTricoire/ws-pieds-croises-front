import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../../chore/services/subscription.service';
import { TypographyComponent } from '../design-system/typography/typography.component';
import { UserSubscriptionCardComponent } from '../user-subscription-card/user-subscription-card.component';
@Component({
  selector: 'app-subscriptions-list',
  templateUrl: './subscriptions-list.component.html',
  imports: [CommonModule, UserSubscriptionCardComponent, TypographyComponent],
})
export class SubscriptionsListComponent implements OnInit {
  subscriptionService = inject(SubscriptionService);

  isCurrentSubscription(subscriptionId: number): boolean {
    const current = this.subscriptionService.userSubscription();
    return current?.subscriptionId === subscriptionId;
  }

  ngOnInit(): void {
    this.subscriptionService.getActiveUserSubscription();
    this.subscriptionService.getAllSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptionService.availableSubscriptions.set(subscriptions);
      },
    });
  }
}
