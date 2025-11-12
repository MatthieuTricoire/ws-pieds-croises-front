import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesCountComponent } from './courses-count.component';

describe('CoursesCountComponent', () => {
  let component: CoursesCountComponent;
  let fixture: ComponentFixture<CoursesCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesCountComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
