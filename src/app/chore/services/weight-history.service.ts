import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeightHistory } from '../../shared/models/weightHistory';

@Injectable({
  providedIn: 'root',
})
export class WeightHistoryService {
  #apiUrl = 'http://localhost:8080/weight-histories';
  #http = inject(HttpClient);

  getWeightHistory(months?: number): Observable<WeightHistory[]> {
    return this.#http.get<WeightHistory[]>(this.#apiUrl, {
      params: months ? { months: months.toString() } : {},
      withCredentials: true,
    });
  }
}
