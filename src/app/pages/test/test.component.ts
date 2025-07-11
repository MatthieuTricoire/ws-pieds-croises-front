import { Component, inject } from '@angular/core';
import { AuthService } from '../../chore/services/auth.service';

@Component({
  selector: 'app-test',
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {
  #authService = inject(AuthService);

  logOut() {
    this.#authService.logout();
  }
}
