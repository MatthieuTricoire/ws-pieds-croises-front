import { Component, Input } from '@angular/core';
import { Subscription } from '../../models/subscription';

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  imports: [],
})
export class SubscriptionCardComponent {
  @Input({ required: true }) subscription!: Subscription;
}
