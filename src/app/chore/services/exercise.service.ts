import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise } from '../../shared/models/exercise';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  #apiUrl = 'http://localhost:8080/exercises';
  #http = inject(HttpClient);

  getExercises(): Observable<Exercise[]> {
    return this.#http.get<Exercise[]>(this.#apiUrl, {
      withCredentials: true,
    });
  }
}
