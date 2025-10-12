import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { FirstLoginFormComponent } from './first-login-form.component';
import { AuthService } from '../../../../chore/services/auth.service';
import { ToastService } from '../../../../chore/services/toast.service';

describe('FirstLoginFormComponent', () => {
  let component: FirstLoginFormComponent;
  let fixture: ComponentFixture<FirstLoginFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['firstLogin']);
    authServiceSpy.firstLogin.and.returnValue(of('ok'));
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FirstLoginFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should enable the submit button when form is valid', () => {
    component.firstLoginForm.controls['password'].setValue('azerty123');
    component.firstLoginForm.controls['confirmPassword'].setValue('azerty123');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('button');
    expect(button.disabled).toBeFalse();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
