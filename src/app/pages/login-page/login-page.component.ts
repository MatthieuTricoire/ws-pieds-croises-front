import { Component } from '@angular/core';
import { LoginFormComponent } from '../../shared/components/forms/login-form/login-form.component';
import { TwoColumnsLayoutComponent } from '../../shared/components/layouts/two-columns-layout/two-columns-layout.component';

@Component({
  selector: 'app-login-page',
  imports: [LoginFormComponent, TwoColumnsLayoutComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {}
