import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../chore/services/user.service';
import { SubscriptionService } from '../../../../chore/services/subscription.service';
import { ModalService } from '../../../../chore/services/modal.service';
import { Subscription } from '../../../models/user-subscription';
import { ToastService } from '../../../../chore/services/toast.service';

@Component({
  selector: 'app-user-creation-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-creation-form.component.html',
  styleUrl: './user-creation-form.component.css',
})
export class UserCreationFormComponent implements OnInit {
  #fb = inject(FormBuilder);
  #userService = inject(UserService);
  #subscriptionService = inject(SubscriptionService);
  #modalService = inject(ModalService);
  #toastService = inject(ToastService);

  isLoading = signal(false);
  subscriptions = signal<Subscription[]>([]);

  userForm: FormGroup = this.#fb.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    roles: [['ROLE_USER']],
    subscriptionId: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.#subscriptionService.getAllSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions.set(subscriptions);
      },
      error: (err) => console.log('Error fetching subscriptions:', err),
    });
  }

  async onSubmit() {
    if (this.userForm.valid) {
      this.isLoading.set(true);
    }
    const userData = this.userForm.getRawValue();
    this.#userService.createUser(userData).subscribe({
      next: (newUser) => {
        this.#toastService.show(
          'success',
          `Un email vient d'être envoyé à ${newUser.email}`,
          "Création de l'utilisateur",
        );
        this.#userService.loadAllUsers().subscribe();
      },
      error: () => {
        this.#toastService.show('error', "Erreur durant la création de l'utilisateur");
      },
      complete: () => {
        this.closeModal();
        this.isLoading.set(false);
      },
    });
  }

  closeModal() {
    this.#modalService.close('create-user-modal');
  }
}
