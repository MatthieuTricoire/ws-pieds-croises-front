import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { UserCardComponent } from './user-card.component';
import { AuthService } from '../../../chore/services/auth.service';
import { SubscriptionService } from '../../../chore/services/subscription.service';
import { UserService } from '../../../chore/services/user.service';
import { AuthUser } from '../../models/authUser';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockSubscriptionService: jasmine.SpyObj<SubscriptionService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  const mockUser: AuthUser = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    phone: '0123456789',
    profilePicture: '/images/profile.jpg',
    roles: ['ROLE_USER'],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    userSubscriptions: [],
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['userSignal'], {
      apiUrl: 'http://localhost:8080',
      userSignal: signal(mockUser),
    });

    mockSubscriptionService = jasmine.createSpyObj(
      'SubscriptionService',
      ['getActiveUserSubscription'],
      {
        userSubscription: signal(null),
      },
    );

    mockUserService = jasmine.createSpyObj('UserService', ['updateUser']);

    mockSubscriptionService.getActiveUserSubscription.and.returnValue();

    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: SubscriptionService, useValue: mockSubscriptionService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
