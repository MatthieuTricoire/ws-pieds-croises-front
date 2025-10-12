import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    service = new ModalService();
  });

  afterEach(() => {
    document.querySelectorAll('dialog').forEach((d) => d.remove());
  });

  describe('show', () => {
    it('should call showModal on the dialog element', () => {
      const modalId = 'test-modal';
      const dialog = document.createElement('dialog');
      dialog.id = modalId;
      dialog.showModal = jasmine.createSpy('showModal');
      document.body.appendChild(dialog);
      service.show(modalId);
      expect(dialog.showModal).toHaveBeenCalled();
      dialog.remove();
    });
  });

  describe('close', () => {
    it('should call close on the dialog element', () => {
      const modalId = 'test-modal';
      const dialog = document.createElement('dialog');
      dialog.id = modalId;
      dialog.close = jasmine.createSpy('close');
      document.body.appendChild(dialog);
      service.close(modalId);
      expect(dialog.close).toHaveBeenCalled();
      dialog.remove();
    });
  });

  describe('confirmDelete', () => {
    it('should resolve true when confirm is clicked', async () => {
      const promise = service.confirmDelete('Titre', 'Message');
      await new Promise((r) => setTimeout(r));
      const modal = document.body.querySelector('dialog');
      const confirmBtn = modal?.querySelector('[data-action="confirm"]') as HTMLButtonElement;
      expect(confirmBtn).toBeDefined();
      confirmBtn.click();
      const result = await promise;
      expect(result).toBeTrue();
    });

    it('should resolve false when cancel is clicked', async () => {
      const promise = service.confirmDelete('Titre', 'Message');
      await new Promise((r) => setTimeout(r));
      const modal = document.body.querySelector('dialog');
      const cancelBtn = modal?.querySelector('[data-action="cancel"]') as HTMLButtonElement;
      expect(cancelBtn).toBeDefined();
      cancelBtn.click();
      const result = await promise;
      expect(result).toBeFalse();
    });

    it('should resolve false when dialog is closed', async () => {
      const promise = service.confirmDelete('Titre', 'Message');
      await new Promise((r) => setTimeout(r));
      const modal = document.body.querySelector('dialog') as HTMLDialogElement;
      expect(modal).toBeDefined();
      modal.close();
      modal.dispatchEvent(new Event('close'));
      await new Promise((r) => setTimeout(r, 10));
      const result = await promise;
      expect(result).toBeFalse();
    });
  });

  describe('alert', () => {
    it('should resolve when OK is clicked', async () => {
      const promise = service.alert('Titre', 'Message', 'info');
      await new Promise((r) => setTimeout(r));
      const modal = document.body.querySelector('dialog');
      const okBtn = modal?.querySelector('[data-action="ok"]') as HTMLButtonElement;
      expect(okBtn).toBeDefined();
      okBtn.click();
      await expectAsync(promise).toBeResolved();
    });

    it('should resolve when dialog is closed', async () => {
      const promise = service.alert('Titre', 'Message', 'info');
      await new Promise((r) => setTimeout(r));
      const modal = document.body.querySelector('dialog') as HTMLDialogElement;
      expect(modal).toBeDefined();
      modal.close();
      modal.dispatchEvent(new Event('close'));
      await new Promise((r) => setTimeout(r, 10));
      await expectAsync(promise).toBeResolved();
    });
  });
});
