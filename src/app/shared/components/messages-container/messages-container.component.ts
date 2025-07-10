import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../../../chore/services/message.service';
import { Message } from '../../models/message';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-messages-container',
  imports: [MessageComponent],
  templateUrl: './messages-container.component.html',
  styleUrl: './messages-container.component.css',
})
export class MessagesContainerComponent implements OnInit {
  messages: Message[] = [];
  currentSlide = 0;
  #messageService = inject(MessageService);

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.messages.length) % this.messages.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.messages.length;
  }

  ngOnInit(): void {
    this.#messageService.getActiveMessages().subscribe({
      next: (messages: Message[]) => {
        this.messages = messages;
      },
      error: (error) => {
        console.error('Error fetching messages:', error);
      },
    });
  }
}
