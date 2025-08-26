import { Component, computed, input } from '@angular/core';
import { Subscription as AppSubscription, UserSubscription } from '../../models/subscription';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  imports: [DatePipe, NgClass],
})
export class SubscriptionCardComponent {
  subscriptionSignal = input.required<AppSubscription>();
  userSubscriptionSignal = input<UserSubscription>();

  readonly isActive = computed(() => {
    const userSubscription = this.userSubscriptionSignal();
    if (!userSubscription) return false;
    const now = new Date();
    const start = new Date(userSubscription.startDate);
    const end = new Date(userSubscription.endDate);
    return start <= now && now <= end;
  });
}
