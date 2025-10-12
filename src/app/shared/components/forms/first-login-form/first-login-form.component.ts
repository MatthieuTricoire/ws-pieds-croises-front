import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { passwordsMatchValidator, passwordValidator } from '../../../validators/validators';
import { InputComponent } from '../../design-system/input/input.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../chore/services/auth.service';
import { ToastService } from '../../../../chore/services/toast.service';
import { finalize } from 'rxjs';

interface FirstLoginForm {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-first-login-form',
  imports: [InputComponent, ReactiveFormsModule],
  templateUrl: './first-login-form.component.html',
})
export class FirstLoginFormComponent implements OnInit {
  registrationToken?: string;
  isLoading = false;
  #fb = inject(FormBuilder);
  firstLoginForm = this.#fb.group<FirstLoginForm>(
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
    if (this.firstLoginForm.valid && this.registrationToken) {
      const { password } = this.firstLoginForm.getRawValue();
      this.isLoading = true;
      this.#authService
        .firstLogin(password, this.registrationToken)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: () => {
            this.#router.navigate(['/login']);
            this.#toastService.show('info', 'Votre mot de passe a été mis à jour avec succès.', '');
          },
          error: (error) => {
            this.#toastService.show('error', 'Une erreur est survenue.', '');
          },
        });
    }
  }

  ngOnInit() {
    this.#route.queryParams.subscribe((params) => {
      this.registrationToken = params['token'];
    });
  }
}
