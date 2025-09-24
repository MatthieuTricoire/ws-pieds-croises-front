import { Component, inject, input } from '@angular/core';
import { Subscription as AppSubscription, UserSubscription } from '../../models/user-subscription';
import { SubscriptionService } from '../../../chore/services/subscription.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  imports: [CommonModule],
})
export class SubscriptionCardComponent {
  subscription = input.required<AppSubscription>();
  userSubscription = input<UserSubscription | null>(null);
  isCurrentSubscription = input(false);

  subscriptionService = inject(SubscriptionService);

  onSubscribe() {
    this.subscriptionService.createUserSubscription(this.subscription().id).subscribe();
  }

  onCancel() {
    const userSubscription = this.userSubscription();
    if (!userSubscription) return;
    this.subscriptionService.deleteUserSubscription(userSubscription?.id).subscribe();
  }
}
