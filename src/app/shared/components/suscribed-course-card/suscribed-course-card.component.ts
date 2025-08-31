import { Component, computed, input, Signal } from '@angular/core';
import { Course } from '../../models/course';
import { addMinutesToDate } from '../../utils/dates';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-suscribed-course-card',
  imports: [DatePipe],
  templateUrl: './suscribed-course-card.component.html',
})
export class SuscribedCourseCardComponent {
  readonly course = input.required<Course>();
  readonly endDatetime: Signal<Date> = computed(() => {
    return addMinutesToDate(this.course().startDatetime, this.course().duration);
  });
}
