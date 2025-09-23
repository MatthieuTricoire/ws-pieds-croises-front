import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CoursesService } from './courses.service';
import { HttpClient } from '@angular/common/http';
import { Course } from '../../shared/models/course';

describe('CoursesService', () => {
  let service: CoursesService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  const sampleCourse: Course = {
    id: 1,
    title: 'Sample',
    description: 'desc',
    startDatetime: new Date('2025-01-01T10:00:00'),
    duration: 60,
    personLimit: 10,
    status: 'OPEN',
    usersId: [],
    coachName: 'Coach',
    coachId: 1,
  } as Course;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    });
    service = TestBed.inject(CoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCoursesByDay calls GET with formatted date and withCredentials', (done) => {
    const date = new Date('2024-12-31T12:34:56');
    httpSpy.get.and.returnValue(of([sampleCourse]));

    service.getCoursesByDay(date).subscribe({
      next: (res) => {
        expect(res).toEqual([sampleCourse]);
        expect(httpSpy.get).toHaveBeenCalledWith(
          'http://localhost:8080/courses/by-day',
          jasmine.objectContaining({ params: { date: '2024-12-31' }, withCredentials: true }),
        );
        done();
      },
      error: (err) => done.fail(err),
    });
  });

  it('getCoursesByDay propagates error', (done) => {
    const date = new Date('2024-12-31T12:34:56');
    const err = new Error('fail');
    httpSpy.get.and.returnValue(throwError(() => err));

    service.getCoursesByDay(date).subscribe({
      next: () => done.fail('should have errored'),
      error: (e) => {
        expect(e).toBe(err);
        done();
      },
    });
  });

  it('registerToCourse calls PUT with empty body and withCredentials', (done) => {
    httpSpy.put = jasmine.createSpy().and.returnValue(of(void 0));
    const id = 2;

    service.registerToCourse(id).subscribe({
      next: () => {
        expect(httpSpy.put).toHaveBeenCalledWith(
          `http://localhost:8080/courses/${id}/register`,
          {},
          jasmine.objectContaining({ withCredentials: true }),
        );
        done();
      },
      error: (err) => done.fail(err),
    });
  });

  it('unregisterFromCourse calls DELETE with withCredentials', (done) => {
    httpSpy.delete = jasmine.createSpy().and.returnValue(of(void 0));
    const id = 3;

    service.unregisterFromCourse(id).subscribe({
      next: () => {
        expect(httpSpy.delete).toHaveBeenCalledWith(
          `http://localhost:8080/courses/${id}/unsubscribe`,
          jasmine.objectContaining({ withCredentials: true }),
        );
        done();
      },
      error: (err) => done.fail(err),
    });
  });

  it('joinWaitingList calls PUT waiting-list with empty body and withCredentials', (done) => {
    httpSpy.put = jasmine.createSpy().and.returnValue(of(void 0));
    const id = 4;

    service.joinWaitingList(id).subscribe({
      next: () => {
        expect(httpSpy.put).toHaveBeenCalledWith(
          `http://localhost:8080/courses/${id}/waiting-list`,
          {},
          jasmine.objectContaining({ withCredentials: true }),
        );
        done();
      },
      error: (err) => done.fail(err),
    });
  });

  it('getCourseById calls GET and returns course', (done) => {
    const id = 1;
    httpSpy.get.and.returnValue(of(sampleCourse));

    service.getCourseById(id).subscribe({
      next: (course) => {
        expect(course).toEqual(sampleCourse);
        expect(httpSpy.get).toHaveBeenCalledWith(
          `http://localhost:8080/courses/${id}`,
          jasmine.objectContaining({ withCredentials: true }),
        );
        done();
      },
      error: (err) => done.fail(err),
    });
  });

  it('getCourseById propagates error', (done) => {
    const id = 1;
    const err = new Error('not found');
    httpSpy.get.and.returnValue(throwError(() => err));

    service.getCourseById(id).subscribe({
      next: () => done.fail('should error'),
      error: (e) => {
        expect(e).toBe(err);
        done();
      },
    });
  });
});
