import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  show(modalId: string) {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    modal?.showModal();
  }

  close(modalId: string) {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    modal?.close();
  }

  async confirmDelete(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const modalId = 'confirm-delete-modal-' + Date.now();
      const modalHtml = `
        <dialog id="${modalId}" class="modal">
          <div class="modal-box">
            <h3 class="font-bold text-lg">${title}</h3>
            <p class="py-4">${message}</p>
            <div class="modal-action">
              <button class="btn btn-ghost" data-action="cancel">
                Annuler
              </button>
              <button class="btn btn-error" data-action="confirm">
                Confirmer
              </button>
            </div>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button type="submit">close</button>
          </form>
        </dialog>
      `;

      // Injecter dans le DOM
      document.body.insertAdjacentHTML('beforeend', modalHtml);

      const modal = document.getElementById(modalId) as HTMLDialogElement;

      // Variables pour suivre l'état
      let isResolved = false;

      const cleanup = () => {
        if (!isResolved) {
          isResolved = true;
          modal.remove();
        }
      };

      const resolveAndCleanup = (result: boolean) => {
        if (!isResolved) {
          isResolved = true;
          resolve(result);
          modal.close();
          cleanup();
        }
      };

      // Ajouter les event listeners
      const cancelBtn = modal.querySelector('[data-action="cancel"]') as HTMLButtonElement;
      const confirmBtn = modal.querySelector('[data-action="confirm"]') as HTMLButtonElement;

      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resolveAndCleanup(false);
      });

      confirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resolveAndCleanup(true);
      });

      // Gérer la fermeture par ESC ou backdrop
      modal.addEventListener('close', () => {
        if (!isResolved) {
          isResolved = true;
          resolve(false); // Clic à l'extérieur = annuler
          cleanup();
        }
      });

      // Ouvrir la modal
      modal.showModal();
    });
  }

  async alert(
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
  ): Promise<void> {
    return new Promise((resolve) => {
      const modalId = 'alert-modal-' + Date.now();
      const buttonClass = this.#getAlertButton(type);
      const modalHtml = `
        <dialog id="${modalId}" class="modal">
          <div class="modal-box w-11/12 max-w-sm">
            <h3 class="font-bold text-lg">${title}</h3>
            <p class="py-4">${message}</p>
            <div class="modal-action">
              <button class="btn ${buttonClass}" data-action="ok">
                OK
              </button>
            </div>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button type="submit">close</button>
          </form>
        </dialog>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      const modal = document.getElementById(modalId) as HTMLDialogElement;

      let isResolved = false;

      const cleanup = () => {
        if (!isResolved) {
          isResolved = true;
          modal.remove();
        }
      };

      const resolveAndCleanup = () => {
        if (!isResolved) {
          isResolved = true;
          resolve();
          modal.close();
          cleanup();
        }
      };

      const okBtn = modal.querySelector('[data-action="ok"]') as HTMLButtonElement;

      okBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resolveAndCleanup();
      });

      modal.addEventListener('close', () => {
        if (!isResolved) {
          isResolved = true;
          resolve();
          cleanup();
        }
      });

      modal.showModal();
    });
  }

  #getAlertButton(type: 'success' | 'warning' | 'error' | 'info'): string {
    switch (type) {
      case 'success':
        return 'btn-success';
      case 'warning':
        return 'btn-warning';
      case 'error':
        return 'btn-error';
      case 'info':
        return 'btn-info';
      default:
        return 'btn-primary';
    }
  }
}
