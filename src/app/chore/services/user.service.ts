import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Course } from '../../shared/models/course';
import { AuthUser, CreateUser } from '../../shared/models/authUser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #apiUrl = 'http://localhost:8080/users';
  #http = inject(HttpClient);

  #users = signal<AuthUser[]>([]);
  #error = signal<string | null>(null);
  #loading = signal<boolean>(false);

  users = this.#users.asReadonly();
  error = this.#error.asReadonly();
  loading = this.#loading.asReadonly();

  createUser(userData: CreateUser): Observable<AuthUser> {
    this.#loading.set(true);
    this.#error.set(null);
    return this.#http.post<AuthUser>(this.#apiUrl, userData, { withCredentials: true }).pipe(
      tap((newUser) => {
        const currentUsers = this.#users();
        this.#users.set([...currentUsers, newUser]);
        this.#loading.set(false);
      }),
      catchError((error) => {
        this.#error.set('Error during user creation');
        this.#loading.set(false);
        console.error('Error creating user:', error);
        return throwError(() => error);
      }),
    );
  }

  loadAllUsers() {
    this.#loading.set(true);
    this.#error.set(null);
    return this.#http.get<AuthUser[]>(this.#apiUrl, { withCredentials: true }).pipe(
      tap((users) => {
        this.#users.set(users);
        this.#loading.set(false);
      }),
      catchError((error) => {
        this.#error.set('Error during users loading');
        this.#loading.set(false);
        console.error('Error loading users:', error);
        return of([]);
      }),
    );
  }

  updateUser(userId: number, userData: Partial<AuthUser>): Observable<AuthUser> {
    this.#loading.set(true);
    this.#error.set(null);
    return this.#http
      .put<AuthUser>(`${this.#apiUrl}/${userId}`, userData, { withCredentials: true })
      .pipe(
        tap((updatedUser) => {
          const currentUsers = this.#users();
          const updatedUsers = currentUsers.map((user) =>
            user.id === userId ? updatedUser : user,
          );
          this.#users.set(updatedUsers);
          this.#loading.set(false);
        }),
        catchError((error) => {
          this.#error.set('Error during user update');
          this.#loading.set(false);
          console.error('Error updating user:', error);
          return throwError(() => error);
        }),
      );
  }
  deleteUser(userId: number): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/${userId}`, { withCredentials: true });
  }

  getUserCourses(): Observable<Course[]> {
    return this.#http.get<Course[]>(`${this.#apiUrl}/courses`, { withCredentials: true }).pipe(
      map((courses) =>
        courses.map((course) => ({
          ...course,
          startDatetime: new Date(course.startDatetime),
        })),
      ),
      catchError((error) => {
        console.error('Error fetching courses', error);
        return throwError(() => error);
      }),
    );
  }
}
