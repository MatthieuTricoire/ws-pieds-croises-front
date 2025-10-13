import { Component } from '@angular/core';
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';
import { SubscriptionsListComponent } from '../../shared/components/subscriptions-list/subscriptions-list.component';

@Component({
  selector: 'app-profile-page',
  imports: [UserCardComponent, SubscriptionsListComponent],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {}
