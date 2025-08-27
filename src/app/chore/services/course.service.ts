import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Course } from '../../shared/models/course';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:8080/courses';
  #http = inject(HttpClient);

  getCoursesNextTwoWeeks(): Observable<Course[]> {
    return this.#http
      .get<Course[]>(`${this.apiUrl}/next-two-weeks`, { withCredentials: true })
      .pipe(
        map((courses) =>
          courses.map((course) => ({
            ...course,
            startDatetime: new Date(course.startDatetime), // conversion string -> Date
          })),
        ),
        catchError((error) => {
          console.error('Error fetching courses', error);
          return throwError(() => error);
        }),
      );
  }
}
