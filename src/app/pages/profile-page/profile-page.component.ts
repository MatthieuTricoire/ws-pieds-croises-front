import { Component } from '@angular/core';
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';

@Component({
  selector: 'app-profile-page',
  imports: [UserCardComponent],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {}
