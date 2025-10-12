import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskResetPasswordPageComponent } from './ask-reset-password-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AskResetPasswordPageComponent', () => {
  let component: AskResetPasswordPageComponent;
  let fixture: ComponentFixture<AskResetPasswordPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskResetPasswordPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AskResetPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
