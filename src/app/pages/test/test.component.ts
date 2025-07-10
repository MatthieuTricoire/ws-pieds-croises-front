import { Component } from '@angular/core';
import { MessagesContainerComponent } from '../../shared/components/messages-container/messages-container.component';

@Component({
  selector: 'app-test',
  imports: [MessagesContainerComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {}
