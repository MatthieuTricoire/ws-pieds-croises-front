import { Component, computed, input, Signal } from '@angular/core';
import { Course } from '../../models/course';
import { CommonModule, DatePipe } from '@angular/common';
import { addMinutesToDate } from '../../utils/dates';

@Component({
  selector: 'app-course-card',
  standalone: true,
  templateUrl: './course-card.component.html',
  imports: [DatePipe, CommonModule],
})
export class CourseCardComponent {
  readonly course = input.required<Course>();
  readonly endDatetime: Signal<Date> = computed(() => {
    const c = this.course();
    return addMinutesToDate(c.startDatetime, c.duration);
  });
}
