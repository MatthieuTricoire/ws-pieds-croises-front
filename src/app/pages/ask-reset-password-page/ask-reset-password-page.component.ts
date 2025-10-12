import { Component } from '@angular/core';
import { TwoColumnsLayoutComponent } from '../../shared/components/layouts/two-columns-layout/two-columns-layout.component';
import { ForgotPasswordFormComponent } from '../../shared/components/forms/forgot-password-form/forgot-password-form.component';

@Component({
  selector: 'app-forgotten-password',
  imports: [TwoColumnsLayoutComponent, ForgotPasswordFormComponent],
  templateUrl: './ask-reset-password-page.component.html',
})
export class AskResetPasswordPageComponent {}
