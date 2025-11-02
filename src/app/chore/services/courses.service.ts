import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';
import { Course, CreateCourse } from '../../shared/models/course';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private coursesUpdated$ = new Subject<void>();
  onCourseUpdated = this.coursesUpdated$.asObservable();

  createCourse(courseData: CreateCourse): Observable<Course> {
    return this.http
      .post<Course>(`${this.apiUrl}/courses`, courseData, { withCredentials: true })
      .pipe(tap(() => this.coursesUpdated$.next()));
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`, { withCredentials: true });
  }

  deleteCourse(courseId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/courses/${courseId}`, { withCredentials: true })
      .pipe(tap(() => this.coursesUpdated$.next()));
  }

  getCoursesByDay(date: Date): Observable<Course[]> {
    const formattedDate = date.toISOString().split('T')[0];
    return this.http
      .get<Course[]>(`${this.apiUrl}/courses/by-day`, {
        params: { date: formattedDate },
        withCredentials: true,
      })
      .pipe(
        map((courses) =>
          courses.map((c) => ({
            ...c,
            usersId: c.userCoursesInfo?.map((u) => u.userId) ?? [],
          })),
        ),
      );
  }

  registerToCourse(courseId: number): Observable<Course> {
    return this.http.put<Course>(
      `${this.apiUrl}/userCourses/${courseId}/register`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  unregisterFromCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/userCourses/${courseId}/unsubscribe`, {
      withCredentials: true,
    });
  }

  getCourseById(courseId: number): Observable<Course> {
    return this.http
      .get<Course>(`${this.apiUrl}/courses/${courseId}`, {
        withCredentials: true,
      })
      .pipe(
        map((c) => ({
          ...c,
          usersId: c.userCoursesInfo?.map((u) => u.userId) ?? [],
        })),
      );
  }
}
