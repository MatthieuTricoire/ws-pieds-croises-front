import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserSubscriptionService } from './user-subscription.service';
import {
  UserSubscription,
  Subscription,
  SubscriptionValidation,
} from '../../shared/models/user-subscription';

describe('UserSubscriptionService', () => {
  let service: UserSubscriptionService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/user-subscriptions';
  const userCoursesApiUrl = 'http://localhost:8080/userCourses';

  // Mock data pour les tests
  const mockSubscription: Subscription = {
    id: 1,
    name: 'Abonnement Mensuel',
    sessionPerWeek: 3,
    duration: 30,
    freezeDaysAllowed: 7,
    price: 50,
  };

  const mockActiveUserSubscription: UserSubscription = {
    id: 1,
    userId: 123,
    subscriptionId: 1,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    freezeDaysRemaining: 5,
    status: 'ACTIVE',
    subscription: mockSubscription,
  };

  const mockExpiredUserSubscription: UserSubscription = {
    id: 2,
    userId: 123,
    subscriptionId: 1,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    freezeDaysRemaining: 0,
    status: 'EXPIRED',
    subscription: mockSubscription,
  };

  const mockFutureUserSubscription: UserSubscription = {
    id: 3,
    userId: 123,
    subscriptionId: 1,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    freezeDaysRemaining: 7,
    status: 'ACTIVE',
    subscription: mockSubscription,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserSubscriptionService],
    });
    service = TestBed.inject(UserSubscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getUserSubscriptions', () => {
    it('should get user subscriptions successfully', (done) => {
      const userId = 123;
      const mockSubscriptions = [mockActiveUserSubscription, mockExpiredUserSubscription];

      service.getUserSubscriptions(userId).subscribe({
        next: (subscriptions) => {
          expect(subscriptions).toEqual(mockSubscriptions);
          expect(subscriptions.length).toBe(2);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();
      req.flush(mockSubscriptions);
    });

    it('should handle error when getting user subscriptions', (done) => {
      const userId = 123;

      service.getUserSubscriptions(userId).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush('Error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getUserActiveSubscription', () => {
    beforeEach(() => {
      // Mock de la date actuelle pour des tests prévisibles
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2024-06-15T10:00:00Z'));
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should return active subscription when user has one', (done) => {
      const userId = 123;
      const subscriptions = [mockActiveUserSubscription, mockExpiredUserSubscription];

      service.getUserActiveSubscription(userId).subscribe({
        next: (activeSubscription) => {
          expect(activeSubscription).toEqual(mockActiveUserSubscription);
          expect(activeSubscription?.subscription.sessionPerWeek).toBe(3);
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush(subscriptions);
    });

    it('should return null when user has no active subscription', (done) => {
      const userId = 123;
      const subscriptions = [mockExpiredUserSubscription, mockFutureUserSubscription];

      service.getUserActiveSubscription(userId).subscribe({
        next: (activeSubscription) => {
          expect(activeSubscription).toBeNull();
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush(subscriptions);
    });

    it('should return null when user has no subscriptions', (done) => {
      const userId = 123;

      service.getUserActiveSubscription(userId).subscribe({
        next: (activeSubscription) => {
          expect(activeSubscription).toBeNull();
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush([]);
    });

    it('should return null on error', (done) => {
      const userId = 123;

      service.getUserActiveSubscription(userId).subscribe({
        next: (activeSubscription) => {
          expect(activeSubscription).toBeNull();
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getWeeklyRegistrationsCount', () => {
    it('should get weekly registrations count successfully', (done) => {
      const userId = 123;
      const courseDate = new Date('2024-06-15T10:00:00Z');
      const expectedCount = 2;
      const expectedDateParam = '2024-06-15';

      service.getWeeklyRegistrationsCount(userId, courseDate).subscribe({
        next: (count) => {
          expect(count).toBe(expectedCount);
          done();
        },
      });

      const req = httpMock.expectOne(
        `${userCoursesApiUrl}/user/${userId}/weekly-count?weekDate=${expectedDateParam}`,
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();
      req.flush(expectedCount);
    });

    it('should return 0 on error', (done) => {
      const userId = 123;
      const courseDate = new Date('2024-06-15T10:00:00Z');

      service.getWeeklyRegistrationsCount(userId, courseDate).subscribe({
        next: (count) => {
          expect(count).toBe(0);
          done();
        },
      });

      const req = httpMock.expectOne(
        `${userCoursesApiUrl}/user/${userId}/weekly-count?weekDate=2024-06-15`,
      );
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });

    it('should format date correctly in ISO format', (done) => {
      const userId = 123;
      const courseDate = new Date('2024-12-25T15:30:45.123Z');

      service.getWeeklyRegistrationsCount(userId, courseDate).subscribe();

      const req = httpMock.expectOne(
        `${userCoursesApiUrl}/user/${userId}/weekly-count?weekDate=2024-12-25`,
      );
      expect(req.request.params.get('weekDate')).toBe('2024-12-25');
      req.flush(1);
      done();
    });
  });

  describe('canRegisterToCourse', () => {
    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2024-06-15T10:00:00Z'));
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should allow registration when user has active subscription and under limit', (done) => {
      const userId = 123;
      const courseDate = new Date('2024-06-15T10:00:00Z');
      const weeklyCount = 1;

      const expectedValidation: SubscriptionValidation = {
        isValid: true,
        canRegister: true,
        weeklyLimit: 3,
        weeklyRegistrations: 1,
      };

      service.canRegisterToCourse(userId, courseDate).subscribe({
        next: (validation) => {
          expect(validation).toEqual(expectedValidation);
          done();
        },
      });

      // Mock getUserActiveSubscription
      const subscriptionReq = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      subscriptionReq.flush([mockActiveUserSubscription]);

      // Mock getWeeklyRegistrationsCount
      const countReq = httpMock.expectOne(
        `${userCoursesApiUrl}/user/${userId}/weekly-count?weekDate=2024-06-15`,
      );
      countReq.flush(weeklyCount);
    });

    it('should prevent registration when user reached weekly limit', (done) => {
      const userId = 123;
      const courseDate = new Date('2024-06-15T10:00:00Z');
      const weeklyCount = 3; // Equal to limit

      const expectedValidation: SubscriptionValidation = {
        isValid: true,
        canRegister: false,
        reason: 'Limite atteinte: 3/3 séances cette semaine',
      };

      service.canRegisterToCourse(userId, courseDate).subscribe({
        next: (validation) => {
          expect(validation).toEqual(expectedValidation);
          done();
        },
      });

      const subscriptionReq = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      subscriptionReq.flush([mockActiveUserSubscription]);

      const countReq = httpMock.expectOne(
        `${userCoursesApiUrl}/user/${userId}/weekly-count?weekDate=2024-06-15`,
      );
      countReq.flush(weeklyCount);
    });

    it('should prevent registration when user exceeded weekly limit', (done) => {
      const userId = 123;
      const courseDate = new Date('2024-06-15T10:00:00Z');
      const weeklyCount = 4; // Over limit of 3

      const expectedValidation: SubscriptionValidation = {
        isValid: true,
        canRegister: false,
        reason: 'Limite atteinte: 4/3 séances cette semaine',
      };

      service.canRegisterToCourse(userId, courseDate).subscribe({
        next: (validation) => {
          expect(validation).toEqual(expectedValidation);
        },
      });

      const subscriptionReq = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      subscriptionReq.flush([mockActiveUserSubscription]);

      const countReq = httpMock.expectOne(
        `${userCoursesApiUrl}/user/${userId}/weekly-count?weekDate=2024-06-15`,
      );
      countReq.flush(weeklyCount);

      done();
    });

    it('should prevent registration when user has no active subscription', (done) => {
      const userId = 123;
      const courseDate = new Date('2024-06-15T10:00:00Z');
      const weeklyCount = 0;

      const expectedValidation: SubscriptionValidation = {
        isValid: false,
        canRegister: false,
        reason: 'Aucun abonnement actif',
      };

      service.canRegisterToCourse(userId, courseDate).subscribe({
        next: (validation) => {
          expect(validation).toEqual(expectedValidation);
          done();
        },
      });

      const subscriptionReq = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      subscriptionReq.flush([mockExpiredUserSubscription]);

      const countReq = httpMock.expectOne(
        `${userCoursesApiUrl}/user/${userId}/weekly-count?weekDate=2024-06-15`,
      );
      countReq.flush(weeklyCount);
    });

    it('should handle different subscription limits correctly', (done) => {
      const userId = 123;
      const courseDate = new Date('2024-06-15T10:00:00Z');
      const weeklyCount = 1;

      // Subscription with different limit
      const unlimitedSubscription: UserSubscription = {
        ...mockActiveUserSubscription,
        subscription: { ...mockSubscription, sessionPerWeek: 10 },
      };

      const expectedValidation: SubscriptionValidation = {
        isValid: true,
        canRegister: true,
        weeklyLimit: 10,
        weeklyRegistrations: 1,
      };

      service.canRegisterToCourse(userId, courseDate).subscribe({
        next: (validation) => {
          expect(validation).toEqual(expectedValidation);
          done();
        },
      });

      const subscriptionReq = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      subscriptionReq.flush([unlimitedSubscription]);

      const countReq = httpMock.expectOne(
        `${userCoursesApiUrl}/user/${userId}/weekly-count?weekDate=2024-06-15`,
      );
      countReq.flush(weeklyCount);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle multiple active subscriptions and pick the right one', (done) => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2024-06-15T10:00:00Z'));

      const userId = 123;
      const multipleActiveSubscriptions = [
        mockActiveUserSubscription,
        {
          ...mockActiveUserSubscription,
          id: 2,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
        },
      ];

      service.getUserActiveSubscription(userId).subscribe({
        next: (activeSubscription) => {
          // Should return the first active subscription found
          expect(activeSubscription).toEqual(mockActiveUserSubscription);
          jasmine.clock().uninstall();
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush(multipleActiveSubscriptions);
    });

    it('should handle date edge cases correctly', (done) => {
      jasmine.clock().install();
      // Test on the exact start date
      jasmine.clock().mockDate(new Date('2024-01-01T00:00:00Z'));

      const userId = 123;

      service.getUserActiveSubscription(userId).subscribe({
        next: (activeSubscription) => {
          expect(activeSubscription).toEqual(mockActiveUserSubscription);
          jasmine.clock().uninstall();
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush([mockActiveUserSubscription]);
    });

    it('should handle end date edge cases correctly', (done) => {
      jasmine.clock().install();
      // Test on the exact end date - but within the valid day
      jasmine.clock().mockDate(new Date('2024-12-31T00:00:00Z'));

      const userId = 123;

      service.getUserActiveSubscription(userId).subscribe({
        next: (activeSubscription) => {
          expect(activeSubscription).toEqual(mockActiveUserSubscription);
          jasmine.clock().uninstall();
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush([mockActiveUserSubscription]);
    });

    it('should return null when exactly after end date', (done) => {
      jasmine.clock().install();
      // Test just after the end date - should be null
      jasmine.clock().mockDate(new Date('2025-01-01T00:00:01Z'));

      const userId = 123;

      service.getUserActiveSubscription(userId).subscribe({
        next: (activeSubscription) => {
          expect(activeSubscription).toBeNull();
          jasmine.clock().uninstall();
          done();
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush([mockActiveUserSubscription]);
    });
  });
});
