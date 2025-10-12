import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseReservationPageComponent } from './course-reservation-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CourseReservationPageComponent', () => {
  let component: CourseReservationPageComponent;
  let fixture: ComponentFixture<CourseReservationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseReservationPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseReservationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
