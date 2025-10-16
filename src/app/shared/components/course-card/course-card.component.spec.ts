import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseCardComponent } from './course-card.component';
import { Course } from '../../models/course';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from '../../../chore/services/auth.service';
import { CoursesService } from '../../../chore/services/courses.service';
import { UserSubscriptionService } from '../../../chore/services/user-subscription.service';
import { ToastService } from '../../../chore/services/toast.service';

describe('CourseCardComponent (minimal)', () => {
  let fixture: ComponentFixture<CourseCardComponent>;
  let component: CourseCardComponent;

  const mockCourse: Course = {
    id: 1,
    title: 'Test Course',
    description: 'Test Description',
    startDatetime: new Date('2024-10-10T14:00:00'),
    duration: 90,
    personLimit: 10,
    status: 'OPEN',
    usersId: [],
    coachName: 'Coach Test',
    coachId: 1,
    userCoursesInfo: [],
  };

  const mockAuthService = {
    userSignal: signal(null),
  } as Partial<AuthService> as AuthService;

  const mockCoursesService = jasmine.createSpyObj<CoursesService>('CoursesService', [
    'registerToCourse',
    'unregisterFromCourse',
    'joinWaitingList',
    'getCourseById',
  ]);
  mockCoursesService.registerToCourse.and.returnValue(of(void 0));
  mockCoursesService.unregisterFromCourse.and.returnValue(of(void 0));
  mockCoursesService.joinWaitingList.and.returnValue(of(void 0));
  mockCoursesService.getCourseById.and.returnValue(of(mockCourse));

  const mockUserSubscriptionService = jasmine.createSpyObj<UserSubscriptionService>(
    'UserSubscriptionService',
    ['canRegisterToCourse'],
  );
  mockUserSubscriptionService.canRegisterToCourse.and.returnValue(
    of({ isValid: true, canRegister: true }),
  );

  const mockToastService = jasmine.createSpyObj<ToastService>('ToastService', ['show']);
  mockToastService.show.and.callFake(() => undefined);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCardComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: UserSubscriptionService, useValue: mockUserSubscriptionService },
        { provide: ToastService, useValue: mockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('course', mockCourse);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
