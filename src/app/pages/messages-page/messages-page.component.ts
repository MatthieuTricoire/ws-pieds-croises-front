import { Component } from '@angular/core';
import { MessagesTableComponent } from '../../shared/components/messages-table/messages-table.component';

@Component({
  selector: 'app-messages-page',
  imports: [MessagesTableComponent],
  templateUrl: './messages-page.component.html',
  styleUrl: './messages-page.component.css',
})
export class MessagesPageComponent {}
