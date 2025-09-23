import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthUser } from '../../shared/models/authUser';

describe('AuthService (unit)', () => {
  let service: AuthService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: { navigate: jasmine.Spy; navigateByUrl: jasmine.Spy; url: string };

  const mockUser: AuthUser = {
    id: 1,
    firstname: 'Jean',
    lastname: 'Test',
    email: 'jean@example.com',
    roles: ['ROLE_USER'],
    phone: '000',
    photoUrl: '',
    userSubscriptions: [],
  };

  beforeEach(() => {
    sessionStorage.clear();

    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    httpSpy.get.and.returnValue(of(false));
    httpSpy.post.and.returnValue(of(void 0));

    routerSpy = {
      navigate: jasmine.createSpy('navigate'),
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
      url: '/current',
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('markAsLoggedOut clears signals', () => {
    service.userSignal.set(mockUser);
    service.isLoggedInSignal.set(true);

    service.markAsLoggedOut();

    expect(service.userSignal()).toBeNull();
    expect(service.isLoggedInSignal()).toBeFalse();
  });

  it('requireAuth navigates to login and sets return url when not logged', () => {
    const result = service.requireAuth();
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(sessionStorage.getItem('auth_return_url')).toBe(routerSpy.url);
  });

  it('requireRole returns true only when user has role', () => {
    service.userSignal.set({ ...mockUser, roles: ['ROLE_ADMIN'] });
    expect(service.requireRole('ROLE_ADMIN')).toBeTrue();
    expect(service.requireRole('ROLE_USER')).toBeFalse();
  });

  describe('HTTP methods', () => {
    it("login appelle http.post puis isAuthenticated et charge l'utilisateur", (done) => {
      httpSpy.post.and.returnValue(of({}));
      // first call to get -> isAuthenticated, second -> getCurrentUser
      httpSpy.get.and.returnValues(of(true), of(mockUser));

      service.login('jean@example.com', 'pass').subscribe({
        next: (res) => {
          expect(res).toBeTrue();
          expect(httpSpy.post).toHaveBeenCalledWith(
            'http://localhost:8080/auth/login',
            { email: 'jean@example.com', password: 'pass' },
            jasmine.objectContaining({ withCredentials: true, observe: 'response' }),
          );
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('firstLogin appelle POST /auth/register', (done) => {
      httpSpy.post.and.returnValue(of('ok'));
      service.firstLogin('pass', 'token').subscribe({
        next: (res) => {
          expect(res).toBe('ok');
          expect(httpSpy.post).toHaveBeenCalledWith(
            'http://localhost:8080/auth/register',
            { password: 'pass', registrationToken: 'token' },
            jasmine.objectContaining({ responseType: 'text', withCredentials: true }),
          );
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('askNewPassword appelle POST /auth/forgot-password', (done) => {
      httpSpy.post.and.returnValue(of('sent'));
      service.askNewPassword('jean@example.com').subscribe({
        next: (res) => {
          expect(res).toBe('sent');
          expect(httpSpy.post).toHaveBeenCalledWith(
            'http://localhost:8080/auth/forgot-password',
            { email: 'jean@example.com' },
            jasmine.objectContaining({ responseType: 'text' }),
          );
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('resetPassword appelle POST /auth/reset-password', (done) => {
      httpSpy.post.and.returnValue(of('reset'));
      service.resetPassword('resetToken', 'newPass').subscribe({
        next: (res) => {
          expect(res).toBe('reset');
          expect(httpSpy.post).toHaveBeenCalledWith(
            'http://localhost:8080/auth/reset-password',
            { resetPasswordToken: 'resetToken', newPassword: 'newPass' },
            jasmine.objectContaining({ responseType: 'text' }),
          );
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('isAuthenticated appelle GET /auth/check', (done) => {
      httpSpy.get.and.returnValue(of(true));
      service.isAuthenticated().subscribe({
        next: (res) => {
          expect(res).toBeTrue();
          expect(httpSpy.get).toHaveBeenCalledWith(
            'http://localhost:8080/auth/check',
            jasmine.objectContaining({ withCredentials: true }),
          );
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('getCurrentUser appelle GET /auth/me', (done) => {
      httpSpy.get.and.returnValue(of(mockUser));
      service.getCurrentUser().subscribe({
        next: (user) => {
          expect(user).toEqual(mockUser);
          expect(httpSpy.get).toHaveBeenCalledWith(
            'http://localhost:8080/auth/me',
            jasmine.objectContaining({ withCredentials: true }),
          );
          done();
        },
        error: (err) => done.fail(err),
      });
    });

    it('logout appelle POST /auth/logout et navigue vers /login', (done) => {
      httpSpy.post.and.returnValue(of(void 0));
      service.logout().subscribe({
        next: () => {
          expect(httpSpy.post).toHaveBeenCalledWith(
            'http://localhost:8080/auth/logout',
            {},
            jasmine.objectContaining({ withCredentials: true }),
          );
          expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/login']);
          done();
        },
        error: (err) => done.fail(err),
      });
    });
  });
});
