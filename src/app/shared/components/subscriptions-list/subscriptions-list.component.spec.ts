import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, signal } from '@angular/core';
import { of } from 'rxjs';

import { SubscriptionsListComponent } from './subscriptions-list.component';
import { SubscriptionService } from '../../../chore/services/subscription.service';
import { Subscription as AppSubscription } from '../../models/subscription';
import { SubscriptionCardComponent } from '../subscription-card/subscription-card.component';
import { UserSubscription } from '../../models/user-subscription';

@Component({
  selector: 'app-subscription-card',
  template: `<div data-testid="mock-sub-card">{{ subscription?.name }}</div>`,
  standalone: true,
})
class MockSubscriptionCardComponent {
  @Input() subscription?: AppSubscription;
  @Input() userSubscription?: UserSubscription | null;
  @Input() isCurrentSubscription?: boolean;
}

describe('SubscriptionsListComponent', () => {
  let component: SubscriptionsListComponent;
  let fixture: ComponentFixture<SubscriptionsListComponent>;

  const mockSubscriptions: AppSubscription[] = [
    { id: 1, name: 'Basic', price: 10, sessionPerWeek: 1, duration: 30, freezeDaysAllowed: 0 },
    { id: 2, name: 'Pro', price: 20, sessionPerWeek: 2, duration: 30, freezeDaysAllowed: 5 },
  ];

  const mockSubscriptionService: Partial<SubscriptionService> = {
    userSubscription: signal(null),
    availableSubscriptions: signal<AppSubscription[]>([]),
    getActiveUserSubscription: () => undefined,
    getAllSubscriptions: () => of(mockSubscriptions),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionsListComponent],
      providers: [{ provide: SubscriptionService, useValue: mockSubscriptionService }],
    })
      .overrideComponent(SubscriptionsListComponent, {
        remove: { imports: [SubscriptionCardComponent] },
        add: { imports: [MockSubscriptionCardComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SubscriptionsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
