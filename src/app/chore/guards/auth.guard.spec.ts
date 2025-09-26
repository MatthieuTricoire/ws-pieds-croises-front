import { TestBed } from '@angular/core/testing';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  GuardResult,
  RedirectCommand,
} from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { authGuard, roleGuard, adminGuard, coachGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { AuthUser } from '../../shared/models/authUser';

type GuardTestResult = boolean | UrlTree | RedirectCommand | Promise<GuardResult>;

describe('Auth Guards', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  const toObservable = <T>(result: T | Observable<T>): Observable<T> => {
    return result instanceof Observable ? result : of(result);
  };

  const mockUser: AuthUser = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    roles: ['ROLE_USER'],
    phone: '0123456789',
    photoUrl: 'photo.jpg',
    userSubscriptions: [],
  };

  const mockAdminUser: AuthUser = {
    ...mockUser,
    id: 2,
    roles: ['ROLE_ADMIN'],
  };

  const mockCoachUser: AuthUser = {
    ...mockUser,
    id: 3,
    roles: ['ROLE_COACH'],
  };

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'loadCurrentUser',
      'markAsLoggedOut',
      'setReturnUrl',
    ]);

    Object.defineProperty(mockAuthService, 'isLoggedInSignal', {
      value: jasmine.createSpy('isLoggedInSignal').and.returnValue(false),
      writable: true,
    });

    Object.defineProperty(mockAuthService, 'userSignal', {
      value: jasmine.createSpy('userSignal').and.returnValue(null),
      writable: true,
    });

    mockRouter = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    route = new ActivatedRouteSnapshot();
    state = {
      url: '/protected-route',
      root: route,
    } as RouterStateSnapshot;

    mockRouter.parseUrl.and.returnValue(new UrlTree());
  });

  describe('authGuard', () => {
    it('should allow access when user is already logged in with loaded data', (done) => {
      (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(true);
      (mockAuthService.userSignal as jasmine.Spy).and.returnValue(mockUser);

      const result = TestBed.runInInjectionContext(() => {
        return authGuard(route, state);
      });

      toObservable(result).subscribe({
        next: (canActivate: GuardTestResult) => {
          expect(canActivate).toBe(true);
          expect(mockAuthService.isAuthenticated).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should allow access when authenticated and user data loaded successfully', (done) => {
      (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(false);
      (mockAuthService.userSignal as jasmine.Spy).and.returnValue(null);
      mockAuthService.isAuthenticated.and.returnValue(of(true));
      mockAuthService.loadCurrentUser.and.returnValue(of(mockUser));

      const result = TestBed.runInInjectionContext(() => {
        return authGuard(route, state);
      });

      toObservable(result).subscribe({
        next: (canActivate: GuardTestResult) => {
          expect(canActivate).toBe(true);
          expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
          expect(mockAuthService.loadCurrentUser).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should allow access when authenticated and user data already loaded', (done) => {
      (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(false);
      (mockAuthService.userSignal as jasmine.Spy).and.returnValue(mockUser);
      mockAuthService.isAuthenticated.and.returnValue(of(true));

      const result = TestBed.runInInjectionContext(() => {
        return authGuard(route, state);
      });

      toObservable(result).subscribe({
        next: (canActivate: GuardTestResult) => {
          expect(canActivate).toBe(true);
          expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
          expect(mockAuthService.loadCurrentUser).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should redirect to login when not authenticated', (done) => {
      const loginUrl = new UrlTree();
      mockRouter.parseUrl.and.returnValue(loginUrl);

      (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(false);
      (mockAuthService.userSignal as jasmine.Spy).and.returnValue(null);
      mockAuthService.isAuthenticated.and.returnValue(of(false));

      const result = TestBed.runInInjectionContext(() => {
        return authGuard(route, state);
      });

      toObservable(result).subscribe({
        next: (canActivate: GuardTestResult) => {
          expect(canActivate).toBe(loginUrl);
          expect(mockAuthService.markAsLoggedOut).toHaveBeenCalled();
          expect(mockAuthService.setReturnUrl).toHaveBeenCalledWith('/protected-route');
          expect(mockRouter.parseUrl).toHaveBeenCalledWith('/login');
          done();
        },
      });
    });

    it('should redirect to login when user loading fails', (done) => {
      const loginUrl = new UrlTree();
      mockRouter.parseUrl.and.returnValue(loginUrl);

      (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(false);
      (mockAuthService.userSignal as jasmine.Spy).and.returnValue(null);
      mockAuthService.isAuthenticated.and.returnValue(of(true));
      mockAuthService.loadCurrentUser.and.returnValue(throwError(() => new Error('Load failed')));

      spyOn(console, 'error');

      const result = TestBed.runInInjectionContext(() => {
        return authGuard(route, state);
      });

      toObservable(result).subscribe({
        next: (canActivate: GuardTestResult) => {
          expect(canActivate).toBe(loginUrl);
          expect(console.error).toHaveBeenCalledWith(
            '[AuthGuard] Erreur chargement utilisateur:',
            jasmine.any(Error),
          );
          expect(mockAuthService.markAsLoggedOut).toHaveBeenCalled();
          expect(mockAuthService.setReturnUrl).toHaveBeenCalledWith('/protected-route');
          done();
        },
      });
    });

    it('should redirect to login when unexpected error occurs', (done) => {
      const loginUrl = new UrlTree();
      mockRouter.parseUrl.and.returnValue(loginUrl);

      (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(false);
      mockAuthService.isAuthenticated.and.returnValue(
        throwError(() => new Error('Unexpected error')),
      );

      spyOn(console, 'error');

      const result = TestBed.runInInjectionContext(() => {
        return authGuard(route, state);
      });

      toObservable(result).subscribe({
        next: (canActivate: GuardTestResult) => {
          expect(canActivate).toBe(loginUrl);
          expect(console.error).toHaveBeenCalledWith(
            '[AuthGuard] Erreur inattendue dans le guard:',
            jasmine.any(Error),
          );
          expect(mockAuthService.markAsLoggedOut).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('roleGuard', () => {
    describe('with ROLE_ADMIN requirement', () => {
      let adminRoleGuard: typeof authGuard;

      beforeEach(() => {
        adminRoleGuard = roleGuard('ROLE_ADMIN');
      });

      it('should allow access when user has required role and is already loaded', (done) => {
        (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(true);
        (mockAuthService.userSignal as jasmine.Spy).and.returnValue(mockAdminUser);

        const result = TestBed.runInInjectionContext(() => {
          return adminRoleGuard(route, state);
        });

        toObservable(result).subscribe({
          next: (canActivate: GuardTestResult) => {
            expect(canActivate).toBe(true);
            expect(mockAuthService.isAuthenticated).not.toHaveBeenCalled();
            done();
          },
        });
      });

      it('should deny access when user lacks required role and is already loaded', (done) => {
        const unauthorizedUrl = new UrlTree();
        mockRouter.parseUrl.and.returnValue(unauthorizedUrl);

        (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(true);
        (mockAuthService.userSignal as jasmine.Spy).and.returnValue(mockUser);

        spyOn(console, 'log');

        const result = TestBed.runInInjectionContext(() => {
          return adminRoleGuard(route, state);
        });

        toObservable(result).subscribe({
          next: (canActivate: GuardTestResult) => {
            expect(canActivate).toBe(unauthorizedUrl);
            expect(console.log).toHaveBeenCalledWith(
              '[RoleGuard] Rôle ROLE_ADMIN requis, accès refusé',
            );
            expect(mockRouter.parseUrl).toHaveBeenCalledWith('/unauthorized');
            done();
          },
        });
      });

      it('should allow access when authenticated and user loaded with correct role', (done) => {
        let userSignalCallCount = 0;
        (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(false);
        (mockAuthService.userSignal as jasmine.Spy).and.callFake(() => {
          userSignalCallCount++;

          return userSignalCallCount === 1 ? null : mockAdminUser;
        });

        mockAuthService.isAuthenticated.and.returnValue(of(true));
        mockAuthService.loadCurrentUser.and.returnValue(of(mockAdminUser));

        const result = TestBed.runInInjectionContext(() => {
          return adminRoleGuard(route, state);
        });

        toObservable(result).subscribe({
          next: (canActivate: GuardTestResult) => {
            expect(canActivate).toBe(true);
            expect(mockAuthService.loadCurrentUser).toHaveBeenCalled();
            done();
          },
        });
      });

      it('should deny access when authenticated but user lacks role after loading', (done) => {
        const unauthorizedUrl = new UrlTree();
        mockRouter.parseUrl.and.returnValue(unauthorizedUrl);

        (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(false);
        (mockAuthService.userSignal as jasmine.Spy).and.returnValue(null).and.returnValue(mockUser);
        mockAuthService.isAuthenticated.and.returnValue(of(true));
        mockAuthService.loadCurrentUser.and.returnValue(of(mockUser));

        spyOn(console, 'log');

        const result = TestBed.runInInjectionContext(() => {
          return adminRoleGuard(route, state);
        });

        toObservable(result).subscribe({
          next: (canActivate: GuardTestResult) => {
            expect(canActivate).toBe(unauthorizedUrl);
            expect(console.log).toHaveBeenCalledWith(
              '[RoleGuard] Rôle ROLE_ADMIN requis, accès refusé',
            );
            done();
          },
        });
      });

      it('should check role when user is already loaded but not via fast path', (done) => {
        const unauthorizedUrl = new UrlTree();
        mockRouter.parseUrl.and.returnValue(unauthorizedUrl);

        (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(false);
        (mockAuthService.userSignal as jasmine.Spy).and.returnValue(mockUser);
        mockAuthService.isAuthenticated.and.returnValue(of(true));

        spyOn(console, 'log');

        const result = TestBed.runInInjectionContext(() => {
          return adminRoleGuard(route, state);
        });

        toObservable(result).subscribe({
          next: (canActivate: GuardTestResult) => {
            expect(canActivate).toBe(unauthorizedUrl);
            expect(console.log).toHaveBeenCalledWith(
              '[RoleGuard] Rôle ROLE_ADMIN requis, accès refusé',
            );
            expect(mockAuthService.loadCurrentUser).not.toHaveBeenCalled();
            done();
          },
        });
      });

      it('should redirect to login when not authenticated', (done) => {
        const loginUrl = new UrlTree();
        mockRouter.parseUrl.and.returnValue(loginUrl);

        (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(false);
        (mockAuthService.userSignal as jasmine.Spy).and.returnValue(null);
        mockAuthService.isAuthenticated.and.returnValue(of(false));

        spyOn(console, 'log');

        const result = TestBed.runInInjectionContext(() => {
          return adminRoleGuard(route, state);
        });

        toObservable(result).subscribe({
          next: (canActivate: GuardTestResult) => {
            expect(canActivate).toBe(loginUrl);
            expect(console.log).toHaveBeenCalledWith('[RoleGuard] Non authentifié, redirection...');
            expect(mockAuthService.markAsLoggedOut).toHaveBeenCalled();
            done();
          },
        });
      });

      it('should redirect to login when user loading fails', (done) => {
        const loginUrl = new UrlTree();
        mockRouter.parseUrl.and.returnValue(loginUrl);

        (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(false);
        (mockAuthService.userSignal as jasmine.Spy).and.returnValue(null);
        mockAuthService.isAuthenticated.and.returnValue(of(true));
        mockAuthService.loadCurrentUser.and.returnValue(throwError(() => new Error('Load failed')));

        spyOn(console, 'error');

        const result = TestBed.runInInjectionContext(() => {
          return adminRoleGuard(route, state);
        });

        toObservable(result).subscribe({
          next: (canActivate: GuardTestResult) => {
            expect(canActivate).toBe(loginUrl);
            expect(console.error).toHaveBeenCalledWith(
              '[RoleGuard] Erreur chargement utilisateur:',
              jasmine.any(Error),
            );
            done();
          },
        });
      });

      it('should redirect to login when unexpected error occurs', (done) => {
        const loginUrl = new UrlTree();
        mockRouter.parseUrl.and.returnValue(loginUrl);

        (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(false);
        mockAuthService.isAuthenticated.and.returnValue(
          throwError(() => new Error('Unexpected error')),
        );

        spyOn(console, 'error');

        const result = TestBed.runInInjectionContext(() => {
          return adminRoleGuard(route, state);
        });

        toObservable(result).subscribe({
          next: (canActivate: GuardTestResult) => {
            expect(canActivate).toBe(loginUrl);
            expect(console.error).toHaveBeenCalledWith(
              '[RoleGuard] Erreur inattendue:',
              jasmine.any(Error),
            );
            done();
          },
        });
      });
    });

    describe('with ROLE_COACH requirement', () => {
      let coachRoleGuard: typeof authGuard;

      beforeEach(() => {
        coachRoleGuard = roleGuard('ROLE_COACH');
      });

      it('should allow access when user has ROLE_COACH', (done) => {
        (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(true);
        (mockAuthService.userSignal as jasmine.Spy).and.returnValue(mockCoachUser);

        const result = TestBed.runInInjectionContext(() => {
          return coachRoleGuard(route, state);
        });

        toObservable(result).subscribe({
          next: (canActivate: GuardTestResult) => {
            expect(canActivate).toBe(true);
            done();
          },
        });
      });

      it('should deny access when user has different role', (done) => {
        const unauthorizedUrl = new UrlTree();
        mockRouter.parseUrl.and.returnValue(unauthorizedUrl);

        (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(true);
        (mockAuthService.userSignal as jasmine.Spy).and.returnValue(mockAdminUser);

        const result = TestBed.runInInjectionContext(() => {
          return coachRoleGuard(route, state);
        });

        toObservable(result).subscribe({
          next: (canActivate: GuardTestResult) => {
            expect(canActivate).toBe(unauthorizedUrl);
            done();
          },
        });
      });
    });

    describe('with multiple roles', () => {
      it('should allow access when user has multiple roles including the required one', (done) => {
        const multiRoleUser: AuthUser = {
          ...mockUser,
          roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_COACH'],
        };

        const adminRoleGuard = roleGuard('ROLE_ADMIN');

        (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(true);
        (mockAuthService.userSignal as jasmine.Spy).and.returnValue(multiRoleUser);

        const result = TestBed.runInInjectionContext(() => {
          return adminRoleGuard(route, state);
        });

        toObservable(result).subscribe({
          next: (canActivate: GuardTestResult) => {
            expect(canActivate).toBe(true);
            done();
          },
        });
      });
    });
  });

  describe('adminGuard', () => {
    it('should be a CanActivateFn function', () => {
      expect(typeof adminGuard).toBe('function');
    });

    it('should allow access for admin users', (done) => {
      (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(true);
      (mockAuthService.userSignal as jasmine.Spy).and.returnValue(mockAdminUser);

      const result = TestBed.runInInjectionContext(() => {
        return adminGuard(route, state);
      });

      toObservable(result).subscribe({
        next: (canActivate: GuardTestResult) => {
          expect(canActivate).toBe(true);
          done();
        },
      });
    });

    it('should deny access for non-admin users', (done) => {
      const unauthorizedUrl = new UrlTree();
      mockRouter.parseUrl.and.returnValue(unauthorizedUrl);

      (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(true);
      (mockAuthService.userSignal as jasmine.Spy).and.returnValue(mockUser);

      const result = TestBed.runInInjectionContext(() => {
        return adminGuard(route, state);
      });

      toObservable(result).subscribe({
        next: (canActivate: GuardTestResult) => {
          expect(canActivate).toBe(unauthorizedUrl);
          done();
        },
      });
    });
  });

  describe('coachGuard', () => {
    it('should be a CanActivateFn function', () => {
      expect(typeof coachGuard).toBe('function');
    });

    it('should allow access for coach users', (done) => {
      (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(true);
      (mockAuthService.userSignal as jasmine.Spy).and.returnValue(mockCoachUser);

      const result = TestBed.runInInjectionContext(() => {
        return coachGuard(route, state);
      });

      toObservable(result).subscribe({
        next: (canActivate: GuardTestResult) => {
          expect(canActivate).toBe(true);
          done();
        },
      });
    });

    it('should deny access for non-coach users', (done) => {
      const unauthorizedUrl = new UrlTree();
      mockRouter.parseUrl.and.returnValue(unauthorizedUrl);

      (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(true);
      (mockAuthService.userSignal as jasmine.Spy).and.returnValue(mockUser);

      const result = TestBed.runInInjectionContext(() => {
        return coachGuard(route, state);
      });

      toObservable(result).subscribe({
        next: (canActivate: GuardTestResult) => {
          expect(canActivate).toBe(unauthorizedUrl);
          done();
        },
      });
    });
  });

  describe('Edge Cases and Performance', () => {
    it('should handle null user signal correctly', (done) => {
      (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(true);
      (mockAuthService.userSignal as jasmine.Spy).and.returnValue(null);
      mockAuthService.isAuthenticated.and.returnValue(of(true));
      mockAuthService.loadCurrentUser.and.returnValue(of(mockUser));

      const result = TestBed.runInInjectionContext(() => {
        return authGuard(route, state);
      });

      toObservable(result).subscribe({
        next: (canActivate: GuardTestResult) => {
          expect(canActivate).toBe(true);
          expect(mockAuthService.loadCurrentUser).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should preserve return URL when redirecting to login', (done) => {
      const customState: RouterStateSnapshot = {
        url: '/admin/dashboard',
        root: route,
      } as RouterStateSnapshot;

      (mockAuthService.isLoggedInSignal as jasmine.Spy).and.returnValue(false);
      mockAuthService.isAuthenticated.and.returnValue(of(false));

      const result = TestBed.runInInjectionContext(() => {
        return authGuard(route, customState);
      });

      toObservable(result).subscribe({
        next: () => {
          expect(mockAuthService.setReturnUrl).toHaveBeenCalledWith('/admin/dashboard');
          done();
        },
      });
    });
  });
});
