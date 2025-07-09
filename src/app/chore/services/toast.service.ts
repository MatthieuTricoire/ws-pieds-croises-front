import { Injectable, signal } from '@angular/core';
import { LucideIconData } from 'lucide-angular';

export interface Toast {
  id: number;
  alertType: AlertType;
  title?: string;
  message: string;
  iconName?: LucideIconData;
  showIcon?: boolean;
}

type AlertType = 'info' | 'success' | 'warning' | 'error';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(
    alertType: AlertType = 'info',
    message: string,
    title?: string,
    iconName?: LucideIconData,
    showIcon = true,
  ): void {
    const id = Math.random();
    this.toasts.update((prev) => [...prev, { id, alertType, message, title, iconName, showIcon }]);
    setTimeout(() => {
      this.dismiss(id);
    }, 5000);
  }

  dismiss(id: number): void {
    this.toasts.update((prev) => prev.filter((toast) => toast.id !== id));
  }
}
