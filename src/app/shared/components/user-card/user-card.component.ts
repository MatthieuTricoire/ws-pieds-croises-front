import { Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, SquarePen, Trash, UserPen } from 'lucide-angular';
import { AuthService } from '../../../chore/services/auth.service';
import { SubscriptionService } from '../../../chore/services/subscription.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../chore/services/user.service';
import { AuthUser } from '../../models/authUser';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  imports: [LucideAngularModule, DatePipe, ReactiveFormsModule],
  standalone: true,
})
export class UserCardComponent implements OnInit {
  isEditing = signal(false);
  isSaving = signal(false);
  profileForm!: FormGroup;
  selectedFile: File | null = null;
  errorMessage: string | null = null;
  maxFileSize = 2 * 1024 * 1024; // 2 Mo
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  @ViewChild('deleteModal') deleteModal!: ElementRef<HTMLDialogElement>;
  protected readonly UserPen = UserPen;
  protected readonly SquarePen = SquarePen;
  protected readonly Trash = Trash;
  protected readonly AuthService = AuthService;
  #authService = inject(AuthService);
  user = computed(() => this.#authService.userSignal());
  #subscriptionService = inject(SubscriptionService);
  userSubscriptionSignal = computed(() => this.#subscriptionService.userSubscription());
  #fb = inject(FormBuilder);
  #userService = inject(UserService);

  get profilePictureUrl(): string | null {
    const user = this.user();
    if (!user || !user.profilePicture) return null; // pas d'image
    return `${this.#authService.apiUrl}${user.profilePicture}`;
  }

  ngOnInit() {
    this.#subscriptionService.getActiveUserSubscription();

    // Init form avec les données actuelles
    this.profileForm = this.#fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: [''],
    });

    // Remplir le formulaire quand user() change
    if (this.user()) {
      this.populateForm();
    }
  }

  startEditing() {
    this.populateForm();
    this.isEditing.set(true);
  }

  populateForm() {
    const u = this.user();
    if (u) {
      this.profileForm.patchValue({
        firstname: u.firstname,
        lastname: u.lastname,
        phone: u.phone,
      });
    }
  }

  saveChanges() {
    if (this.profileForm.invalid) return;

    const updatedUser = { ...this.user(), ...this.profileForm.value };
    this.isSaving.set(true);

    this.#userService.updateProfile(updatedUser).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.isEditing.set(false);
      },
      error: (error) => {
        this.isSaving.set(false);
        if (error.status === 400 && error.error) {
          Object.keys(error.error).forEach((field) => {
            const control = this.profileForm.get(field);
            if (control) {
              control.setErrors({ message: error.error[field] });
            }
          });
        }
      },
    });
  }

  getUserInitials(): string {
    const user = this.user();
    if (!user) return '';
    const first = user.firstname ? user.firstname[0] : '';
    const last = user.lastname ? user.lastname[0] : '';
    return (first + last).toUpperCase();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.user()?.id) return;
    const file = input.files[0];
    // Vérifier le type
    if (!this.allowedTypes.includes(file.type)) {
      this.errorMessage = 'Seuls les fichiers JPG ou PNG sont autorisés.';
      return;
    }
    // Vérifier la taille
    if (file.size > this.maxFileSize) {
      this.errorMessage = 'La taille maximale est de 2 Mo.';
      return;
    }
    this.errorMessage = null;
    this.selectedFile = file;
    this.uploadProfilePicture();
  }

  uploadProfilePicture() {
    if (!this.selectedFile || !this.user()?.id) {
      this.errorMessage = 'Veuillez sélectionner une image valide avant de continuer.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.#userService.uploadProfilePicture(this.user()!.id, this.selectedFile).subscribe({
      next: (url) => {
        this.#authService.userSignal.set({ ...this.user()!, profilePicture: url });
      },
      error: (err) => console.error('Erreur upload', err),
    });
  }

  confirmDelete() {
    this.#userService.deleteProfilePicture().subscribe({
      next: () => {
        const currentUser = this.user();
        if (!currentUser?.id) {
          this.errorMessage = 'Impossible de mettre à jour : utilisateur non identifié';
          return;
        }

        const updatedUser: AuthUser = {
          ...currentUser,
          profilePicture: null,
        };
        this.#authService.userSignal.set(updatedUser);
        this.deleteModal.nativeElement.close(); // ferme le modal
      },
      error: () => {
        this.errorMessage = 'Impossible de supprimer la photo.';
        this.deleteModal.nativeElement.close(); // ferme le modal
      },
    });
  }

  openDeleteModal() {
    this.deleteModal.nativeElement.showModal();
  }
}
