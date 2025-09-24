import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubscriptionCardComponent } from './user-subscription-card.component';

describe('UserSubscriptionCardComponent', () => {
  let component: UserSubscriptionCardComponent;
  let fixture: ComponentFixture<UserSubscriptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSubscriptionCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSubscriptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
