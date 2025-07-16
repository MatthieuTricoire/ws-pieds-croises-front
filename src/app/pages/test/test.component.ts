import { Component } from '@angular/core';
import { MessagesContainerComponent } from '../../shared/components/messages-container/messages-container.component';
import { CourseListComponent } from '../../shared/components/course-list/course-list.component';

@Component({
  selector: 'app-test',
  imports: [MessagesContainerComponent, CourseListComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {}
