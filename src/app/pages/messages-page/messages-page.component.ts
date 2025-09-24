import { Component } from '@angular/core';
import { MessagesTableComponent } from '../../shared/components/messages-table/messages-table.component';
import { TypographyComponent } from '../../shared/components/design-system/typography/typography.component';

@Component({
  selector: 'app-messages-page',
  imports: [MessagesTableComponent, TypographyComponent],
  templateUrl: './messages-page.component.html',
  styleUrl: './messages-page.component.css',
})
export class MessagesPageComponent {}
