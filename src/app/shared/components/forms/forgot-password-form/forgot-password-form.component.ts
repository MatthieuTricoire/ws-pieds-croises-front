import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { strictEmailValidator } from '../../../validators/validators';
import { AuthService } from '../../../../chore/services/auth.service';
import { ToastService } from '../../../../chore/services/toast.service';
import { AlertCircle, CircleCheck } from 'lucide-angular';
import { InputComponent } from '../../design-system/input/input.component';
import { finalize } from 'rxjs';

interface ForgotPasswordForm {
  email: FormControl<string>;
}

@Component({
  selector: 'app-forgot-password-form',
  imports: [InputComponent, ReactiveFormsModule],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.css',
})
export class ForgotPasswordFormComponent {
  isLoading = false;
  #fb = inject(FormBuilder);
  forgotPasswordForm = this.#fb.group<ForgotPasswordForm>({
    email: this.#fb.nonNullable.control<string>('', [Validators.required, strictEmailValidator]),
  });
  #authService = inject(AuthService);
  #toastService = inject(ToastService);

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const { email } = this.forgotPasswordForm.getRawValue();

      this.#authService
        .askNewPassword(email)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          error: () => {
            this.#toastService.show(
              'error',
              "Une erreur inattendue s'est produite. Veuillez réessayer.",
              'Erreur de connexion',
              AlertCircle,
            );
          },
          complete: () => {
            this.#toastService.show(
              'info',
              "Un lien pour réinitialiser votre mot de passe vous sera envoyé si l'email existe.",
              '',
              CircleCheck,
            );
          },
        });
    }
  }
}
