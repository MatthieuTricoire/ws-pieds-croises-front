import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../chore/services/auth.service';
import { MessagesContainerComponent } from '../../shared/components/messages-container/messages-container.component';
import { DayInfo } from '../../chore/services/week-selector.service';

@Component({
  selector: 'app-test',
  imports: [MessagesContainerComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {
  #authService = inject(AuthService);
  // Utiliser computed() pour créer des signaux dérivés qui se mettent à jour automatiquement
  isAdmin = computed(() => this.#authService.isAdminSignal());
  user = computed(() => this.#authService.userSignal());
  selectedDay = signal<DayInfo | undefined>(undefined);

  onDaySelected(day: DayInfo) {
    this.selectedDay.set(day);
  }

  logOut() {
    this.#authService.logout().subscribe();
  }
}
