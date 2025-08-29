import { Component } from '@angular/core';
import { WeekSelectorComponent } from '../../shared/components/week-selector/week-selector.component';
import { CoursesComponent } from '../../shared/components/courses/courses.component';

@Component({
  selector: 'app-course-reservation-page',
  imports: [WeekSelectorComponent, CoursesComponent],
  templateUrl: './course-reservation-page.component.html',
  styleUrl: './course-reservation-page.component.css',
})
export class CourseReservationPageComponent {}
