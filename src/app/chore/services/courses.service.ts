import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Course } from '../../shared/models/course';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

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

  registerToCourse(courseId: number): Observable<void> {
    return this.http.put<void>(
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

  // TODO la waiting list est gérée côté back (sur la méthode addUserToCourse), il faudrait revoir la liste d'attente côté front
  joinWaitingList(courseId: number): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${courseId}/waiting-list`,
      {},
      {
        withCredentials: true,
      },
    );
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
