import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../../chore/services/subscription.service';
import { Subscription as AppSubscription, UserSubscription } from '../../models/subscription';
import { SubscriptionCardComponent } from '../subscription-card/subscription-card.component';

@Component({
  selector: 'app-subscriptions-list',
  templateUrl: './subscriptions-list.component.html',
  imports: [CommonModule, SubscriptionCardComponent],
})
export class SubscriptionsListComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);

  subscriptions: AppSubscription[] = [];
  userSubscriptions: UserSubscription[] = [];

  ngOnInit(): void {
    this.subscriptionService.getAllSubscriptions().subscribe({
      next: (subscriptions) => (this.subscriptions = subscriptions),
      error: (err) => console.error(err),
    });

    this.subscriptionService.getUserSubscriptions().subscribe({
      next: (userSubs) => (this.userSubscriptions = userSubs),
      error: (err) => console.error(err),
    });
  }

  /** Récupère l'abonnement utilisateur correspondant à un abonnement donné */
  getUserSubscription(sub: AppSubscription): UserSubscription | undefined {
    return this.userSubscriptions.find((us) => us.subscriptionId === sub.id);
  }
}
