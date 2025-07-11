import { Component } from '@angular/core';
import { FirstLoginFormComponent } from '../../shared/components/first-login-form/first-login-form.component';

@Component({
  selector: 'app-first-login',
  imports: [FirstLoginFormComponent],
  templateUrl: './first-login-page.component.html',
  styleUrl: './first-login-page.component.css',
})
export class FirstLoginComponent {}
