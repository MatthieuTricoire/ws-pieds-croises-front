import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../chore/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../../chore/services/toast.service';
import { InputComponent } from '../../design-system/input/input.component';
import { RouterLink } from '@angular/router';
import { strictEmailValidator } from '../../../validators/validators';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, LucideAngularModule, InputComponent, RouterLink],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  #fb = inject(FormBuilder);
  loginForm = this.#fb.group<LoginForm>({
    email: this.#fb.nonNullable.control<string>('', [Validators.required, strictEmailValidator]),
    password: this.#fb.nonNullable.control<string>('', [Validators.required]),
  });
  #authService = inject(AuthService);
  #toastService = inject(ToastService);

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();

      this.#authService.login(email, password).subscribe({
        next: () => {
          this.#toastService.show('success', 'Connexion réussi!', '');
        },
        error: (error) => {
          if (error.status >= 400 && error.status < 500) {
            this.#toastService.show(
              'error',
              'Email ou mot de passe incorrect.',
              'Erreur de connexion',
            );
          } else {
            this.#toastService.show('error', 'Une erreur est survenue.', '');
          }
        },
      });
    }
  }
}
