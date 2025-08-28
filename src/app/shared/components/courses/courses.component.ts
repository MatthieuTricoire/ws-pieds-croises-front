import { Component, computed, inject, signal } from '@angular/core';
import { WeekSelectorService } from '../../../chore/services/week-selector.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CoursesService } from '../../../chore/services/courses.service';
import { of, switchMap } from 'rxjs';
import { CourseCardComponent } from '../course-card/course-card.component';
import { Course } from '../../models/course';

@Component({
  selector: 'app-courses',
  imports: [CourseCardComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  private courseService = inject(CoursesService);
  private readonly weekSelectorService = inject(WeekSelectorService);
  private readonly selectedDay = this.weekSelectorService.selectedDay;

  private baseCourses = toSignal(
    // On transforme le signal d'input en observable
    toObservable(this.selectedDay).pipe(
      // On utilise switchMap pour lancer un nouvel appel à chaque nouvelle valeur de selectedDay
      switchMap((day) => {
        // Si le jour est défini, on appelle le service
        if (day?.date) {
          return this.courseService.getCoursesByDay(day.date);
        }
        // Sinon, on retourne un observable d'un tableau vide
        return of([]);
      }),
    ),
    // Il est bon de fournir une valeur initiale pour éviter que le signal soit 'undefined'
    { initialValue: [] },
  );

  private courseUpdates = signal<Map<number, Course>>(new Map());

  courses = computed(() => {
    const base = this.baseCourses();
    const updates = this.courseUpdates();

    return base.map((course) => {
      const updatedCourse = updates.get(course.id);
      return updatedCourse || course;
    });
  });

  onCourseUpdated(updatedCourse: Course): void {
    this.courseUpdates.update((updates) => {
      const newUpdates = new Map(updates);
      newUpdates.set(updatedCourse.id, updatedCourse);
      return newUpdates;
    });
  }

  protected readonly WeekSelectorService = WeekSelectorService;
}
