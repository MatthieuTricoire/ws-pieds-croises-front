import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../chore/services/user.service';
import { ModalService } from '../../../chore/services/modal.service';
import { NgClass } from '@angular/common';
import { Check, Edit, LucideAngularModule, PlusIcon, Trash, X } from 'lucide-angular';
import { AuthUser } from '../../models/authUser';
import { UserSubscription } from '../../models/user-subscription';
import { UserCreationFormComponent } from '../forms/user-creation-form/user-creation-form.component';
import { SubscriptionService } from '../../../chore/services/subscription.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-users-table',
  imports: [NgClass, LucideAngularModule, UserCreationFormComponent, ReactiveFormsModule],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css',
})
export class UsersTableComponent implements OnInit {
  readonly plusIcon = PlusIcon;
  readonly trashIcon = Trash;
  readonly editIcon = Edit;
  readonly checkIcon = Check;
  readonly xIcon = X;

  #userService = inject(UserService);
  #modalService = inject(ModalService);
  #subscriptionService = inject(SubscriptionService);

  allUsers = this.#userService.users;
  availableSubscriptions = this.#subscriptionService.availableSubscriptions;
  searchTerm = signal<string>('');

  editingUserId = signal<number | null>(null);
  editForm = new FormGroup({
    firstname: new FormControl<string>('', [Validators.required, Validators.minLength(1)]),
    lastname: new FormControl<string>('', [Validators.required, Validators.minLength(1)]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone: new FormControl<string>('', [Validators.required, Validators.minLength(1)]),
  });

  users = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.allUsers();

    return this.allUsers().filter(
      (user) =>
        user.firstname.toLowerCase().includes(term) ||
        user.lastname.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        this.getRoleLabel(user.roles).toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.#userService.loadAllUsers().subscribe();
    this.#subscriptionService.getAllSubscriptions().subscribe((subscriptions) => {
      this.#subscriptionService.availableSubscriptions.set(subscriptions);
    });
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  getRoleLabel(roles: string[]) {
    if (roles.includes('ROLE_ADMIN')) return 'Admin';
    if (roles.includes('ROLE_COACH')) return 'Coach';
    return 'Utilisateur';
  }

  getRoleBadgeClass(roles: string[]) {
    if (roles.includes('ROLE_ADMIN')) return 'badge-error';
    if (roles.includes('ROLE_COACH')) return 'badge-warning';
    return 'badge-primary';
  }

  getActiveSubscription(user: AuthUser): UserSubscription | null {
    if (!user.userSubscriptions) return null;

    const now = new Date();
    const found = user.userSubscriptions.find((sub) => {
      const endDate = new Date(sub.endDate);
      return endDate >= now;
    });

    return found || null;
  }

  getSubscriptionStatusText(subscription: UserSubscription | null): string {
    if (!subscription) return 'Aucun abonnement';
    return this.isSubscriptionActive(subscription) ? 'Actif' : 'Expiré';
  }

  getSubscriptionStatusBadge(subscription: UserSubscription | null): string {
    if (!subscription) return 'badge-neutral';
    return this.isSubscriptionActive(subscription) ? 'badge-success' : 'badge-error';
  }

  isSubscriptionActive(subscription: UserSubscription | null): boolean {
    if (!subscription) return false;
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    return endDate >= now;
  }

  openCreateUserModal() {
    this.#modalService.show('create-user-modal');
  }

  async confirmDeleteUser(user: AuthUser) {
    const confirmed = await this.#modalService.confirmDelete(
      'Suppression utilisateur',
      `Êtes-vous sûr de vouloir supprimer l'utilisateur : ${user.firstname} ${user.lastname} ?`,
    );
    if (confirmed) {
      this.#userService.deleteUser(user.id).subscribe({
        next: () => {
          this.#userService.loadAllUsers().subscribe();
        },
        error: (err) => {
          console.error('Error during deleting user', err);
        },
      });
    }
  }

  startEdit(user: AuthUser) {
    this.editingUserId.set(user.id);
    this.editForm.patchValue({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
    });
  }

  cancelEdit() {
    this.editingUserId.set(null);
    this.editForm.reset();
  }

  saveEdit() {
    if (this.editForm.valid && this.editingUserId()) {
      this.#userService
        .updateUser(this.editingUserId()!, this.editForm.getRawValue() as Partial<AuthUser>)
        .subscribe({
          next: () => this.cancelEdit(),
          error: (err) => console.error('Error:', err),
        });
    }
  }

  async changeUserSubscription(user: AuthUser, newSubscriptionId: string) {
    if (newSubscriptionId === 'none') {
      const activeSubscription = this.getActiveSubscription(user);
      if (activeSubscription) {
        const confirmed = await this.#modalService.confirmDelete(
          'Suppression abonnement',
          `Êtes-vous sûr de vouloir supprimer l'abonnement de ${user.firstname} ${user.lastname} ?`,
        );
        if (confirmed) {
          this.#subscriptionService.deleteUserSubscription(activeSubscription.id).subscribe({
            next: () => this.#userService.loadAllUsers().subscribe(),
            error: (err) => console.error('Error deleting subscription:', err),
          });
        }
      }
    } else if (newSubscriptionId && newSubscriptionId !== '') {
      const subscriptionId = parseInt(newSubscriptionId);
      this.#subscriptionService.createUserSubscriptionForUser(user.id, subscriptionId).subscribe({
        next: () => this.#userService.loadAllUsers().subscribe(),
        error: (err) => console.error('Error creating subscription:', err),
      });
    }
  }
}
