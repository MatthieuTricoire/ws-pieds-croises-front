import { Component, signal } from '@angular/core';

interface Toast {
  title?: string;
  content: string;
  type: 'info' | 'error' | 'warning';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  toasts = signal<Toast[]>([]);
  toast: Toast = {
    title: 'STOP IT',
    content: 'Tu vas le regretter ...!',
    type: 'error',
  };

  addToast(toast: Toast) {
    this.toasts.update((prev) => {
      const newToasts = prev.length >= 4 ? prev.slice(1) : prev;
      return [...newToasts, toast];
    });
  }

  removeAllToasts() {
    this.toasts.set([]);
  }
}
