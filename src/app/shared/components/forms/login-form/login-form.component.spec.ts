import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { LoginFormComponent } from './login-form.component';
import { AuthService } from '../../../../chore/services/auth.service';
import { ToastService } from '../../../../chore/services/toast.service';
import { ActivatedRoute } from '@angular/router';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: {}, params: of({}), queryParams: of({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component semantics', () => {
    it('should render the form', () => {
      const form = fixture.nativeElement.querySelector('form');
      expect(form).toBeDefined();
    });
    it('should render email and password fields', () => {
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]');
      const passwordInput = fixture.nativeElement.querySelector('input[type="password"]');
      expect(emailInput).toBeDefined();
      expect(passwordInput).toBeDefined();
    });
    it('should render a submit button', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button).toBeDefined();
    });
  });

  describe('Component method', () => {
    it('should enable submit button when form is valid', () => {
      component.loginForm.controls['email'].setValue('jean@example.com');
      component.loginForm.controls['password'].setValue('azerty123');
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBeFalse();
    });
    it('should call authService.login and show success toast on success', fakeAsync(() => {
      component.loginForm.controls['email'].setValue('jean@example.com');
      component.loginForm.controls['password'].setValue('azerty123');
      authServiceSpy.login.and.returnValue(of(true));
      fixture.detectChanges();
      component.onSubmit();
      tick();
      expect(authServiceSpy.login).toHaveBeenCalledWith('jean@example.com', 'azerty123');
      expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Connexion réussi!', '');
    }));
    it('should show error toast on 401 error', fakeAsync(() => {
      component.loginForm.controls['email'].setValue('jean@example.com');
      component.loginForm.controls['password'].setValue('azerty123');
      authServiceSpy.login.and.returnValue(throwError(() => ({ status: 401 })));
      fixture.detectChanges();
      component.onSubmit();
      tick();
      expect(toastServiceSpy.show).toHaveBeenCalledWith(
        'error',
        'Email ou mot de passe incorrect.',
        'Erreur de connexion',
      );
    }));
    it('should show generic error toast on other error', fakeAsync(() => {
      component.loginForm.controls['email'].setValue('jean@example.com');
      component.loginForm.controls['password'].setValue('azerty123');
      authServiceSpy.login.and.returnValue(throwError(() => ({ status: 500 })));
      fixture.detectChanges();
      component.onSubmit();
      tick();
      expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Une erreur est survenue.', '');
    }));
  });
});
