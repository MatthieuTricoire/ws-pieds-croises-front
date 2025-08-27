import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../../chore/services/subscription.service';
import { Subscription as AppSubscription } from '../../models/subscription';
import { SubscriptionCardComponent } from '../subscription-card/subscription-card.component';

@Component({
  selector: 'app-subscriptions-list',
  templateUrl: './subscriptions-list.component.html',
  imports: [CommonModule, SubscriptionCardComponent],
})
export class SubscriptionsListComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);

  subscriptions: AppSubscription[] = [];
  userSubscription = this.subscriptionService.userSubscription; // <- signal

  ngOnInit(): void {
    // les abonnements disponibles (une seule fois)
    this.subscriptionService.getAllSubscriptions().subscribe({
      next: (subscriptions) => (this.subscriptions = subscriptions),
    });

    // charge les souscriptions utilisateur initiales
    this.subscriptionService.loadUserSubscription();
  }

  // getUserSubscription(sub: AppSubscription) {
  //   console.log(this.userSubscription());
  //   if (this.userSubscription().subscriptionId === sub.id) {
  //     return this.userSubscription();
  //   }
  // }
}
