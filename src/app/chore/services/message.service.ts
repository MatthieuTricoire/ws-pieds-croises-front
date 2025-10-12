import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { Message } from '../../shared/models/message';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  #apiUrl = environment.apiUrl + '/messages';
  #http = inject(HttpClient);

  #messages = signal<Message[]>([]);
  #error = signal<string | null>(null);
  #loading = signal<boolean>(false);

  messages = this.#messages.asReadonly();
  error = this.#error.asReadonly();
  loading = this.#loading.asReadonly();

  activesMessages = computed(() => {
    return this.#messages().filter((msg) => msg.messageStatus === 'ACTIVE');
  });

  loadAllMessages() {
    const messageTypeLabels = {
      INFORMATION: 'Info',
      EVENT: 'Évènement',
      ALERT: 'Alerte',
      REMINDER: 'Rappel',
    } as const;
    this.#loading.set(true);
    this.#error.set(null);

    return this.#http.get<Message[]>(this.#apiUrl, { withCredentials: true }).pipe(
      tap((messages) => {
        const transformedMessages = messages.map((message) => ({
          ...message,
          messageTypeLabel: messageTypeLabels[message.messageType],
        }));

        this.#messages.set(transformedMessages);
        this.#loading.set(false);
      }),
      catchError((error) => {
        this.#error.set('Erreur lors du chargement des messages');
        this.#loading.set(false);
        console.error('Error loading messages:', error);
        return of([]);
      }),
    );
  }

  getAllMessages(): Observable<Message[]> {
    return this.#http.get<Message[]>(this.#apiUrl, { withCredentials: true });
  }

  updateMessageStatus(messageId: string, status: string): Observable<Message> {
    return this.#http.patch(`${this.#apiUrl}/${messageId}/status?status=${status}`, null, {
      withCredentials: true,
    }) as Observable<Message>;
  }

  deleteMessage(messageId: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/${messageId}`, { withCredentials: true });
  }

  createMessage(
    messageData: Omit<Message, 'id' | 'messageStatus' | 'messageTypeLabel'>,
  ): Observable<Message> {
    return this.#http.post<Message>(this.#apiUrl, messageData, { withCredentials: true });
  }
}
