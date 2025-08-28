import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Course } from '../../shared/models/course';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/users';
  #http = inject(HttpClient);

  getUserCourses(): Observable<Course[]> {
    return this.#http.get<Course[]>(`${this.apiUrl}/courses`, { withCredentials: true }).pipe(
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
