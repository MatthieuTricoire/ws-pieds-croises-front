import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BoxInfo } from '../../shared/models/boxInfo';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  #apiUrl = environment.apiUrl;
  #http = inject(HttpClient);

  boxSignal = signal<BoxInfo | null>(null);

  fetchBoxInfo() {
    this.#http.get<BoxInfo>(`${this.#apiUrl}/box-info`, { withCredentials: true }).subscribe({
      next: (data) => this.boxSignal.set(data),
      error: (error) => console.error('Error while loading the box', error),
    });
  }

  updateBoxInfo(data: BoxInfo) {
    this.#http.put<BoxInfo>(`${this.#apiUrl}/box-info`, data, { withCredentials: true }).subscribe({
      next: (updatedBox) => this.boxSignal.set(updatedBox),
      error: (error) => console.error('Error while updating the box', error),
    });
  }
}
