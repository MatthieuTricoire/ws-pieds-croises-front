import { Component } from '@angular/core';
import { UsersTableComponent } from '../../shared/components/users-table/users-table.component';

@Component({
  selector: 'app-user-page',
  imports: [UsersTableComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UsersPageComponent {}
