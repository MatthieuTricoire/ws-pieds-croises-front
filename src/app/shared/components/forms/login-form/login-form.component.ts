import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../chore/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../../chore/services/toast.service';
import { InputComponent } from '../../design-system/input/input.component';
import { Router, RouterLink } from '@angular/router';
import { strictEmailValidator } from '../../../validators/validators';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, LucideAngularModule, InputComponent, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  #fb = inject(FormBuilder);
  loginForm = this.#fb.group<LoginForm>({
    email: this.#fb.nonNullable.control<string>('', [Validators.required, strictEmailValidator]),
    password: this.#fb.nonNullable.control<string>('', [Validators.required]),
  });
  #authService = inject(AuthService);
  #toastService = inject(ToastService);
  #router = inject(Router);

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();

      this.#authService.login(email, password).subscribe({
        next: () => {
          void this.#router.navigate(['/test']);
          this.#toastService.show('success', 'Connexion réussi!', '');
        },
        error: (error) => {
          if (error.status === 401) {
            this.#toastService.show(
              'error',
              'Email ou mot de passe incorrect.',
              'Erreur de connexion',
            );
          } else {
            this.#toastService.show(
              'error',
              "Une erreur inattendue s'est produite. Veuillez réessayer.",
              'Erreur de connexion',
            );
          }
        },
      });
    }
  }
}
