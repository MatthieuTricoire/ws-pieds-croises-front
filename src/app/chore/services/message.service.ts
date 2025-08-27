import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../../shared/models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'http://localhost:8080/messages';

  constructor(private http: HttpClient) {}

  getActiveMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}?status=active`, { withCredentials: true });
  }
}
