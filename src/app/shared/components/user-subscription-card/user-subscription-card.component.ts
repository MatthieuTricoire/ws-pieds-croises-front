import { Component, inject, input, output } from '@angular/core';
import { Subscription, UserSubscription } from '../../models/user-subscription';
import { SubscriptionService } from '../../../chore/services/subscription.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-subscription-card',
  templateUrl: './user-subscription-card.component.html',
  imports: [CommonModule],
})
export class UserSubscriptionCardComponent {
  mode = input<'user' | 'admin'>('user');
  subscription = input.required<Subscription>();
  userSubscription = input<UserSubscription | null>(null);
  isCurrentSubscription = input(false);

  editAction = output<Subscription>();
  deleteAction = output<Subscription>();

  subscriptionService = inject(SubscriptionService);

  onSubscribe() {
    this.subscriptionService.createUserSubscription(this.subscription().id).subscribe();
  }

  onCancel() {
    const userSubscription = this.userSubscription();
    if (!userSubscription) return;
    this.subscriptionService.deleteUserSubscription(userSubscription?.id).subscribe();
  }

  onDelete() {
    this.deleteAction.emit(this.subscription());
  }

  onEdit() {
    this.editAction.emit(this.subscription());
  }
}
