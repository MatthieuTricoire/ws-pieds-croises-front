import { ToastService } from './toast.service';
import { LucideIconData } from 'lucide-angular';

describe('ToastService', () => {
  let service: ToastService;
  const mockIcon: LucideIconData = [['path', { d: 'M9 12l2 2 4-4' }]];

  beforeEach(() => {
    service = new ToastService();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should add a toast when show is called', () => {
    service.show('success', 'Message de succès', 'Bravo', mockIcon, true);
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].alertType).toBe('success');
    expect(toasts[0].message).toBe('Message de succès');
    expect(toasts[0].title).toBe('Bravo');
    expect(toasts[0].iconName).toEqual(mockIcon);
    expect(toasts[0].showIcon).toBeTrue();
  });

  it('should remove the toast after 5 seconds', () => {
    jasmine.clock().install();

    service.show('info', 'Message info');
    expect(service.toasts().length).toBe(1);

    jasmine.clock().tick(5000);

    expect(service.toasts().length).toBe(0);

    jasmine.clock().uninstall();
  });

  it('should remove the toast when dismiss is called', () => {
    service.show('warning', 'Attention !');
    const toast = service.toasts()[0];
    service.dismiss(toast.id);
    expect(service.toasts().length).toBe(0);
  });

  it('should allow multiple toasts', () => {
    service.show('info', 'Info 1');
    service.show('success', 'Info 2');
    expect(service.toasts().length).toBe(2);
    expect(service.toasts()[0].message).toBe('Info 1');
    expect(service.toasts()[1].message).toBe('Info 2');
  });

  it('should use default values when optional parameters are not provided', () => {
    service.show('error', "Message d'erreur");
    const toast = service.toasts()[0];
    expect(toast.alertType).toBe('error');
    expect(toast.message).toBe("Message d'erreur");
    expect(toast.title).toBeUndefined();
    expect(toast.iconName).toBeUndefined();
    expect(toast.showIcon).toBeTrue();
  });
});
