import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { passwordsMatchValidator, passwordValidator } from '../../validators/validators';
import { InputComponent } from '../design-system/input/input.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../chore/services/auth.service';
import { ToastService } from '../../../chore/services/toast.service';

interface FirstLoginForm {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-first-login-form',
  imports: [InputComponent, ReactiveFormsModule],
  templateUrl: './first-login-form.component.html',
  styleUrl: './first-login-form.component.css',
})
export class FirstLoginFormComponent implements OnInit {
  registrationToken?: string;
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
      console.log(password, this.registrationToken);
      this.#authService.firstLogin(password, this.registrationToken).subscribe({
        next: () => {
          this.#router.navigate(['/login']);
          this.#toastService.show('info', 'Votre mot de passe a été mis à jour avec succès.', '');
        },
        error: (error) => {
          console.error('Error:', error);
          // Gérez les erreurs ici, par exemple, affichez un message d'erreur à l'utilisateur
        },
      });
    }
  }

  ngOnInit() {
    this.#route.queryParams.subscribe((params) => {
      this.registrationToken = params['token'];
      console.log(this.registrationToken);
    });
  }
}
