import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoxInfo } from '../../shared/models/boxInfo';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  private apiUrl = 'http://localhost:8080/boxes';

  constructor(private http: HttpClient) {}

  getBoxInfo(): Observable<BoxInfo> {
    return this.http.get<BoxInfo>(`${this.apiUrl}/box-info`);
  }
}
