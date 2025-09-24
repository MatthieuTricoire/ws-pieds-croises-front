import { Component, inject, OnInit, signal } from '@angular/core';
import { SubscriptionService } from '../../chore/services/subscription.service';
import { UserSubscriptionCardComponent } from '../../shared/components/user-subscription-card/user-subscription-card.component';
import { SubscriptionFormComponent } from '../../shared/components/forms/subscription-form/subscription-form.component';
import { ModalService } from '../../chore/services/modal.service';
import { Subscription } from '../../shared/models/user-subscription';
import { ToastService } from '../../chore/services/toast.service';
import { TypographyComponent } from '../../shared/components/design-system/typography/typography.component';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-subscriptions-page',
  imports: [
    UserSubscriptionCardComponent,
    SubscriptionFormComponent,
    TypographyComponent,
    LucideAngularModule,
  ],
  templateUrl: './subscriptions-page.component.html',
  styleUrl: './subscriptions-page.component.css',
})
export class SubscriptionsPageComponent implements OnInit {
  protected readonly Plus = Plus;

  subscriptionService = inject(SubscriptionService);
  modalService = inject(ModalService);
  toastService = inject(ToastService);
  selectedSubscription = signal<Subscription | null>(null);

  ngOnInit(): void {
    this.subscriptionService.getAllSubscriptions().subscribe();
  }

  onEditSubscription(subscription: Subscription) {
    this.selectedSubscription.set(null);
    setTimeout(() => {
      this.selectedSubscription.set(subscription);
      this.modalService.show('subscription-modal');
    }, 0);
  }

  async onDeleteSubscription(subscription: Subscription) {
    const confirmed = await this.modalService.confirmDelete(
      "Supprimer l'abonnement",
      `Êtes-vous sûr de vouloir supprimer l'abonnement "${subscription.name} ?`,
    );
    if (confirmed) {
      this.subscriptionService.deleteSubscription(subscription.id).subscribe({
        next: () => {
          this.toastService.show(
            'success',
            `L'abonnement "${subscription.name}" a été supprimé avec succès`,
          );
        },
        error: (error) => {
          console.error('Error during deleting subscription', error);
          this.toastService.show('error', "Erreur lors de la suppression de l'abonnement");
        },
      });
    }
  }

  onCreateSubscription() {
    this.selectedSubscription.set(null);
    this.modalService.show('subscription-modal');
  }
}
