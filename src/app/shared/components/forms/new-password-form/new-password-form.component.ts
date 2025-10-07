import { Component, inject, OnInit } from '@angular/core';
import { InputComponent } from '../../design-system/input/input.component';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { passwordsMatchValidator, passwordValidator } from '../../../validators/validators';
import { ToastService } from '../../../../chore/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../chore/services/auth.service';
import { finalize } from 'rxjs';

interface NewPasswordForm {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-new-password-form',
  imports: [InputComponent, ReactiveFormsModule],
  templateUrl: './new-password-form.component.html',
  styleUrl: './new-password-form.component.css',
})
export class NewPasswordFormComponent implements OnInit {
  resetPasswordToken?: string;
  isLoading = false;
  #fb = inject(FormBuilder);
  NewPasswordForm = this.#fb.group<NewPasswordForm>(
    {
      password: this.#fb.nonNullable.control<string>('', [passwordValidator]),
      confirmPassword: this.#fb.nonNullable.control<string>('', []),
    },
    { validators: passwordsMatchValidator },
  );
  #toastService = inject(ToastService);
  #router = inject(Router);
  #authService = inject(AuthService);
  #route = inject(ActivatedRoute);

  onSubmit() {
    if (this.NewPasswordForm.valid && this.resetPasswordToken) {
      this.isLoading = true;
      const { password } = this.NewPasswordForm.getRawValue();
      this.#authService
        .resetPassword(this.resetPasswordToken, password)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: () => {
            void this.#router.navigate(['/login']);
            this.#toastService.show('info', 'Votre mot de passe a été mis à jour avec succès.', '');
          },
          error: (error) => {
            this.#toastService.show(
              'error',
              'Une erreur est survenue lors de la mise à jour du mot de passe.',
              '',
            );
            console.error('Error:', error);
          },
        });
    }
  }

  ngOnInit() {
    this.#route.queryParams.subscribe((params) => {
      this.resetPasswordToken = params['token'];
    });
  }
}
