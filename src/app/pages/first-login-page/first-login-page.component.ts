import { Component } from '@angular/core';
import { TwoColumnsLayoutComponent } from '../../shared/components/layouts/two-columns-layout/two-columns-layout.component';
import { FirstLoginFormComponent } from '../../shared/components/forms/first-login-form/first-login-form.component';

@Component({
  selector: 'app-first-login',
  imports: [TwoColumnsLayoutComponent, FirstLoginFormComponent],
  templateUrl: './first-login-page.component.html',
})
export class FirstLoginComponent {
  userName = "nom de l'utilisateur";
}
