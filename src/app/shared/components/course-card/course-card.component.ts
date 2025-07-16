import { Component, Input } from '@angular/core';
import { Course } from '../../models/course';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  imports: [DatePipe],
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course;
}
