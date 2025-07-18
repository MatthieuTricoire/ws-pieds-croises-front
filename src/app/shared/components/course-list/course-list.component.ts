import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../chore/services/course.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Course } from '../../models/course';
import { CourseCardComponent } from '../course-card/course-card.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  imports: [CommonModule, CourseCardComponent, CourseCardComponent],
})
export class CourseListComponent {
  private courseService = inject(CourseService);
  readonly courses = signal<Course[]>([]);

  constructor() {
    this.courseService
      .getCoursesNextTwoWeeks()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        this.courses.set(data.slice(0, 3));
      });
  }
}
