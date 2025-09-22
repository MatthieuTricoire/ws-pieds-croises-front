import { Component, inject } from '@angular/core';
import { LogOut, LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../chore/services/auth.service';
import { TypographyComponent } from '../design-system/typography/typography.component';
import { BoxService } from '../../../chore/services/box.service';

@Component({
  selector: 'app-mobile-header',
  imports: [LucideAngularModule, TypographyComponent],
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.css',
})
export class MobileHeaderComponent {
  #authService = inject(AuthService);
  #boxService = inject(BoxService);

  userName = `${this.#authService.userSignal()?.firstname} ${this.#authService.userSignal()?.lastname}`;
  boxName = this.#boxService.boxSignal()?.name;

  logOut() {
    this.#authService.logout().subscribe();
  }

  protected readonly LogOut = LogOut;
}
