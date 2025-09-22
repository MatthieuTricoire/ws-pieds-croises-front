import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../../../chore/services/message.service';
import { NgClass } from '@angular/common';
import { LucideAngularModule, PlusIcon, Trash } from 'lucide-angular';
import { Message } from '../../models/message';
import { ModalService } from '../../../chore/services/modal.service';
import { MessageCreationFormComponent } from '../forms/message-creation-form/message-creation-form.component';

@Component({
  selector: 'app-messages-table',
  imports: [NgClass, LucideAngularModule, MessageCreationFormComponent],
  templateUrl: './messages-table.component.html',
  styleUrl: './messages-table.component.css',
})
export class MessagesTableComponent implements OnInit {
  readonly trashIcon = Trash;
  readonly plusIcon = PlusIcon;

  #messageService = inject(MessageService);
  #modalService = inject(ModalService);

  messages = this.#messageService.messages;

  ngOnInit(): void {
    this.#messageService.loadAllMessages().subscribe();
  }

  async confirmDelete(message: Message) {
    const confirmed = await this.#modalService.confirmDelete(
      'Supprimer le message',
      'Êtes-vous sûr de vouloir supprimer ce message ?',
    );
    if (confirmed) {
      this.#messageService.deleteMessage(message.id).subscribe({
        next: () => {
          this.#messageService.loadAllMessages().subscribe();
        },
        error: (err) => {
          console.error('Error during deleting message', err);
        },
      });
    }
  }

  toggleMessageStatus(message: Message, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const newStatus = isChecked ? 'ACTIVE' : 'INACTIVE';
    this.#messageService.updateMessageStatus(message.id, newStatus).subscribe({
      next: () => {
        this.#messageService.loadAllMessages().subscribe();
      },
      error: (err) => {
        console.error('Error during updating message status', err);
      },
    });
  }

  openCreateMessageModal() {
    this.#modalService.show('create-message-modal');
  }
}
