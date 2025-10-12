import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ProfilePageComponent } from './profile-page.component';
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';
import { SubscriptionsListComponent } from '../../shared/components/subscriptions-list/subscriptions-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

@Component({
  selector: 'app-user-card',
  template: '<div data-testid="mock-user-card">Mock User Card</div>',
  standalone: true,
})
class MockUserCardComponent {}

@Component({
  selector: 'app-subscriptions-list',
  template: '<div data-testid="mock-subscriptions-list">Mock Subscriptions List</div>',
  standalone: true,
})
class MockSubscriptionsListComponent {}

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideComponent(ProfilePageComponent, {
        remove: {
          imports: [UserCardComponent, SubscriptionsListComponent],
        },
        add: {
          imports: [MockUserCardComponent, MockSubscriptionsListComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
