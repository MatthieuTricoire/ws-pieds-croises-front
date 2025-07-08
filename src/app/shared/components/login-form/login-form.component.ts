import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../chore/services/auth.service';
import { AlertCircle, CircleCheck, LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../chore/services/toast.service';
import { InputComponent } from '../design-system/input/input.component';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, LucideAngularModule, InputComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  #fb = inject(FormBuilder);
  loginForm = this.#fb.group({
    email: this.#fb.nonNullable.control('', [Validators.required]),
    password: this.#fb.nonNullable.control('', [Validators.required]),
  });
  #authService = inject(AuthService);
  #toastService = inject(ToastService);

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();

      this.#authService.login(email, password).subscribe({
        next: () => this.#toastService.show('success', 'Connexion réussi!', '', CircleCheck),
        error: (error) => {
          console.log(error);
          this.#toastService.show(
            'error',
            "Quelque chose s'est mal passé",
            'Erreur de connexion',
            AlertCircle,
          );
        },
      });
    }
  }
}
