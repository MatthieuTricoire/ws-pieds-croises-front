import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreationFormComponent } from './user-creation-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserCreationFormComponent', () => {
  let component: UserCreationFormComponent;
  let fixture: ComponentFixture<UserCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreationFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
