import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<Course[]>(`${this.apiUrl}/by-day`, {
      params: { date: formattedDate },
      withCredentials: true,
    });
  }

  registerToCourse(courseId: number): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${courseId}/register`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  unregisterFromCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}/unsubscribe`, {
      withCredentials: true,
    });
  }

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
    return this.http.get<Course>(`${this.apiUrl}/${courseId}`, {
      withCredentials: true,
    });
  }
}
