import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UserSubscriptionCardComponent } from './user-subscription-card.component';
import { SubscriptionService } from '../../../chore/services/subscription.service';

class MockSubscriptionService {
  createUserSubscription(subscriptionId: number) {
    return of({ id: 1, subscriptionId });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteUserSubscription(userSubscriptionId: number) {
    return of({ success: true });
  }
}

describe('UserSubscriptionCardComponent', () => {
  let component: UserSubscriptionCardComponent;
  let fixture: ComponentFixture<UserSubscriptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSubscriptionCardComponent],
      providers: [{ provide: SubscriptionService, useClass: MockSubscriptionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSubscriptionCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('subscription', {
      id: 1,
      name: 'Test Subscription',
      price: 50,
      duration: 30,
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
