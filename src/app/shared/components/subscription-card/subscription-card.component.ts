import { Component, input } from '@angular/core';
import { UserSubscription } from '../../models/subscription';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  imports: [DatePipe, NgClass],
})
export class SubscriptionCardComponent {
  readonly userSubscription = input.required<UserSubscription>();

  get isActive(): boolean {
    const now = new Date();
    const start = new Date(this.userSubscription().startDate);
    const end = new Date(this.userSubscription().endDate);
    return start <= now && now <= end;
  }
}
