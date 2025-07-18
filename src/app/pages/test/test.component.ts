
import { Component, inject } from '@angular/core';
import { AuthService } from '../../chore/services/auth.service';
import { MessagesContainerComponent } from '../../shared/components/messages-container/messages-container.component';
import { CourseListComponent } from '../../shared/components/course-list/course-list.component';

@Component({
  selector: 'app-test',
  imports: [MessagesContainerComponent, CourseListComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {
  #authService = inject(AuthService);

  logOut() {
    this.#authService.logout();
  }
}
