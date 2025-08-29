import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../chore/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Course } from '../../models/course';
import { CourseCardComponent } from '../course-card/course-card.component';
import { TypographyComponent } from '../design-system/typography/typography.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  imports: [CommonModule, CourseCardComponent, CourseCardComponent, TypographyComponent],
})
export class CourseListComponent {
  #courseService = inject(UserService);
  readonly courses = signal<Course[]>([]);

  constructor() {
    this.#courseService
      .getUserCourses()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        this.courses.set(data.slice(0, 3));
      });
  }
}
