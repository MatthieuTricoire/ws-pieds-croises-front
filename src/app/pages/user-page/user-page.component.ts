import { Component } from '@angular/core';
import { UsersTableComponent } from '../../shared/components/users-table/users-table.component';
import { TypographyComponent } from '../../shared/components/design-system/typography/typography.component';

@Component({
  selector: 'app-user-page',
  imports: [UsersTableComponent, TypographyComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UsersPageComponent {}
