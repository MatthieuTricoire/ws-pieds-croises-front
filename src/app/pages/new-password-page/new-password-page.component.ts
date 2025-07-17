import { Component } from '@angular/core';
import { TwoColumnsLayoutComponent } from '../../shared/components/layouts/two-columns-layout/two-columns-layout.component';
import { NewPasswordFormComponent } from '../../shared/components/forms/new-password-form/new-password-form.component';

@Component({
  selector: 'app-new-password-page',
  imports: [TwoColumnsLayoutComponent, NewPasswordFormComponent],
  templateUrl: './new-password-page.component.html',
  styleUrl: './new-password-page.component.css',
})
export class NewPasswordPageComponent {}
