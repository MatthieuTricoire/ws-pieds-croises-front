import { Component, computed, inject, input, output } from '@angular/core';
import { Subscription as AppSubscription, UserSubscription } from '../../models/subscription';
import { DatePipe, NgClass } from '@angular/common';
import { SubscriptionService } from '../../../chore/services/subscription.service';

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  imports: [DatePipe, NgClass],
})
export class SubscriptionCardComponent {
  subscriptionSignal = input.required<AppSubscription>();
  userSubscriptionSignal = input<UserSubscription | null>(null);

  private subscriptionService = inject(SubscriptionService);

  userSubscriptionChange = output<UserSubscription | null>();

  isActive = computed(() => {
    const userSubscription = this.userSubscriptionSignal();
    if (!userSubscription || userSubscription?.subscriptionId != this.subscriptionSignal().id)
      return false;
    const now = new Date();
    const start = new Date(userSubscription.startDate);
    const end = new Date(userSubscription.endDate);
    return start <= now && now <= end;
  });

  onSubscribe() {
    const subscription = this.subscriptionSignal();
    this.subscriptionService.createUserSubscription(subscription.id).subscribe({
      next: (newUserSub) => {
        this.userSubscriptionChange.emit(newUserSub); // ⚡ parent met à jour
        console.log(newUserSub);
      },
      error: (err) => console.error('Erreur lors de la souscription', err),
    });
  }

  onCancel() {
    const userSub = this.userSubscriptionSignal();
    if (!userSub) return;
    this.subscriptionService.deleteUserSubscription(userSub.id).subscribe({
      next: () => {
        this.userSubscriptionChange.emit(userSub); // ⚡ parent met à jour
        console.log(userSub);
      }, // reset
      error: (err) => console.error('Erreur suppression', err),
    });
  }
}
