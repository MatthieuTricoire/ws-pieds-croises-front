import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoxInfo } from '../../shared/models/boxInfo';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  private apiUrl = 'http://localhost:8080/boxes';
  private boxInfoSubject = new BehaviorSubject<BoxInfo | null>(null);
  boxInfo$ = this.boxInfoSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchBoxInfo() {
    this.http.get<BoxInfo>(`${this.apiUrl}/box-info`, { withCredentials: true }).subscribe({
      next: (data) => this.boxInfoSubject.next(data),
      error: (error) => console.error('Error while loading the box', error),
    });
  }

  updateBoxInfo(data: BoxInfo) {
    this.http.put<BoxInfo>(`${this.apiUrl}/box-info`, data, { withCredentials: true }).subscribe({
      next: (updatedBox) => this.boxInfoSubject.next(updatedBox),
      error: (error) => console.error('Error while updating the box', error),
    });
  }
}
