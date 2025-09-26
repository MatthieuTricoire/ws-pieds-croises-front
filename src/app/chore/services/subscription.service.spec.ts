import { TestBed } from '@angular/core/testing';
import { SubscriptionService } from './subscription.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { of, throwError } from 'rxjs';
import {
  Subscription as AppSubscription,
  UserSubscription,
} from '../../shared/models/subscription';
import { AuthUser } from '../../shared/models/authUser';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUser: AuthUser = {
    id: 1,
    firstname: 'Jean',
    lastname: 'Dupont',
    email: 'jean.dupont@example.com',
    roles: ['ROLE_USER'],
    phone: '0123456789',
    photoUrl: 'photo.jpg',
    userSubscriptions: [],
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['userSignal']);
    TestBed.configureTestingModule({
      providers: [
        SubscriptionService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });
    service = TestBed.inject(SubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('getActiveUserSubscription', () => {
    it('should set userSubscription signal when user is connected', (done) => {
      const userSub: UserSubscription = {
        id: 1,
        userId: 1,
        subscriptionId: 2,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        freezeDaysRemaining: 5,
        subscription: {
          id: 2,
          name: 'Abonnement Mensuel',
          sessionPerWeek: 3,
          duration: 30,
          freezeDaysAllowed: 7,
          price: 50,
        },
      };
      authServiceSpy.userSignal.and.returnValue(mockUser);
      httpClientSpy.get.and.returnValue(of(userSub));

      service.getActiveUserSubscription();

      // Vérifier que l'appel HTTP a été fait avec les bons paramètres
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'http://localhost:8080/user-subscriptions/user/1',
        {
          params: { status: 'ACTIVE' },
          withCredentials: true,
        },
      );

      setTimeout(() => {
        expect(service.userSubscription()).toEqual(userSub);
        done();
      }, 0);
    });

    it('should throw error if user is not connected', () => {
      authServiceSpy.userSignal.and.returnValue(null);
      expect(() => service.getActiveUserSubscription()).toThrowError('Utilisateur non connecté');
    });
  });

  describe('getAllSubscriptions', () => {
    it('should return all subscriptions', (done) => {
      const subs: AppSubscription[] = [
        {
          id: 1,
          name: 'Abonnement Basic',
          price: 10,
          sessionPerWeek: 2,
          duration: 30,
          freezeDaysAllowed: 5,
        },
      ];
      httpClientSpy.get.and.returnValue(of(subs));
      service.getAllSubscriptions().subscribe({
        next: (result) => {
          expect(result).toEqual(subs);
          expect(httpClientSpy.get).toHaveBeenCalledWith('http://localhost:8080/subscriptions', {
            withCredentials: true,
          });
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });

  describe('createUserSubscription', () => {
    it('should create user subscription and update signal', (done) => {
      const userSub: UserSubscription = {
        id: 1,
        userId: 1,
        subscriptionId: 2,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        freezeDaysRemaining: 5,
        subscription: {
          id: 2,
          name: 'Abonnement Mensuel',
          sessionPerWeek: 3,
          duration: 30,
          freezeDaysAllowed: 7,
          price: 50,
        },
      };
      authServiceSpy.userSignal.and.returnValue(mockUser);
      httpClientSpy.post.and.returnValue(of(userSub));

      service.createUserSubscription(2).subscribe({
        next: (result) => {
          expect(result).toEqual(userSub);
          expect(service.userSubscription()).toEqual(userSub);
          expect(httpClientSpy.post).toHaveBeenCalledWith(
            'http://localhost:8080/user-subscriptions',
            { userId: 1, subscriptionId: 2 },
            { withCredentials: true },
          );
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('should throw error if user is not connected', () => {
      authServiceSpy.userSignal.and.returnValue(null);
      expect(() => service.createUserSubscription(2)).toThrowError('Utilisateur non connecté');
    });

    it('should not update signal if http fails', (done) => {
      authServiceSpy.userSignal.and.returnValue(mockUser);
      httpClientSpy.post.and.returnValue(throwError(() => new Error('fail')));

      service.createUserSubscription(2).subscribe({
        next: () => done.fail('should have errored'),
        error: () => {
          // Le signal ne devrait pas être mis à jour en cas d'erreur
          done();
        },
      });
    });
  });

  describe('createUserSubscriptionForUser', () => {
    it('should create user subscription for user', (done) => {
      const userSub: UserSubscription = {
        id: 1,
        userId: 1,
        subscriptionId: 2,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        freezeDaysRemaining: 5,
        subscription: {
          id: 2,
          name: 'Abonnement Mensuel',
          sessionPerWeek: 3,
          duration: 30,
          freezeDaysAllowed: 7,
          price: 50,
        },
      };
      httpClientSpy.post.and.returnValue(of(userSub));
      service.createUserSubscriptionForUser(1, 2).subscribe({
        next: (result) => {
          expect(result).toEqual(userSub);
          expect(httpClientSpy.post).toHaveBeenCalledWith(
            'http://localhost:8080/user-subscriptions',
            { userId: 1, subscriptionId: 2 },
            { withCredentials: true },
          );
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });

  describe('deleteUserSubscription', () => {
    it('should delete user subscription and reset signal', (done) => {
      httpClientSpy.delete.and.returnValue(of(undefined));
      service.userSubscription.set({
        id: 1,
        userId: 1,
        subscriptionId: 2,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        freezeDaysRemaining: 5,
        subscription: {
          id: 2,
          name: 'Abonnement Mensuel',
          sessionPerWeek: 3,
          duration: 30,
          freezeDaysAllowed: 7,
          price: 50,
        },
      });
      service.deleteUserSubscription(1).subscribe({
        next: (result) => {
          expect(result).toBeUndefined();
          expect(service.userSubscription()).toBeNull();
          expect(httpClientSpy.delete).toHaveBeenCalledWith(
            'http://localhost:8080/user-subscriptions/1',
            { withCredentials: true },
          );
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });
});
