import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../../chore/services/message.service';
import { MessageComponent } from '../message/message.component';
import { TypographyComponent } from '../design-system/typography/typography.component';

@Component({
  selector: 'app-messages-container',
  imports: [MessageComponent, TypographyComponent],
  templateUrl: './messages-container.component.html',
})
export class MessagesContainerComponent implements OnInit {
  currentSlide = signal(0);
  #messageService = inject(MessageService);
  messages = this.#messageService.activesMessages;
  loading = this.#messageService.loading;
  error = this.#messageService.error;

  prevSlide() {
    this.currentSlide.set(
      (this.currentSlide() - 1 + this.messages().length) % this.messages().length,
    );
  }

  nextSlide() {
    this.currentSlide.set((this.currentSlide() + 1) % this.messages().length);
  }

  ngOnInit(): void {
    this.#messageService.loadAllMessages().subscribe();
  }
}
