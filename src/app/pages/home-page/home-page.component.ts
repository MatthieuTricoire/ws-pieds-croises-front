import { Component } from '@angular/core';
import { HeaderHomePageComponent } from '../../shared/components/header-home-page/header-home-page.component';
import { CourseListComponent } from '../../shared/components/course-list/course-list.component';
import { MessagesContainerComponent } from '../../shared/components/messages-container/messages-container.component';

@Component({
  selector: 'app-home-page',
  imports: [HeaderHomePageComponent, CourseListComponent, MessagesContainerComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {}
