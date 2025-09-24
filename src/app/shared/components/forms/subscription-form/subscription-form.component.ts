import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../../chore/services/subscription.service';
import { ModalService } from '../../../../chore/services/modal.service';
import { Subscription } from '../../../models/user-subscription';
import { ToastService } from '../../../../chore/services/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subscription-form',
  imports: [ReactiveFormsModule],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.css',
})
export class SubscriptionFormComponent {
  #fb = inject(FormBuilder);
  #subscriptionService = inject(SubscriptionService);
  #modalService = inject(ModalService);
  #toastService = inject(ToastService);

  isLoading = signal(false);
  subscriptionToEdit = input<Subscription | null>(null);

  subscriptionForm = this.#fb.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    sessionPerWeek: [1, [Validators.required, Validators.min(1)]],
    freezeDaysAllowed: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    effect(() => {
      const subscription = this.subscriptionToEdit();
      console.log('Effect triggered with subscription:', subscription);

      if (subscription) {
        console.log('Patching form with values');
        this.subscriptionForm.patchValue({
          name: subscription.name,
          price: subscription.price,
          sessionPerWeek: subscription.sessionPerWeek || 1,
          freezeDaysAllowed: subscription.freezeDaysAllowed,
        });
      } else {
        // Reset le formulaire quand null
        this.subscriptionForm.reset({
          name: '',
          price: 0,
          sessionPerWeek: 1,
          freezeDaysAllowed: 0,
        });
      }
    });
  }

  async onSubmit() {
    if (!this.subscriptionForm.valid) return;

    this.isLoading.set(true);

    const formData = this.subscriptionForm.getRawValue();
    const subscriptionData = {
      name: formData.name ?? undefined,
      price: formData.price ?? undefined,
      sessionPerWeek: formData.sessionPerWeek ?? undefined,
      freezeDaysAllowed: formData.freezeDaysAllowed ?? undefined,
      duration: 31, // Durée fixée à 31 jours
    };

    const operation$: Observable<Subscription> = this.subscriptionToEdit()
      ? this.#subscriptionService.updateSubscription(
          this.subscriptionToEdit()!.id,
          subscriptionData,
        )
      : this.#subscriptionService.createSubscription(subscriptionData);

    operation$.subscribe({
      next: (subscription) => {
        const action = this.subscriptionToEdit() ? 'modifié' : 'créé';
        this.#toastService.show(
          'success',
          `L'abonnement "${subscription.name}" a été ${action} avec succès`,
        );
        // Recharger la liste des abonnements si nécessaire
        this.#subscriptionService.getAllSubscriptions().subscribe();
      },
      error: (error) => {
        console.error('Erreur:', error);
        const action = this.subscriptionToEdit() ? 'modification' : 'création';
        let errorMessage = `Erreur lors de la ${action} de l'abonnement`;
        if (error.status === 409) {
          errorMessage =
            'Un nouvel abonnement ne peut pas avoir un nom, ou un prix identique à un abonnement existant.';
        }
        this.#toastService.show('error', errorMessage);
        this.isLoading.set(false);
      },
      complete: () => {
        this.closeModal();
        this.isLoading.set(false);
      },
    });
  }

  closeModal() {
    this.#modalService.close('subscription-modal');
    this.subscriptionForm.reset();
  }
}
