import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../chore/services/auth.service';
import { MessagesContainerComponent } from '../../shared/components/messages-container/messages-container.component';
import { JsonPipe } from '@angular/common';
import { TypographyComponent } from '../../shared/components/design-system/typography/typography.component';
import {CourseListComponent} from '../../shared/components/course-list/course-list.component';

@Component({
  selector: 'app-test',
  imports: [MessagesContainerComponent, TypographyComponent, CourseListComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {
  #authService = inject(AuthService);
  // Utiliser computed() pour créer des signaux dérivés qui se mettent à jour automatiquement
  isAdmin = computed(() => this.#authService.isAdminSignal());
  user = computed(() => this.#authService.userSignal());

  logOut() {
    this.#authService.logout().subscribe();
  }
}
