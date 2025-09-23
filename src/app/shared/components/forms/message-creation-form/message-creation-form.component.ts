import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../../../chore/services/message.service';
import { ModalService } from '../../../../chore/services/modal.service';
import { ToastService } from '../../../../chore/services/toast.service';

@Component({
  selector: 'app-message-creation-form',
  imports: [ReactiveFormsModule],
  templateUrl: './message-creation-form.component.html',
})
export class MessageCreationFormComponent {
  #fb = inject(FormBuilder);
  #messageService = inject(MessageService);
  #modalService = inject(ModalService);
  #toastService = inject(ToastService);

  isLoading = signal(false);

  messageTypes = [
    { value: 'INFORMATION', label: 'Information' },
    { value: 'EVENT', label: 'Évènement' },
    { value: 'ALERT', label: 'Alerte' },
    { value: 'REMINDER', label: 'Rappel' },
  ];

  messageForm: FormGroup = this.#fb.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]],
    messageType: ['', [Validators.required]],
  });

  async onSubmit() {
    if (this.messageForm.valid) {
      this.isLoading.set(true);
      const messageData = this.messageForm.getRawValue();

      this.#messageService.createMessage(messageData).subscribe({
        next: () => {
          this.#toastService.show('success', 'Message créé avec succès');
          this.#messageService.loadAllMessages().subscribe();
        },
        error: () => {
          this.#toastService.show('error', 'Erreur lors de la création du message');
        },
        complete: () => {
          this.isLoading.set(false);
          this.closeModal();
        },
      });
    }
  }

  closeModal() {
    this.#modalService.close('create-message-modal');
    this.messageForm.reset();
  }
}
