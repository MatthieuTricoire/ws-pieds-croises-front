import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PerformanceHistory } from '../../shared/models/performanceHistory';

@Injectable({
  providedIn: 'root',
})
export class PerformanceHistoryService {
  #apiUrl = 'http://localhost:8080/performance-histories';
  #http = inject(HttpClient);

  getPerformanceHistory(months?: number): Observable<PerformanceHistory[]> {
    return this.#http.get<PerformanceHistory[]>(this.#apiUrl, {
      params: months ? { months: months.toString() } : {},
      withCredentials: true,
    });
  }
}
