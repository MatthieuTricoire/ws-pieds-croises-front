import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseReservationPageComponent } from './course-reservation-page.component';

describe('CourseReservationPageComponent', () => {
  let component: CourseReservationPageComponent;
  let fixture: ComponentFixture<CourseReservationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseReservationPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseReservationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
