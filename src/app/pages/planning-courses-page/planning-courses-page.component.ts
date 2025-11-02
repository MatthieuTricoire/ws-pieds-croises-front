import { Component, inject } from '@angular/core';
import { PlusIcon, LucideAngularModule } from 'lucide-angular';
import { ModalService } from '../../chore/services/modal.service';
import { CourseCreationFormComponent } from '../../shared/components/forms/couse-creation-form/course-creation-form.component';
import { AdminCoursesListComponent } from '../../shared/components/admin-courses-list/admin-courses-list.component';
import { TypographyComponent } from '../../shared/components/design-system/typography/typography.component';

@Component({
  selector: 'app-planning-courses-page',
  imports: [
    LucideAngularModule,
    CourseCreationFormComponent,
    AdminCoursesListComponent,
    TypographyComponent,
  ],
  templateUrl: './planning-courses-page.component.html',
})
export class PlanningCoursesPageComponent {
  readonly plusIcon = PlusIcon;
  #modalService = inject(ModalService);

  openCreateCourseModal() {
    this.#modalService.show('create-course-modal');
  }
}
